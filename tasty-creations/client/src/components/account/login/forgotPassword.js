import "./loginForm.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/reset-password", { email: email })
      .then((res) => {
        console.log(res);
        alert("Please check your email to reset your password");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login-form page">
      <form onSubmit={submitHandler}>
        <div className="login">
          <h2 className="text-center">Forgot Password</h2>

          <input
            className="loginInput"
            type="email"
            required
            placeholder="Enter your email"
            name="username"
            id="username"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="login-button"
            type="submit"
            value="Reset Password"
          />
          <div className="clearfix">
            <Link to="/login" className="float-right">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
