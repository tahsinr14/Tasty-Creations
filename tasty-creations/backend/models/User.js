const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // isConfirm: {
  //     type: Boolean,
  //     required: true,
  // },
  likes: {
    type: [String], // store recipeId
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
