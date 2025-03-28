const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
   name: String,
   email: { type: String, unique: true },
   password: String,
   resetPasswordToken: String,
   resetPasswordExpires: Date,
   resetPasswordOtp: { type: String, default: null },
   resetPasswordOtpExpires: { type: Date, default: null },
   role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' }, // Added role field
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;