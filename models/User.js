const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    unique: true,
  },
  profileImage: {
    type: String,
  },
  major: {
    type: String,
  },
  interests: {
    type: String,
  },
  dob: {
    type: Date,
  },
  bio: {
    type: String,
    default: "",
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
