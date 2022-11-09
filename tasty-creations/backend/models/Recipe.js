const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema ({
    AuthorName : {
        type: String,
        required: true
    },
    RecipeName : {
        type: String,
        required: true,
        unique: true
    },
    category : {
        type: String,
        required: true
    },
    instruction : {
        type: String,
        required: true
    },
    ingredientList: {
        type: String,
        required: true,
    },
    Rating:{
        type: String,
        required: true,
    },
    UserID: {
        type: String,
        required: true
    }

});

const Recipe = mongoose.model("recipes", RecipeSchema);

module.exports = Recipe;

