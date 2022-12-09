import React, { useState, useEffect } from "react";
import axios from "axios";
import "./reviews.css";
const ReviewDetails = (props) => {
  const [userId, setUserId] = useState(props.userId);
  const [fullName, setFullName] = useState("");
  const [publishDate, setPublishDate] = useState(props.publishDate);
  const [body, setBody] = useState(props.body);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/user/${userId}`)
      .then((response) => {
        setFullName(response.data.fullName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <table className="review-table" border>
        <tr>
          <th>User:</th>
          <td>{fullName}</td>
        </tr>
        <tr>
          <th>Publish date:</th>
          <td>{new Date(publishDate).toLocaleDateString("en-CA")}</td>
        </tr>
        <tr>
          <th>Review:</th>
          <td>{body}</td>
        </tr>
      </table>
    </div>
  );
};
export default ReviewDetails;
