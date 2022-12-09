import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import "./recipeReview.css";

const RecipeReview = (props) => {
  const [recipeId, setRecipeId] = useState(props.recipeId);
  const [reviewCount, setReviewCount] = useState(0);
  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/review/${recipeId}`)
        .then((response) => {
          setReviewCount(response.data.reviews.length);
        })
        .catch((e) => {
          if (e.response.status === 404) {
            axios.post("/review/", {
              recipeId: recipeId,
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  });
  return (
    <>
      <p>
        Reviews: <FontAwesomeIcon icon={faComments} /> {reviewCount}
      </p>
    </>
  );
};
export default RecipeReview;
