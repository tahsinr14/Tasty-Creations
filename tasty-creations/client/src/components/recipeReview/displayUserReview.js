import React, { useState, useEffect } from "react";
import axios from "axios";

import "./reviews.css";
import ReviewDetails from "./reviewDetails";
import AddReview from "./addReview";

const DisplayUserReview = (props) => {
  const [recipeId, setRecipeId] = useState(props.recipeId);
  const [reviews, setReviews] = useState({});
  const [hasReview, setHasReview] = useState(false);
  const userId = localStorage.getItem("userid");

  useEffect(() => {
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
  return (
    <div>
      <b style={{ color: "black" }}>Your Review</b>
      <div className="reviews">
        {reviews.length ? (
          <div>
            <ReviewDetails
              userId={reviews[0].userId}
              publishDate={reviews[0].publishDate}
              body={reviews[0].body}
            />
          </div>
        ) : (
          <AddReview recipeId={recipeId} />
        )}
      </div>
    </div>
  );
};
export default DisplayUserReview;
