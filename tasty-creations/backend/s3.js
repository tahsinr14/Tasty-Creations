//storing in the cloud, covert the image in buffer and create url , need to implement
const {
  S3Client,
  PutObjectCommand,
} = require ("@aws-sdk/client-s3");

const { v4: uuid } = require("uuid");

const S3 = new S3Client();
const BUCKET = process.env.BUCKET;

const uploadToS3 = async ({ file, id }) => {
  const key = `${id}/${uuid()}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await S3.send(command);
    return { key };
  } catch (error) {
    return { error };
  }
};



module.exports = uploadToS3;

