const {
  S3Client,
  PutObjectCommand,
} = require ("@aws-sdk/client-s3");

const { v4: uuid } = require("uuid");

const S3 = new S3Client({
  region: 'us-east-1',
  credentials:{
    secretAccessKey:'NAzm2nRw72o3PRGVmMuYlbfyaCear+vQVzOZ5vVT',
    accessKeyId:'AKIASM5D6WQQY2YOC5Z4'
  }
});
const BUCKET = process.env.BUCKET;

const uploadToS3 = async ({ file, id }) => {
  const i=0
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

