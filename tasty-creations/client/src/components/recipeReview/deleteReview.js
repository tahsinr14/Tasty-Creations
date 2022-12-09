import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const DeleteReview = (props) => {
  const [recipeId, setRecipeId] = useState(props.recipeId);
  const userId = localStorage.getItem("userid");

  const handleOnClick = () => {
    Swal.fire({
      title: "Delete Confirmation",
      text: "Click on Confirm Delete to delete your review",
      confirmButtonText: "Confirm Delete",
      confirmButtonColor: "#dc143c",
      showCancelButton: true,
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_API_HOST}/review/delete/${recipeId}/${userId}`
          )
          .then((response) => {
            if (response.status === 200) {
              window.location.reload();
            }
          });
      }
    });
  };
  return (
    <button className="delete-review-btn" onClick={handleOnClick}>
      <FontAwesomeIcon icon={faTrash} /> Delete
    </button>
  );
};
export default DeleteReview;
