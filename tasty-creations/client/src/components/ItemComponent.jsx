import React from "react";
import RecipeRating from "./recipeRating/recipeRating";
import RecipeReview from "./recipeReview/recipeReview";

const ItemComponent = (props) => {
    const {id, title, image, Description} = props
  return (
    <div>

        <div className="card">
          <div className="Name_Image">
            <li>Name: {title}</li>
            <img src={image} alt="Yummy food" />
            <RecipeRating recipeId={id}/> <RecipeReview recipeId={id}/>
          </div>
          <div className="Description">
            Description:
            <br />
            <li>{Description}</li>
          </div>
        </div>

      <hr />
    </div>
  );
};

export default ItemComponent;
