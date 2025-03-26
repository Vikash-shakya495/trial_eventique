const mongoose = require("mongoose");

const organiserSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to UserModel
   name: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   eventsOrganised: { type: Number, default: 0 }, // कुल इवेंट्स
   totalRefunds: { type: Number, default: 0 }, // कुल रिफंड्स
   refundsToEmail: [{ type: String }], // जिन यूजर्स को रिफंड मिला
   totalPricePerEvent: [{ eventId: String, totalPrice: Number }], // हर इवेंट की कुल कीमत
   totalPriceOverall: { type: Number, default: 0 }, // सभी इवेंट्स की कुल कीमत
   role: { type: String, enum: ["organizer", "admin"], default: "organizer" }, // रोल
   events: [{ // New field to store organized events
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      title: String,
      ticketPrice: Number,
      ticketSold: Number,
      income: Number,
   }]
});

const OrganiserModel = mongoose.model("Organiser", organiserSchema);
module.exports = OrganiserModel;
