const mongoose = require("mongoose");

const organiserSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
   name: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   eventsOrganised: { type: Number, default: 0 }, 
   totalRefunds: { type: Number, default: 0 }, 
   refundsToEmail: [{ type: String }], 
   totalPricePerEvent: [{ eventId: String, totalPrice: Number }],
   totalPriceOverall: { type: Number, default: 0 },
   role: { type: String, enum: ["organizer", "admin"], default: "organizer" },
   events: [{
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      title: String,
      ticketPrice: Number,
      ticketSold: Number,
      income: Number,
   }]
});

const OrganiserModel = mongoose.model("Organiser", organiserSchema);
module.exports = OrganiserModel;
