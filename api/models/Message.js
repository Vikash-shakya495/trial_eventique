const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId,
   senderEmail: String,
   senderName: String,
   receiverEmail: String,
   content: { type: String, required: true },
   timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;