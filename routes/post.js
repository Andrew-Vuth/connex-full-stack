const express = require("express");
const router = express.Router();

const multer = require("multer");
const moment = require("moment");
const moment_tz = require("moment-timezone");

const auth = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");

// @route     GET api/post/all
// @desc      Getting all posts
// @access    Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Get who the user follow
    const followings = user.followings;
    // The current user ID plus all his following users
    const all = [...followings, req.user.id];

    const posts = await Post.find({
      user: {
        $in: all,
      },
    })
      .populate("user")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "user" },
      })
      .sort({ createdAt: -1 })
      .exec();
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error!" });
  }
});
// @route     GET api/post
// @desc      Getting posts
// @access    Private

router.get("/:userId", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } })
      .sort({ createdAt: -1 })
      .exec();
    res.json({ posts });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route     POST api/post
// @desc      Posting a post
// @access    Private

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/posts");
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

router.post("/", auth, upload.single("post_image"), async (req, res) => {
  const { post_text } = req.body;
  const post_image = req.file ? req.file.path : null;
  const dateKhmer = moment_tz
    .tz(Date.now(), "Asia/Bangkok")
    .format()
    .toString();

  try {
    const newPost = new Post({
      post_text,
      post_image,
      date_created: dateKhmer,
      user: req.user.id,
    });
    await newPost.save();
    res.json({ newPost });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route     PUT api/post/:id
// @desc      Updating posts
// @access    Private

router.put("/:id", auth, async (req, res) => {
  const { post_text, post_image } = req.body;

  const postFields = {};
  if (post_text) postFields.post_text = post_text;
  if (post_image) postFields.post_image = post_image;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(400).json({ msg: "Post not found!" });

    // Make sure user owns the post
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "No authorization over this post!" });

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: postFields },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.error(error);
    console.error(error.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});
// @route     DELETE api/post/:id
// @desc      Deleting posts
// @access    Private

router.delete("/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(400).json({ msg: "Post not found!" });

    // Make sure user owns the post
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "No authorization!" });

    post = await Post.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route     PUT api/post/:id/like
// @desc      Like a post
// @access    Private
router.put("/:id/like", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(400).json({ msg: "Post not found!" });

    if (post.likedBy.includes(req.user.id)) {
      console.log("already like");
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likedBy: req.user.id } },
        { new: true }
      );
    } else {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $push: { likedBy: req.user.id } },
        { new: true }
      );
    }
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error!" });
  }
});

module.exports = router;
