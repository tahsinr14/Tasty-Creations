import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPepperHot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import "./recipeRating.css";

const RecipeRating = (props) => {
  const [recipeId, setRecipeId] = useState(props.recipeId);
  const [rating, setRating] = useState(0);
  const isAuthenticated = localStorage.getItem("userid") !== null;
  const userId = localStorage.getItem("userid");
  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/rating/${recipeId}`)
        .then((response) => {
          setRating(response.data.rating);
        })
        .catch((e) => {
          if (e.response.status === 404) {
            axios.post(`${process.env.REACT_APP_API_HOST}/rating/`, {
              userId: userId,
              recipeId: recipeId,
              rating: rating,
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }, [rating]);

  const handleClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      axios
        .put(`${process.env.REACT_APP_API_HOST}/rating/edit/${recipeId}`, {
          userId: userId,
        })
        .then((response) => {
          setRating(response.data.rating);
        })
        .catch((e) => {
          if (e.response.status === 409) {
            alert("You have already liked this recipe");
          }
        });
    } else {
      alert("You need to Log In to like this recipe");
    }
  };
  return (
    <>
      <button type="submit" onClick={(e) => handleClick(e)}>
        Likes: <FontAwesomeIcon icon={faPepperHot} /> {rating}
      </button>
    </>
  );
};
export default RecipeRating;
