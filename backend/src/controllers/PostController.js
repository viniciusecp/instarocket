const Post = require("../models/Post");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const uploadS3 = require("../services/uploadS3");

module.exports = {
  async index(req, res) {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("comments");

    return res.json(posts);
  },

  async store(req, res) {
    const { author, place, description, hashtags } = req.body;
    const { key } = req.file;

    const [name] = key.split(".");
    const filename = `${name}.jpg`;

    const pathResized = path.resolve(req.file.destination, "resized", filename);

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(pathResized);

    const localFile = await new Promise((resolve, reject) =>
      fs.readFile(pathResized, (err, data) =>
        err ? reject(err) : resolve(data)
      )
    );

    const fileS3 = await uploadS3(localFile, req.file);

    fs.unlinkSync(req.file.path);
    fs.unlinkSync(pathResized);

    const post = await Post.create({
      author,
      place,
      description,
      hashtags,
      image: filename,
      image_url: fileS3.Location
    });

    req.io.emit("post", post);

    return res.json(post);
  }
};
