const express = require("express");
const router = express.Router();

const Message = require("../models/Message");

const auth = require("../middleware/auth");

// @route     GET api/message/:conversationId
// @desc      Get messages of a conversation
// @access    Private

router.get("/:conversationId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    if (!messages)
      return res
        .status(401)
        .json({ msg: "No message in this conversation yet!" });
    res.json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
});
// @route     POST api/message
// @desc      Create a new message
// @access    Private

router.post("/:conversationId", auth, async (req, res) => {
  const { text } = req.body;
  try {
    const newMessage = new Message({
      text,
      conversationId: req.params.conversationId,
      senderId: req.user.id,
    });
    await newMessage.save();
    res.json({ newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
