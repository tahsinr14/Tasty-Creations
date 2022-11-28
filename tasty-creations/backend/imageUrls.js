const {
    S3Client,
    ListObjectsV2Command,
    GetObjectCommand
  } = require ("@aws-sdk/client-s3");
const {getSignedUrl} =require ('@aws-sdk/s3-request-presigner');


const S3 = new S3Client({
  region: 'us-east-1',
  credentials:{
    secretAccessKey:'F35qHFzYtW0dO+GVsz6BzvotmJ58MDBuQ0z8PZgd',
    accessKeyId:'AKIAUII45WDLZRZLTF7U'
  }
});
const BUCKET = process.env.BUCKET;

const getImageKeysByUser = async (id) => {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: id,
    });
  
  const { Contents = [] } = await S3.send(command);
    return Contents.map((image) => image.Key);
  };
  
  const getUserPresignedUrls = async (id) => {
    try {
      const imageKeys = await getImageKeysByUser(id);
      const preSignedUrls = await Promise.all(
        imageKeys.map((key) => {
          const command = new GetObjectCommand({
            Bucket: BUCKET,
            Key: key,
          });
          return getSignedUrl(S3, command, { expiresIn: 3600 });
        })
      );
      console.log('image fetched successfully')
      return {preSignedUrls}
    } catch(error) {
      // console.log('Presigned error',error);
      return { error };
    }
  };

  module.exports = getUserPresignedUrls;