const aws = require("aws-sdk");

const uploadS3 = (localFile, fileInfo) => {
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileInfo.key,
      Body: localFile,
      ACL: "public-read",
      ContentType: fileInfo.mimetype
    };

    s3.upload(params, (err, data) => (err ? reject(err) : resolve(data)));
  });
};

module.exports = uploadS3;
