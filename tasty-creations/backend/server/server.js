require("dotenv").config();
const path = require("path");
const e = require("express");
const express = require("express");
const app = express();
const { body } = require("express-validator");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const Token = require("../models/Token");
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
const crypto = require("crypto");
const storage = memoryStorage();
const upload = multer({
  storage,
});

const messageRouter = require("../routes/messages");

const session = require("express-session");

// configure mail server
// const APP_PORT = 3000
// const APP_HOST = 'localhost'
const GOOGLE_MAILER_CLIENT_ID =
  "137474500955-roj8em43jd42b37htdhufn80c8h44l98.apps.googleusercontent.com";
const GOOGLE_MAILER_CLIENT_SECRET = "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";
const GOOGLE_MAILER_REFRESH_TOKEN =
  "1//04kKuDVvKTudNCgYIARAAGAQSNwF-L9Ir4PeX2NTzJWW415r_utu42dia-NXq9Z9WRYgZcpV4vZH5uMouE8BbnYcpiUCMuJcmAxE";
const ADMIN_EMAIL_ADDRESS = "tastycreation.seneca@gmail.com";

const ProfileModel = require("../models/Profile");
const RatingModel = require("../models/Rating");

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

// chat

app.use("/messages", messageRouter);

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

// create api send mail reset password
app.post("/reset-password", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ errors: "Email not found" });
    }
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await token.save();
    }
    const link = `http://localhost:3000/reset-password/${user._id}/${token.token}`;
    const message = `Hi ${user.fullName}, <br> Please click on the link to reset your password.<br><a href=${link}>Click here to verify</a>`;
    const subject = "Reset Your Password ";
    const email = req.body.email;
    console.log(link);
    const result = await sendMail(email, subject, message);
    if (result) {
      res.status(200).json({ message: "Email sent successfully." });
    } else {
      res.status(500).json({ errors: "Email sent failed." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
});

// create api reset password
app.post("/reset-password/:_id/:token", async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params._id });
    if (!user) {
      return res.status(400).json({ errors: "User not found" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ errors: "Token not found" });
    }
    user.password = req.body.password;
    await user.save();
    await token.delete();
    res.status(200).json({
      message: "Password reset successfully, please login to continue",
    });
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
        req.session.fullName = user.fullName;
        req.session._id = user._id;

        // res.status(200).json({ message: "Login successfully" });
        return res.json({ user });
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

    await sendMail(
      req.body.email,
      "Confirm your email",
      "Please click on the link to confirm your email <br> <a href='http://localhost:3000/confirm/" +
        user._id +
        "'>Click here to verify</a>"
    );

    return res.status(200).json({ message: "Register successfully" });
  } catch (error) {
    return res.status(500).json({ errors: error.message });
  }
});

app.get("/confirm/:id", async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ errors: "User not found" });
    }
    user.isConfirm = true;
    await user.save();
    res.status(200).json({
      message: "Email confirmed successfully, please login to continue",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
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

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Logout successfully" });
});

app.get("/rating/:id", async (req, res) => {
  const id = req.params.id;

  let result = await RatingModel.findOne({ recipeId: id });

  if (!result) {
    return res.status(404).json({ message: "rating not found" });
  } else {
    return res.status(200).json(result);
  }
});

app.post("/rating", async (req, res) => {
  try {
    const fetchedUser = await UserModel.findById(req.body.userId);
    if (fetchedUser) {
      if (!fetchedUser.likes.includes(req.body.recipeId)) {
        const newRating = await new RatingModel({
          recipeId: req.body.recipeId,
        });
        await newRating.save();
        fetchedUser.likes.push(recipeId);
        await fetchedUser.save();
      }
    }
  } catch (error) {
    return res.status(500).json({ errors: error.message });
  }
});

app.put("/rating/edit/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!req.body.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const fetchedUser = await UserModel.findById(req.body.userId);

    if (fetchedUser) {
      if (!fetchedUser.likes.includes(id)) {
        updateRating = await RatingModel.findOne({ recipeId: id });
        updateRating.$inc("rating", 1);
        await updateRating.save();
        fetchedUser.likes.push(id);
        await fetchedUser.save();
        return res.send(updateRating);
      } else {
        return res.status(409).json({ message: "Recipe already liked" });
      }
    }
  } catch (error) {
    next(error);
  }
});

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
  RecipeModel.find({ UserID: UserID }, function (err, data) {
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

app.get("/allrecipes", (req, res) => {
  RecipeModel.find().then(function (doc) {
    res.send({ recipes: doc });
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

const server = app.listen(HTTP_PORT, onHttpStart);

//socket.io
const io = socket(server, {
  cors: {
    origin: "http://localhost:3001",
    Credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("add-user", (userID) => {
    onlineUsers.set(userID, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive-msg", data.msg);
    }
  });
});
