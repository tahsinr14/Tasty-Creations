const mongoose = require("mongoose");

const reviewBody = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    unique: true,
  },
  publishDate: {
    type: Date,
    default: Date.now(),
  },
  body: {
    type: String,
    required: true,
  },
});

const ReviewSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    unique: true,
    required: true,
  },
  reviews: [reviewBody],
});

const Review = mongoose.model("review", ReviewSchema);

module.exports = Review;
