const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    author: String,
    comment: String
  },
  {
    timestamps: true
  }
);

module.exports = model("Comment", CommentSchema);
