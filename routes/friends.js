const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");

// @route     Post api/friends/following
// @desc      Follow a user
// @access    Private
router.post("/following", auth, async (req, res) => {
  const { username } = req.body;

  try {
    let targetUser = await User.findOne({ username });
    if (!targetUser)
      return res.status(404).json({ msg: "This user does not exist!" });

    //Getting user ID
    const targetUserId = targetUser._id;

    let currentUser = await User.findById(req.user.id);
    // Check if currentUser already follow that user
    if (currentUser.followings.includes(targetUserId))
      return res.status(403).json({ msg: "You already follow this user!" });
    targetUser = await User.findByIdAndUpdate(
      targetUserId,
      { $push: { followers: req.user.id } },
      { new: true }
    );
    currentUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { followings: targetUserId },
      },
      { new: true }
    );
    res.json({ currentUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route     PUT api/friends/unfollow
// @desc      Unfollow a User
// @access    Private
router.put("/unfollow", auth, async (req, res) => {
  const { username } = req.body;

  try {
    let targetUser = await User.findOne({ username });
    if (!targetUser)
      return res.status(404).json({ msg: "This user does not exist!" });

    //Getting user ID
    const targetUserId = targetUser._id;

    let currentUser = await User.findById(req.user.id);
    // Check if currentUser already follow that user
    if (!currentUser.followings.includes(targetUserId))
      return res.status(403).json({ msg: "You did not follow this user!" });
    targetUser = await User.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: req.user.id } },
      { new: true }
    );
    currentUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { followings: targetUserId },
      },
      { new: true }
    );
    res.json({ currentUser, targetUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route     PUT api/friends/remove
// @desc      Remove a Follower
// @access    Private
router.put("/remove", auth, async (req, res) => {
  const { username } = req.body;

  try {
    let targetUser = await User.findOne({ username });
    if (!targetUser)
      return res.status(404).json({ msg: "This user does not exist!" });

    //Getting user ID
    const targetUserId = targetUser._id;

    let currentUser = await User.findById(req.user.id);
    // Check if currentUser already follow that user
    if (!currentUser.followers.includes(targetUserId))
      return res.status(403).json({ msg: "This user does not follow you!" });
    targetUser = await User.findByIdAndUpdate(
      targetUserId,
      { $pull: { followings: req.user.id } },
      { new: true }
    );
    currentUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { followers: targetUserId },
      },
      { new: true }
    );
    res.json({ currentUser, targetUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error!" });
  }
});

module.exports = router;
