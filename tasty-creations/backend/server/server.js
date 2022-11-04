require("dotenv").config();
const path = require("path");
const e = require("express");
const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const session = require("express-session");

// configure mail server
// const APP_PORT = 3000
// const APP_HOST = 'localhost'
const GOOGLE_MAILER_CLIENT_ID =
  "670506890821-kk5v3fr1uag1cvq8eahsbbdg0mn30b4v.apps.googleusercontent.com";
const GOOGLE_MAILER_CLIENT_SECRET = "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";
const GOOGLE_MAILER_REFRESH_TOKEN =
  "1//04sacO8KA2nR6CgYIARAAGAQSNwF-L9Ir1ePcWxke1AHINDphiwLrBgFKQsrjVwFghnH0qFGPqbBjrFRoTlhm6-o0vBkEGXRkTsA";
const ADMIN_EMAIL_ADDRESS = "tastycreation.seneca@gmail.com";

const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.resolve("uploads")),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});
const cors = require("cors");

const UserModel = require("../models/User");
const ProfileModel = require("../models/Profile");

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

// create OAuth2Client, Client ID and Client Secret
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

// session
app.use(
  session({
    secret: "abcdefg",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

//app.use(express.json());
app.use(bodyParser.json());

//cors and for loading files uploaded in the server

app.use(cors());
app.use("/uploads", express.static(path.resolve("uploads")));


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

async function sendMail(email, subject, message) {
  try {
    if (!email || !subject || !message)
      throw new Error("Please provide email, subject and content!");

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });
    const mailOptions = {
      to: email,
      subject: subject,
      html: `<div>${message}</div>`,
    };
    await transport.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
}

// Create api send mail
app.post("/email/send", async (req, res) => {
  try {
    const email = req.body.email;
    const subject = req.body.subject;
    const content = req.body.content;

    if (!email || !subject || !content)
      throw new Error("Please provide email, subject and content!");

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });
    const mailOptions = {
      to: email,
      subject: subject,
      html: `<div>${content}</div>`,
    };
    await transport.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
});

// now add a route for the /headers page
// IE: http://localhost:8080/headers
app.post("/login", async (req, res) => {
  // check email and password
  const mail = req.body.email;
  const password = req.body.password;
  await UserModel.findOne({ email: mail })
    .then((user) => {
      if (user.password === password) {
        if (user.isConfirm === true) {
          // save fullName, _id to session
          req.session.fullName = user.fullName;
          req.session._id = user._id;

          res.status(200).json({ message: "Login successfully" });
        } else {
          res.status(400).json({ message: "Please confirm your email" });
        }
      } else {
        res.status(400).json({ message: "Wrong password" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "User not found" });
    });
});

app.post("/register", async (req, res) => {
  try {
    // gender token

    const newUser = await new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,

      isConfirm: false,
    });
    const user = await newUser.save();

    const subject = "Confirm your account";
    const content = `Please click on the link below to confirm your account: <a href="http://localhost:3001/confirm/${user._id}">here</a>`;

    let check = await sendMail(req.body.email, subject, content);

    return res.status(200).json({ message: "Register successfully" });
  } catch (error) {
    return res.status(500).json({ errors: error.message });
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ errors: error.message });
  }
});
app.get("/confirm/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, {
      isConfirm: true,
    });
    return res.status(200).json({ message: "Confirm successfully" });
  } catch (error) {
    return res.status(500).json({ errors: error.message });
  }
});

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

//app.get("/list-user", (req, res) => {
  // get all users
  //UserModel.find().then((users) => {
    //res.json(users);
  //});
//});



app.use((req, res) => {
  res.status(404).send("Page Not Found");
});


try {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  });
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Could not connect to MongoDB");
}


app.listen(HTTP_PORT, onHttpStart);
