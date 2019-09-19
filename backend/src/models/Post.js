const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    author: String,
    place: String,
    description: String,
    hashtags: String,
    image: String,
    image_url: String,
    likes: {
      type: Number,
      default: 0
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model("Post", PostSchema);
