const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require ("@aws-sdk/client-s3");

const { v4: uuid } = require("uuid");

const S3 = new S3Client({
  region: 'us-east-1',
  credentials:{
    secretAccessKey:'F35qHFzYtW0dO+GVsz6BzvotmJ58MDBuQ0z8PZgd',
    accessKeyId:'AKIAUII45WDLZRZLTF7U'
  }
});
const BUCKET = process.env.BUCKET;

const uploadToS3 = async ({ file, id }) => {
  const key = `${id}/${1}`;
  if (key){
    try {
      const data= await S3.send(new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key
      }));
      console.log("Object deleted successfully");
      // return data
    } catch (error) {
      console.log(error)
    }

  }

  const key2 = `${id}/${1}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key2,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await S3.send(command);
    return { key2 };
  } catch (error) {
    return { error };
  }
};

module.exports = uploadToS3;