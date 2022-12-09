import React, { useState, useEffect } from "react";
import axios from "axios";

import "./reviews.css";
import ReviewDetails from "./reviewDetails";

const DisplayReviews = (props) => {
  const [recipeId, setRecipeId] = useState(props.recipeId);
  const [reviews, setReviews] = useState([]);
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/review/${recipeId}`)
        .then((response) => {
          setReviews(
            response.data.reviews.filter((review) => review.userId !== userId)
          );
        })
        .catch((e) => {
          if (e.response.status === 404) {
            axios.post(`${process.env.REACT_APP_API_HOST}/review/`, {
              recipeId: recipeId,
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }, [recipeId]);
  return (
    <div>
      <b style={{ color: "black" }}>Other Reviews ({reviews.length})</b>
      <div className="reviews">
        {reviews.length ? (
          reviews.map((review) => (
            <ReviewDetails
              userId={review.userId}
              publishDate={review.publishDate}
              body={review.body}
            />
          ))
        ) : (
          <p className="no-reviews">No reviews to display</p>
        )}
      </div>
    </div>
  );
};
export default DisplayReviews;
