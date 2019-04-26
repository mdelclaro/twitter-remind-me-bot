const { aws_bucket, aws_acl } = require("../../config");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

module.exports.upload = (filename, content) => {
  const params = {
    Bucket: aws_bucket,
    ACL: aws_acl,
    Key: filename,
    Body: content
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        reject();
      }
      console.log("File uploaded at: " + data.Location);
      resolve(data.Location);
    });
  });
};

module.exports.deleteFile = key => {
  const params = { Key: key, Bucket: aws_bucket };
  s3.deleteObject(params, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("File deleted: " + key);
    }
  });
};
