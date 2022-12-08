import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCancel } from "@fortawesome/free-solid-svg-icons";

const EditReview = (props) => {
  const [recipeId, setRecipeId] = useState(props.recipeId);
  const [fetchedReview, setFetchedReview] = useState("");
  const [updatedReview, setUpdatedReview] = useState("");
  const userId = localStorage.getItem("userid");
  const isAuthenticated = localStorage.getItem("userid") !== null;

  useEffect(() => {
    axios.get(`/review/${recipeId}/${userId}`).then((response) => {
      setFetchedReview(response.data[0].body);
    });
  });

  const handleEdit = (e) => {
    e.preventDefault();
    console.log(updatedReview);
    axios
      .put(`/review/edit/${recipeId}`, {
        userId: userId,
        review: updatedReview,
      })
      .then((response) => {
        window.location.reload();
      });
  };
  return (
    <div>
      <form onSubmit={handleEdit}>
        <label>
          Review: <br />
          <textarea
            type="text"
            rows="8"
            cols="80"
            name="review"
            placeholder={fetchedReview}
            onChange={(event) => setUpdatedReview(event.target.value)}
          />
        </label>
        <br />
        <button className="edit-review-btn">
          <FontAwesomeIcon icon={faEdit} /> Publish Changes
        </button>
      </form>
    </div>
  );
};

export default EditReview;
