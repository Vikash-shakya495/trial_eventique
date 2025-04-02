const express = require("express");
const cors = require("cors");
require("dotenv").config();
const punycode = require('punycode/');
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const OrganiserModel = require('./models/Organiser')
const Message = require('./models/Message');
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
const Event = require('./models/Event');
const http = require("http");
const socketIo = require("socket.io");
const Razorpay = require('razorpay');
const fs = require("fs");

const app = express();

const server = http.createServer(app);
// const io = socketIo(server);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "bsbsfbrnsftentwnnwnwn";

app.use(cookieParser());
const io = socketIo(server, {
   cors: {
      origin: "http://localhost:5173", // Allow your frontend origin
      methods: ["GET", "POST"],
      credentials: true // Allow credentials if needed
   }
});




mongoose.connect(process.env.MONGO_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   authSource: "admin"  // Yeh line add karein
}).then(() => {
   console.log("Connected to MongoDB");
}).catch((Err) => {
   console.log("MongoDb error occured : ", Err)
});


// Use CORS middleware for Express
app.use(cors({
   origin: ["https://trial-eventique-event-booking-system-002.vercel.app", "http://localhost:5173"],
   credentials: true // Allow credentials if needed
}));


app.use('/uploads', express.static('uploads'));

app.use(express.json());

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
   // Input validation
   if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
   }

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
   // Input validation
   if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
   }

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

      // Generate a random OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const otpExpires = Date.now() + 300000; // OTP valid for 5 minutes

      // Store OTP and its expiration in the user document
      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpires = otpExpires;
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
         subject: "Password Reset OTP",
         text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Password reset email sent" });
   } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
   }
});

app.post("/auth/verify-otp", async (req, res) => {
   const { email, otp } = req.body;

   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.status(404).json({ error: "User  not found" });
      }

      // Check if the OTP is valid and not expired
      if (user.resetPasswordOtp !== otp || Date.now() > user.resetPasswordOtpExpires) {
         return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // OTP is valid, allow the user to reset their password
      res.status(200).json({ message: "OTP verified. You can now reset your password." });
   } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
   }
});

app.post("/auth/reset-password", async (req, res) => {
   console.log("Request Body:", req.body);
   const { email, otp, password } = req.body;

   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.status(404).json({ error: "User  not found" });
      }

      // Check if the OTP is valid and not expired
      if (user.resetPasswordOtp !== otp || Date.now() > user.resetPasswordOtpExpires) {
         return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // Update the password
      user.password = bcrypt.hashSync(password, bcryptSalt);
      user.resetPasswordOtp = undefined; // Clear the OTP
      user.resetPasswordOtpExpires = undefined; // Clear the expiration
      await user.save();

      res.status(200).json({ message: "Password has been reset successfully." });
   } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password" });
   }
});


// Create Event API
app.post("/createEvent", upload.single("image"), async (req, res) => {
   const { token } = req.cookies; // Get the token from cookies
   if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
   }
   // Input validation
   const { title, eventDate, eventTime, location, ticketPrice } = req.body;
   if (!title || !eventDate || !eventTime || !location || !ticketPrice) {
      return res.status(400).json({ error: "All fields are required." });
   }
   // const { token } = req.cookies; // Get the token from cookies
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
         eventData.organizedBy = user._id; // Set the organizer's name

         console.log("Event Data:", eventData);
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
                     income: newEvent.ticketPrice * newEvent.ticketSold,
                  }
               },
               $inc: { eventsOrganised: 1, totalPriceOverall: newEvent.ticketPrice * newEvent.ticketSold } // Increment events organized and total income
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
      res.status(500).json({ error: "Failed to fetch events from MongoDB", details: error.message });
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
      console.log("Fetching event with ID:", id); // Log the event ID
      // Fetch the event and populate the organizer details
      const event = await Event.findById(id).populate('organizedBy', 'name email'); // Populate name and email fields

      if (!event) {
         return res.status(404).json({ error: "Event not found" });
      }

      // Prepare the response object
      const response = {
         title: event.title,
         eventDate: event.eventDate,
         eventTime: event.eventTime,
         location: event.location,
         ticketPrice: event.ticketPrice,
         organizer: {
            name: event.organizedBy?.name,
            email: event.organizedBy?.email,
         },
         // Add any other fields you want to return
      };

      res.json(response);
   } catch (error) {
      console.error("Error fetching event:", error);
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


app.get('/organizers', async (req, res) => {
   try {
      // Fetch all organizers from the database
      const organizers = await OrganiserModel.find(); // Adjust the query as needed

      // Check if any organizers were found
      if (!organizers || organizers.length === 0) {
         return res.status(404).json({ message: "No organizers found." });
      }

      // Return the list of organizers
      res.status(200).json(organizers);
   } catch (error) {
      console.error("Error fetching organizers:", error);
      res.status(500).json({ message: "Failed to fetch organizers." });
   }
});

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
   console.log("New client connected:", socket.id);

   socket.on("join", (email) => {
      if (!email) return console.error("Invalid email");
      socket.join(email);
      console.log(`${email} joined the chat room`);
   });

   socket.on("send-message", async (message) => {
      try {
         if (!message || !message.receiverEmail) {
            return console.error("Invalid message data");
         }

         const newMessage = new MessageModel(message);
         await newMessage.save();
         io.to(message.receiverEmail).emit("receiveMessage", message);
         console.log(`Message sent to: ${message.receiverEmail}`);
      } catch (error) {
         console.error("Error sending message:", error);
      }
   });

   socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
   });
});

app.post('/send-message', async (req, res) => {
   const { senderEmail, senderName, receiverEmail, receiverName, content } = req.body;

   if (!senderEmail || !senderName || !receiverEmail || !content || !receiverName) {
      return res.status(400).json({ error: "All fields are required" });
   }

   const newMessage = new Message({
      senderEmail,
      senderName,
      receiverEmail,
      receiverName,
      content,
      timestamp: new Date()
   });

   try {
      const savedMessage = await newMessage.save();
      io.to(receiverEmail).emit("receiveMessage", savedMessage);
      res.status(200).json({ message: "Message sent successfully", data: savedMessage });
   } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ error: "Failed to send message" });
   }
});

app.get("/messages/:userEmail/:organizerEmail", async (req, res) => {
   try {
      const { userEmail, organizerEmail } = req.params;

      if (!userEmail || !organizerEmail) {
         return res.status(400).json({ success: false, error: "Invalid request parameters" });
      }

      const messages = await Message.find({
         $or: [
            { senderEmail: userEmail, receiverEmail: organizerEmail },
            { senderEmail: organizerEmail, receiverEmail: userEmail },
         ],
      })
         .sort({ timestamp: 1 })
         .select("-__v");

      res.status(200).json({ success: true, data: messages });
   } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ success: false, error: "Failed to fetch messages" });
   }
});


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
