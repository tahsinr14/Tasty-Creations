require("dotenv").config();
const path = require("path");
const e = require("express");
const express = require("express");
const app = express();
const { body } = require("express-validator");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const UserModel = require("../models/User");
const RecipeModel = require("../models/Recipe");
const { memoryStorage } = require("multer");
const getUserPresignedUrls = require("../imageUrls.js");
const uploadToS3 = require("../s3.js");

const storage = memoryStorage();
const upload = multer({
  storage,
});

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

// const ProfileModel = require("../models/Profile");

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

//Get user by id
app.get("/user/:id", (req, res) => {
  const userid = req.params.id;
  UserModel.findById(userid, function (err, data) {
    if (data) {
      return res.send(data);
    }
    if (!data) {
      return res.send("No user match found");
    }
    if (err) {
      return res.send(err);
    }
  });
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

          // res.status(200).json({ message: "Login successfully" });
          return res.json({ user });
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

app.get("/list-user", (req, res) => {
  // get all users
  UserModel.find().then((users) => {
    res.json(users);
  });
});

//returns all users
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

app.put("/account/editprofile/:id", upload.single("file"), async (req, res) => {
  const id = req.params.id;
  const { file } = req;
  // console.log(req)
  if (!file) {
    return res.send("No image selected");
  }
  const { error, key } = uploadToS3({ file, id });
  if (error) {
    return res.status(400).json({ message: error.message });
  } else {
    return res.status(200).json({ key });
  }
});

app.get("/profile/:id", async (req, res) => {
  const id = req.params.id;
  const { error, preSignedUrls } = await getUserPresignedUrls(id);
  if (error) {
    return res.status(400).json({ message: error.message });
  } else {
    return res.status(200).json({ preSignedUrls });
  }
});

app.post("/createrecipe/:id", async (req, res) => {
  const userId = req.params.id;
  const newRecipe = await new RecipeModel({
    AuthorName: req.body.AuthorName,
    RecipeName: req.body.RecipeName,
    category: req.body.category,
    instruction: req.body.instruction,
    ingredientList: req.body.ingredientList,
    Rating: req.body.Rating,
    UserID: userId,
  });
  try {
    await newRecipe.save();
    return res.status(200).json({ newRecipe });
  } catch (error) {
    return res.status(500).json({ errors: error.message });
  }
});

app.get("/userrecipes/:id", async (req, res) => {
  const UserID = req.params.id;
  RecipeModel.find({"UserID":UserID}, function (err, data) {
    if (data) {
      return res.status(200).json({ data });
    }
    if (!data) {
      return res.status(400).json("You havent created any recipes yet");
    }
    if (err) {
      return res.status(500).json(err);
    }
  });
});

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
