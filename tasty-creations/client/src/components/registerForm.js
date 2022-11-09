import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleLogin from "react-google-login";
import "./registerForm.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleFieldChange = (event, field) =>
    setFields((fields) => ({
      ...fields,
      [field]: event.target.value,
    }));
  const handleFormSubmit = async (e) => {
    localStorage.clear();
    e.preventDefault();
    if (fields.password !== fields.confirmPassword)
      return alert("Password mismatch");
    await axios.post(`${process.env.REACT_APP_API_HOST}/register`, fields);
    alert("check your email to confirm your account");
    navigate(`/login`);
  };
  
  const [popupStyle, showPopup] = useState("hide");
  const popup = () => {
    showPopup("register-popup");
    setTimeout(() => showPopup("hide"), 3000);
  };

  const onSuccess = (e) => {
    alert("Thank you for registering, please login to continue");
    // call api to send email
    axios
      .post(
        "http://localhost:3001/email/send",
        {
          email: fields.email,
          subject: "Thank you for registering",
          content: `Thank you for registering ${fields.fullName}! Please login to continue`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log("Res: ", response.data);
      })
      .catch(function (error) {
        console.log(error.response.data.errors);
        // setErr(() => error.response.data.errors);
        setTimeout(() => {
          // setErr(() => []);
        }, 3000);
      });
    navigate(`/`);
    console.log(e);
  };

  const onFailure = (e) => {
    alert("User account NOT created!");
    console.log(e);
  };

  return (
    <div className="page">
      <div className="register">
        <h1>Register</h1>
        <form className="registrationForm" onSubmit={handleFormSubmit}>
          <input
            className="registerInput"
            onChange={(event) => handleFieldChange(event, "fullName")}
            type="text"
            placeholder="Full name"
          />
          <input
            className="registerInput"
            onChange={(event) => handleFieldChange(event, "email")}
            type="email"
            placeholder="Email address"
          />
          <input
            className="registerInput"
            onChange={(event) => handleFieldChange(event, "gender")}
            type="text"
            placeholder="Gender"
          />
          <input
            className="registerInput"
            onChange={(event) => handleFieldChange(event, "password")}
            type="password"
            placeholder="Password"
          />
          <input
            className="registerInput"
            onChange={(event) => handleFieldChange(event, "confirmPassword")}
            type="password"
            placeholder="Confirm password"
          />
          <button
            type="submit"
            style={{ border: "none" }}
            className="register-button"
          >
            {" "}
            Register
          </button>
        </form>
        <p classname="text">Register Using</p>
        <div className="alter-register">
          <div className="google">
            <GoogleLogin
              id="google-register"
              classname="alter-register"
              clientId="408408598288-o22i4f2u60ggm1pf5aa9is1bctpi75ic.apps.googleusercontent.com"
              buttonText=""
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={false} //we can change the value here to "true", which will keep the sign in status
              icon={false}
              theme="dark"
            />
          </div>
        </div>
        <div>
          <a href="/login">Already have an account?</a>
        </div>
        <div className={popupStyle}>
          <h3>Registration Failed</h3>
          <p>All fields are required.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
