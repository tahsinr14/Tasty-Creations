import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./loginForm.css";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();
  const submitHandler = (e) => {
    console.log("id", id);
    console.log("token", token);
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("passwords don't match");
    } else {
      axios
        .post(`http://localhost:3001/reset-password/${id}/${token}`, {
          password,
        })
        .then((res) => {
          alert(res.data.message);
          // redirect to login page
          navigate(`/login`);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  };
  return (
    <div className="login-form page">
      <form onSubmit={submitHandler}>
        <div className="login">
          <h2 className="text-center" style={{ paddingTop: "20px" }}>
            Forgot Password
          </h2>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              required="required"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              required="required"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary btn-block login-button"
            >
              Reset Password
            </button>
          </div>
          {/* style padding */}
          <div className="clearfix" style={{ paddingBottom: "20px" }}>
            <Link to="/login" className="float-right">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
