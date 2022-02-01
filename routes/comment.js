const express = require("express");
const router = express.Router();
const multer = require("multer");
const moment = require("moment");
const moment_tz = require("moment-timezone");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const auth = require("../middleware/auth");

// @route     POST api/comment
// @desc      Add a comments
// @access    Private
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/comments");
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

router.post("/", auth, upload.single("comment_image"), async (req, res) => {
  const { comment_text, post } = req.body;
  const comment_image = req.file ? req.file.path : null;
  const dateKhmer = moment_tz
    .tz(Date.now(), "Asia/Bangkok")
    .format()
    .toString();

  try {
    const newComment = new Comment({
      post,
      comment_text,
      comment_image,
      date_created: dateKhmer,
      user: req.user.id,
    });
    await newComment.save();

    const targetPost = await Post.findByIdAndUpdate(
      post,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.json({ newComment });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route     GET api/comment/:postId
// @desc      Getting post's comments
// @access    Private
router.get("/:postId", auth, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({
        createdAt: "desc",
      })
      .exec();
    res.json({ comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
});
module.exports = router;
