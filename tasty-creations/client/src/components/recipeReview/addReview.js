import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import "./reviews.css";
import DisplayUserReview from "./displayUserReview";

const AddReview = (props) => {
  const [recipeId, setRecipeId] = useState(props.recipeId);
  const [review, setReview] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const userId = localStorage.getItem("userid");
  const isAuthenticated = localStorage.getItem("userid") !== null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You need to sign in to submit review");
    } else {
      if (review === "") {
        alert("review cannot be empty");
      } else {
        axios
          .put(`${process.env.REACT_APP_API_HOST}/review/edit/${recipeId}`, {
            userId: userId,
            review: review,
          })
          .then((response) => {
            setIsPosted(true);
            window.location.reload();
          });
      }
    }
  };

  return (
    <>
      {isPosted ? (
        <DisplayUserReview recipeId={recipeId} />
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Review: <br />
              <textarea
                type="text"
                rows="8"
                cols="80"
                name="review"
                placeholder="Type your review here..."
                onChange={(event) => setReview(event.target.value)}
              />
            </label>
            <br />
            <button className="add-review-btn">
              <FontAwesomeIcon icon={faComment} /> Add Review
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default AddReview;
