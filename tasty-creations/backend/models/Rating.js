const mongoose = require ('mongoose');

const RatingSchema = new mongoose.Schema ({
    recipeId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
});

const Rating = mongoose.model("rating", RatingSchema);

module.exports = Rating;