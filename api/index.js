const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const OrganiserModel = require('./models/Organiser')
const MessageModel = require('./models/Message');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cloudinary = require("./config/cloudinary");
// const { getDashboardStats } = require("../controllers/eventController");
const Ticket = require("./models/Ticket");
const http = require("http");
const socketIo = require("socket.io");
const Razorpay = require('razorpay');
const fs = require("fs");

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "bsbsfbrnsftentwnnwnwn";

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:5173",
   })
);

mongoose.connect(process.env.MONGO_URL).then(() => {
   console.log("MongoDb Connected")
}).catch((Err) => {
   consol.log("MongoDb error occured : ", Err)
});

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

app.get("/test", (req, res) => {
   res.json("test ok");
});

app.post("/register", async (req, res) => {
   const { name, email, password, role } = req.body;

   try {
      // Check if the email already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ error: "Email already in use." });
      }

      // Create the user
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
         role,
      });

      // If the role is 'organizer', create an entry in the OrganiserModel
      if (role === "organizer") {
         const newOrganizer = new OrganiserModel({
            user: userDoc._id, // Reference to the newly created user
            name: userDoc.name,
            email: userDoc.email,
         });
         await newOrganizer.save();
      }

      res.json(userDoc);
   } catch (e) {
      console.error("Error during registration:", e);
      res.status(422).json({ error: e.message || "Registration failed" });
   }
});


app.post("/login", async (req, res) => {
   const { email, password } = req.body;

   const userDoc = await UserModel.findOne({ email });

   if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
   }

   const passOk = bcrypt.compareSync(password, userDoc.password);
   if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
   }

   jwt.sign(
      {
         email: userDoc.email,
         id: userDoc._id,
      },
      jwtSecret,
      {},
      (err, token) => {
         if (err) {
            return res.status(500).json({ error: "Failed to generate token" });
         }
         res.cookie("token", token).json(userDoc);
      }
   );
});

app.get("/profile", (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
         if (err) {
            return res.status(401).json({ error: "Invalid token" });
         }

         // Find the user by ID
         const user = await UserModel.findById(userData.id);
         if (!user) {
            return res.status(404).json({ error: "User  not found" });
         }

         // Destructure user properties
         const { name, email, _id, role } = user;
         res.json({ name, email, _id, role });
      });
   } else {
      res.json(null);
   }
});

app.get('/organizers', async (req, res) => {

})

app.get("/organizers/:email", async (req, res) => {
   const { email } = req.params;

   try {
      const organizer = await OrganiserModel.findOne({ email: email });
      if (!organizer) {
         return res.status(404).json({ message: "Organizer not found" });
      }
      res.json(organizer);
   } catch (error) {
      console.error("Error fetching organizer:", error);
      res.status(500).json({ message: "Failed to fetch organizer" });
   }
});


app.get("/organizer/events/:organizerEmail", async (req, res) => {
   const { organizerEmail } = req.params;
   try {
      const events = await Event.find({ email: organizerEmail });
      res.json(events);
   } catch (error) {
      console.error("Error fetching organizer events:", error);
      res.status(500).json({ message: "Server error" });
   }
});

app.post("/logout", (req, res) => {
   res.cookie("token", "").json(true);
});

app.post("/auth/forgot-password", async (req, res) => {
   const { email } = req.body;

   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.status(404).json({ error: "User  not found" });
      }

      // Generate a password reset token
      const token = crypto.randomBytes(20).toString('hex');

      // Set token and expiration on user
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
         service: "Gmail",
         auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email password
         },
      });

      const mailOptions = {
         to: user.email,
         from: process.env.EMAIL_USER,
         subject: "Password Reset",
         text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `http://localhost:5173/reset-password/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Password reset email sent" });
   } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
   }
});

app.post("/auth/reset-password/:token", async (req, res) => {
   const { token } = req.params;
   const { password } = req.body;

   try {
      const user = await UserModel.findOne({
         resetPasswordToken: token,
         resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(400).json({ error: "Password reset token is invalid or has expired." });
      }

      user.password = bcrypt.hashSync(password, bcryptSalt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      res.status(200).json({ message: "Password has been reset successfully." });
   } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password" });
   }
});

const eventSchema = new mongoose.Schema({
   owner: String,
   title: { type: String, required: true },
   email: { type: String, required: true },
   status: { type: String, enum: ["pending", "approved", "cancelled"], default: "pending" },
   ticketSold: { type: Number, default: 0 },
   refunds: { type: Number, default: 0 },
   createdAt: { type: Date, default: Date.now },
   description: String,
   organizedBy: { type: String }, // Reference to Organiser,
   eventDate: Date,
   eventTime: String,
   location: String,
   Participants: { type: Number, default: 0 },
   Count: { type: Number, default: 0 },
   Income: { type: Number, default: 0 },
   ticketPrice: { type: Number, default: 0 },
   Quantity: { type: Number, default: 0 },
   image: String,
   likes: { type: Number, default: 0 },
   Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);

// Create Event API
app.post("/createEvent", upload.single("image"), async (req, res) => {
   const { token } = req.cookies; // Get the token from cookies
   if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
   }

   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
         return res.status(401).json({ error: "Invalid token" });
      }

      try {
         const eventData = req.body;
         const user = await UserModel.findById(userData.id); // Fetch the user to get their name
         eventData.organizedBy = user.name; // Set the organizer's name

         // Check if required fields are present
         if (!eventData.title || !eventData.eventDate || !eventData.eventTime || !eventData.location || !eventData.ticketPrice) {
            return res.status(400).json({ error: "All fields are required." });
         }

         // Upload image to Cloudinary if it exists
         if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            eventData.image = result.secure_url; // Store the secure URL from Cloudinary
            fs.unlinkSync(req.file.path); // Delete local file after upload
         }

         // Create a new event
         const newEvent = new Event(eventData);
         await newEvent.save();

         const organizer = await OrganiserModel.findOne({ email: user.email });
         if (organizer) {
            await OrganiserModel.findByIdAndUpdate(organizer._id, {
               $push: {
                  events: {
                     eventId: newEvent._id,
                     title: newEvent.title,
                     ticketPrice: newEvent.ticketPrice,
                     ticketSold: newEvent.ticketSold,
                     income: newEvent.Income,
                  }
               },
               $inc: { eventsOrganised: 1, totalPriceOverall: newEvent.Income } // Increment events organized and total income
            });
         }

         res.status(201).json(newEvent);
      } catch (error) {
         console.error("Error creating event:", error);
         res.status(500).json({ error: "Failed to save the event to MongoDB", details: error.message });
      }
   });
});

app.get("/createEvent", async (req, res) => {
   try {
      const events = await Event.find();
      res.status(200).json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events from MongoDB" });
   }
});

app.get("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/event/:eventId", (req, res) => {
   const eventId = req.params.eventId;

   Event.findById(eventId)
      .then((event) => {
         if (!event) {
            return res.status(404).json({ message: "Event not found" });
         }

         event.likes += 1;
         return event.save();
      })
      .then((updatedEvent) => {
         res.json(updatedEvent);
      })
      .catch((error) => {
         console.error("Error liking the event:", error);
         res.status(500).json({ message: "Server error" });
      });
});

app.get("/events", async (req, res) => {

   try {
      const events = await Event.find();
      res.json({ events });
   } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Server error" });
   }
});

app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.patch("/events/:id/status", async (req, res) => {
   try {
      const { status } = req.body; // approved or cancelled
      if (!["approved", "cancelled"].includes(status)) {
         return res.status(400).json({ message: "Invalid status" });
      }

      const updatedEvent = await Event.findByIdAndUpdate(
         req.params.id,
         { status },
         { new: true }
      );

      if (!updatedEvent) {
         return res.status(404).json({ message: "Event not found" });
      }

      res.json(updatedEvent);
   } catch (error) {
      res.status(500).json({ message: "Server Error" });
   }
});

app.get("/events/dashboard-stats", async (req, res) => {
   try {
      const totalEvents = await Event.countDocuments();
      const approvedEvents = await Event.countDocuments({ status: "approved" });
      const pendingEvents = await Event.countDocuments({ status: "pending" });
      const cancelledEvents = await Event.countDocuments({ status: "cancelled" });

      const totalTicketsSold = await Event.aggregate([{ $group: { _id: null, total: { $sum: "$ticketSold" } } }]);
      const totalRefunds = await Event.aggregate([{ $group: { _id: null, total: { $sum: "$refunds" } } }]);

      console.log("Total Events:", totalEvents);
      console.log("Approved Events:", approvedEvents);
      console.log("Pending Events:", pendingEvents);
      console.log("Cancelled Events:", cancelledEvents);
      console.log("Total Tickets Sold:", totalTicketsSold);
      console.log("Total Refunds:", totalRefunds);

      res.json({
         totalEvents,
         approvedEvents,
         pendingEvents,
         cancelledEvents,
         totalTicketsSold: totalTicketsSold[0]?.total || 0,
         totalRefunds: totalRefunds[0]?.total || 0,
      });
   } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Server Error" });
   }
});

app.get("/organizers/dashboard-stats", async (req, res) => {
   try {
      const totalOrganizers = await OrganiserModel.countDocuments();
      const organizersWithEvents = await OrganiserModel.aggregate([
         {
            $lookup: {
               from: "events", // The name of the events collection
               localField: "_id",
               foreignField: "organizedBy", // Assuming this field in Event references the organizer
               as: "events"
            }
         },
         {
            $project: {
               name: 1,
               email: 1,
               eventsOrganized: { $size: "$events" } // Count of events organized
            }
         }
      ]);

      res.json({
         totalOrganizers,
         organizersWithEvents
      });
   } catch (error) {
      console.error("Error fetching organizer stats:", error);
      res.status(500).json({ message: "Server Error" });
   }
});


const transporter = nodemailer.createTransport({
   service: 'Gmail', // Use your email service
   auth: {
       user: process.env.EMAIL_USER, // Your email
       pass: process.env.EMAIL_PASS, // Your email password
   },
});


const sendConfirmationEmail = (to, ticketDetails) => {
   const mailOptions = {
       from: process.env.EMAIL_USER,
       to,
       subject: '🎟️ Ticket Confirmation - Your Booking is Confirmed!',
       html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Your Ticket has been Confirmed!</h2>
                <p>Thank you for your purchase! Here are your ticket details:</p>
                <ul>
                    <li><strong>Event Name:</strong> ${ticketDetails.eventname}</li>
                    <li><strong>Ticket ID:</strong> ${ticketDetails.ticketId}</li>
                    <li><strong>Event Date:</strong> ${ticketDetails.eventdate}</li>
                    <li><strong>Event Time:</strong> ${ticketDetails.eventtime}</li>
                    <li><strong>Total Tickets:</strong> ${ticketDetails.totaltickets}</li>
                    <li><strong>Price:</strong> LKR ${ticketDetails.ticketprice}</li>
                </ul>
                <h3>Your QR Code:</h3>
                <img src="${ticketDetails.qr}" alt="QR Code" style="width: 200px; height: auto; border: 1px solid #ddd; border-radius: 4px;">
                <p style="margin-top: 20px;">We look forward to seeing you at the event!</p>
                <p style="color: #888;">If you have any questions, feel free to contact us.</p>
            </div>
        `,
   };

   transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
           console.error("Error sending email:", error);
       } else {
           console.log('Email sent: ' + info.response);
       }
   });
};

app.post("/tickets", async (req, res) => {
   try {
       const ticketDetails = req.body;

       // Log incoming ticket details for debugging
       console.log("Incoming ticket details:", ticketDetails);

       // Ensure that the ticketDetails includes the quantity
       if (!ticketDetails.ticketDetails.totaltickets) {
           return res.status(400).json({ error: "Total tickets quantity is required." });
       }

       const newTicket = new Ticket(ticketDetails);
       await newTicket.save();

       // Update the corresponding event
       const event = await Event.findById(ticketDetails.eventid);
       if (event) {
           event.ticketSold += ticketDetails.ticketDetails.totaltickets; // Increment ticket sold
           event.Income += ticketDetails.ticketDetails.totaltickets * event.ticketPrice; // Update income
           await event.save();
       }

        // Send confirmation email
        sendConfirmationEmail(ticketDetails.ticketDetails.email, ticketDetails.ticketDetails);

       return res.status(201).json({ ticket: newTicket });
   } catch (error) {
       console.error("Error creating ticket:", error); // Log the error
       return res.status(500).json({ error: "Failed to create ticket" });
   }
});



const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/create-order', async (req, res) => {
   const { amount, currency, receipt } = req.body;

   const options = {
      amount, // amount in the smallest currency unit
      currency,
      receipt,
   };

   try {
      const order = await razorpay.orders.create(options);
      res.json(order);
   } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Failed to create order" });
   }
});




app.get('/test-email', (req, res) => {
   sendConfirmationEmail('vikashshakya735@example.com', {
      eventname: 'Sample Event',
      ticketId: 'TICKET1234'
   });
   res.send('Email sent!');
});

app.get("/tickets/:id", async (req, res) => {
   try {
      const tickets = await Ticket.find();
      res.json(tickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
   }
});


app.get("/tickets/user/:userId", (req, res) => {
   const userId = req.params.userId;

   Ticket.find({ userid: userId })
      .then((tickets) => {
         res.json(tickets);
      })
      .catch((error) => {
         console.error("Error fetching user tickets:", error);
         res.status(500).json({ error: "Failed to fetch user tickets" });
      });
});

app.delete("/tickets/:id", async (req, res) => {
   try {
      const ticketId = req.params.id;
      await Ticket.findByIdAndDelete(ticketId);
      res.status(204).send();
   } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Failed to delete ticket" });
   }
});


io.on("connection", (socket) => {
   console.log("New client connected");

   // Join the socket room based on the user's email
   socket.on("join", (email) => {
      socket.join(email);
   });

   socket.on("disconnect", () => {
      console.log("Client disconnected");
   });
});

app.post("/send-message", async (req, res) => {
   const { senderEmail, receiverEmail, content } = req.body;

   try {
      // Save the message to the database
      const message = new Message({ senderEmail, receiverEmail, content });
      await message.save();

      // Emit the message to the receiver
      io.to(receiverEmail).emit("receiveMessage", message);

      res.status(200).json({ message: "Message sent successfully" });
   } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
   }
});


app.get("/messages/:userEmail/:organizerEmail", async (req, res) => {
   const { userEmail, organizerEmail } = req.params;

   try {
      const messages = await MessageModel.find({
         $or: [
            { senderEmail: userEmail, receiverEmail: organizerEmail },
            { senderEmail: organizerEmail, receiverEmail: userEmail },
         ],
      }).sort({ timestamp: 1 });

      res.json(messages);
   } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
   }
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
