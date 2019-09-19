const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {
  async store(req, res) {
    const post = await Post.findById(req.params.id).populate("comments");

    const comment = await Comment.create({
      author: req.body.author,
      comment: req.body.comment
    });

    post.comments.push(comment);

    await post.save();

    req.io.emit("comment", post);

    return res.json(post);
  }
};
