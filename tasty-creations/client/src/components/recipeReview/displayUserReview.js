import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import "./reviews.css";
import ReviewDetails from "./reviewDetails";
import AddReview from "./addReview";
import EditReview from "./editReview";

const DisplayUserReview = (props) => {
  const [recipeId, setRecipeId] = useState(props.recipeId);
  const [reviews, setReviews] = useState({});
  const [hasReview, setHasReview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    setIsEditMode(false);
    try {
      axios
        .get(`/review/${recipeId}/${userId}`)
        .then((response) => {
          setReviews(response.data);
        })
        .catch((e) => {
          if (e.response.status === 404) {
            axios.post("/review/", {
              recipeId: recipeId,
            });
            hasReview(false);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }, [recipeId]);
  const enableEditMode = () => {
    setIsEditMode(true);
  };
  const renderReview = () => {
    if (isEditMode) {
      return <EditReview recipeId={recipeId} />;
    } else {
      return (
        <div>
          <ReviewDetails
            userId={reviews[0].userId}
            publishDate={reviews[0].publishDate}
            body={reviews[0].body}
          />
          <button className="edit-review-btn" onClick={enableEditMode}>
            <FontAwesomeIcon icon={faEdit} /> Edit Review
          </button>
        </div>
      );
    }
  };
  return (
    <div>
      <b style={{ color: "black" }}>Your Review</b>
      <div className="reviews">
        {reviews.length ? renderReview() : <AddReview recipeId={recipeId} />}
      </div>
    </div>
  );
};
export default DisplayUserReview;
