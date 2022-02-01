const express = require("express");
const router = express.Router();

const Conversation = require("../models/Conversation");
const User = require("../models/User");

const auth = require("../middleware/auth");

// @route     POST api/conversation
// @desc      Create a new conversation
// @access    Private

router.post("/", auth, async (req, res) => {
  const { receiverId } = req.body;
  const newConversation = new Conversation({
    members: [req.user.id, receiverId],
  });
  try {
    await newConversation.save();
    res.json({ newConversation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error!" });
  }
});
// @route     GET api/conversation
// @desc      Get Conversations
// @access    Private

router.get("/", auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user.id] },
    }).populate("members");

    res.json({ conversations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route     GET api/conversation/:conversationId
// @desc      Get a Conversation
// @access    Private
router.get("/:conversationId", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById({
      _id: req.params.conversationId,
    }).populate("members");

    res.json({ conversation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error!" });
  }
});

module.exports = router;
