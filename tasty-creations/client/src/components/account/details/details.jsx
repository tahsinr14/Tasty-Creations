import { Link } from "react-router-dom";
import "./detailsStyle.css";

export default () => (
  <div>
    <h1
      id="page-title"
      style={{
        textAlign: "center",
        margin: "2rem 0 2rem",
      }}
    >
      User Account
    </h1>
    <p>
      <h4>Full name</h4>
      John Doe
    </p>
    <p>
      <h4>E-mail Address</h4>
      mail@example.com
    </p>
    <p>
      <h4>Gender</h4>
      Male
    </p>
    <p>
      <Link to="/account/edit">Change information</Link>
    </p>
  </div>
);
