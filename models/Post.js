const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    post_text: {
      type: String,
      require: true,
    },
    post_image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date_created: {
      type: String,
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
