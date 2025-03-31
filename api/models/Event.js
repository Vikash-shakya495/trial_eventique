const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
   owner: String,
   title: { type: String, required: true },
   email: { type: String, required: true },
   status: { type: String, enum: ["pending", "approved", "cancelled"], default: "pending" },
   ticketSold: { type: Number, default: 0 },
   refunds: { type: Number, default: 0 },
   createdAt: { type: Date, default: Date.now },
   description: String,
   organizedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Organiser" },
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



module.exports = mongoose.model("Event", eventSchema);