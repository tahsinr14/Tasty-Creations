require('dotenv').config();
const path = require('path');
const e = require("express");
const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");

const mongoose = require ('mongoose');
const multer  = require('multer')
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, path.resolve('uploads')),
        filename: (req, file, cb) => cb(null, file.originalname)
    })
})
const cors = require ('cors');

const UserModel = require ('../models/User');
const ProfileModel = require ('../models/Profile')

const HTTP_PORT = process.env.PORT || 3001;

//app.use(express.json());
app.use(bodyParser.json());

//cors and for loading files uploaded in the server
app.use(cors())
app.use('/uploads', express.static(path.resolve('uploads')))

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
app.get ("/account", (req, res)=>{
  UserModel.find()
      .then(function(doc){
          res.send({users: doc})
          
      })
})


app.put ("/account/edit/:id", async (req, res, next)=>{
  try {
      const id = req.params.id;
      UserModel.findById(id, function(err, doc){
          if (err) return res.send('no entry found');
          doc.fullName = req.body.fullName; 
          doc.email = req.body.email; 
          doc.gender = req.body.gender; 
          doc.password = req.body.password;
          doc.save();
          res.send(doc)
      });

  } catch (error) { next(error); }
})

app.put ("/account/editprofile/:id", upload.single('file'), async(req, res, next)=>{
  try {
      const { path: profile } = req.file;
      const userId = mongoose.Types.ObjectId(req.params.id);
      const doc = await ProfileModel.findOneAndUpdate({
          userId
      }, {
          pic: profile,
          userId
      }, {
          upsert: true,
          returnDocument: 'after'
      });
      res.status(doc ? 200 : 201).send(doc);

  } catch (error) { next(error); }
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.listen(HTTP_PORT, onHttpStart);
