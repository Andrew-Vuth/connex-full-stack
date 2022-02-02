const express = require("express");
const multer = require("multer");
const moment = require("moment");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, moment(new Date()).format("YYYY-MM-DD") + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage, fileFilter });

// @route     PUT api/profile/:id
// @desc      Updating Profile
// @access    Private
router.put("/:id", auth, upload.single("profileImage"), async (req, res) => {
  console.log("got it");
  const { name, username, major, interests, bio } = req.body;
  const profileImage = req.file ? req.file.path : req.body.profileImage;
  const profileFields = {};

  if (name) profileFields.name = name;
  if (username) profileFields.username = username;
  if (major) profileFields.major = major;
  if (interests) profileFields.interests = interests;
  if (bio) profileFields.bio = bio;
  if (profileImage) profileFields.profileImage = profileImage;

  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(400).json({ msg: "User not found!" });

    // Check if it's really the user that logged in
    if (req.user.id !== user._id.toString())
      return res
        .status(401)
        .json({ msg: "No authorization to edit the profile!" });

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: profileFields },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    let msg;
    if (error.message.includes("dup key")) {
      msg = "Username is already taken";
    } else {
      msg = "Server Error";
    }
    res.status(500).json({ msg: msg });
  }
});

module.exports = router;
