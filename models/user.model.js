const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    googleId: String,
    provider: { type: String, default: "email" },
    avatar: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
