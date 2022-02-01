const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../models/User");

// @route     Post api/users/
// @desc      Get searched users
// @access    Private
router.post("/", auth, async (req, res) => {
  let regex;
  const { query } = req.body;
  if (query !== null && query !== "") {
    regex = new RegExp(query, "i");
  } else {
    return res.json({ users: [] });
  }

  try {
    const users = await User.find({
      $or: [{ name: regex }, { username: regex }],
    }).select("-password");
    if (users.length === 0)
      return res.status(404).json({ msg: "No user found!" });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error!" });
  }
});

module.exports = router;
