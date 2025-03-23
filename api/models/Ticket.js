const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
   userid: { type: String, require: true },
   eventid: { type: String, require: true },
   ticketDetails: {
      name: { type: String, required: true },
      email: { type: String, require: true },
      eventname: { type: String, require: true },
      eventdate: { type: Date, require: true },
      eventtime: { type: String, require: true },
      ticketprice: { type: Number, require: true },
      totaltickets: { type: Number, required: true },
      ticketId: { type: String, required: true },
      qr: { type: String, require: true },
   },
   quantity: { type: Number, default: 0 },
});

const TicketModel = mongoose.model(`Ticket`, ticketSchema);
module.exports = TicketModel;