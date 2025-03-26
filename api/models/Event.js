const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
   owner: String,
   title: { type: String, required: true },
   status: { type: String, enum: ["pending", "approved", "cancelled"], default: "pending" },
   ticketSold: { type: Number, default: 0 },
   refunds: { type: Number, default: 0 },
   createdAt: { type: Date, default: Date.now },
   description: String,
   organizedBy: String,
   eventDate: Date,
   eventTime: String,
   location: String,
   Participants: Number,
   Count: Number,
   Income: Number,
   ticketPrice: Number,
   Quantity: Number,
   image: String,
   likes: Number,
   Comment: [String],
});

module.exports = mongoose.model("Event", eventSchema);