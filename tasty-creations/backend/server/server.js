require('dotenv').config();
const path = require('path');
const e = require("express");
const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");

const mongoose = require ('mongoose');
//const multer  = require('multer')
//const upload = multer({
  //  storage: multer.diskStorage({
    //    destination: (req, file, cb) => cb(null, path.resolve('uploads')),
      //  filename: (req, file, cb) => cb(null, file.originalname)
    //})
//})
const cors = require ('cors');

const UserModel = require ('../models/User');
const ProfileModel = require ('../models/Profile')

//for profile picture need to implement later 
const {memoryStorage} = require ("multer");
const getUserPresignedUrls = require ('../imageUrls.js');
const uploadToS3 = require ('../s3.js');
const storage = memoryStorage();
const upload = multer({
  storage
});



const HTTP_PORT = process.env.PORT || 3001;

//app.use(express.json());
app.use(bodyParser.json());

//cors and for loading files uploaded in the server
app.use(cors())
//app.use('/uploads', express.static(path.resolve('uploads')))

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a route on the 'root' of the url
// IE: http://localhost:8080/
app.get("/", (req, res) => {
  res.send("<p>Server running... </p>");
});

// now add a route for the /headers page
// IE: http://localhost:8080/headers
app.post(
  "/login",
  body("username").isEmail(),
  body("password").isLength({ min: 8, max: 12 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      return res.json({ message: "success" });
    }
  }
);

app.post("/register", (req, res) => {});

app.post("/logout", (req, res) => {});

//account and profile edit
app.get("/account", (req, res) => {
  UserModel.find().then(function (doc) {
    res.send({ users: doc });
  });
});

app.put("/account/edit/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    UserModel.findById(id, function (err, doc) {
      if (err) return res.send("no entry found");
      doc.fullName = req.body.fullName;
      doc.email = req.body.email;
      doc.gender = req.body.gender;
      doc.password = req.body.password;
      doc.save();
      res.send(doc);
    });
  } catch (error) {
    next(error);
  }
});

app.put(
  "/account/editprofile/:id",
  upload.single("file"),
  async (req, res) => {

      const id = req.params.id;
      const { file } = req;
      if(!file){
        return res.send('No image selected');
      }
      const {error, key} = uploadToS3 ({file, id});
      if (error){
        return res.status(400).json({message: error.message});
      }else{
       return res.status(200).json({key});
      }

    }
);

app.get("/profile/:id", async (req, res) => {
  const id = req.params.id;
  const {error, preSignedUrls}=await getUserPresignedUrls(id);
  if (error){
    return res.status(400).json({message: error.message});
  }else{
    return res.status(200).json({preSignedUrls})
  }
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.listen(HTTP_PORT, onHttpStart);
