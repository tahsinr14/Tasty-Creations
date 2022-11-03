import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import "./registerForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // TODO
  });

  const [popupStyle, showPopup] = useState("hide");
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3001/register",
        {
          fullName: fullName,
          email: email,
          gender: gender,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log("Res: ", response.data);
        onSuccess();
      })
      .catch(function (error) {
        onFailure();
        console.log(error.response.data.errors);
        // setErr(() => error.response.data.errors);
        setTimeout(() => {
          // setErr(() => []);
        }, 3000);
      });

    const onSuccess = (e) => {
      alert("check your email to confirm your account");
      navigate(`/`);
      console.log(e);
    };

    const onFailure = (e) => {
      alert("User account NOT created!");
      console.log(e);
    };

    return (
      <div className="page">
        <form onSubmit={submitHandler} className="register">
          <h1>Register</h1>
          {/* <input type="text" placeholder="First name" />
      <input type="text" placeholder="Last name" />
      <input type="email" placeholder="Email address" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirm password" />
      <div className="register-button" onClick={popup}>
        {" "}
        Register
      </div> */}
          <input
            type="text"
            placeholder="Full Name"
            id="fullName"
            required
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            id="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Gender"
            id="gender"
            pattern="^[A-Za-z]{2,20}$"
            required
            onChange={(e) => setGender(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            maxLength="12"
            minLength="8"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            //   style={{ border: "none" }}
            className="register-button"
            type="submit"
          >
            Register
          </button>
          <p classname="text">Register Using</p>
          <div className="alter-register">
            <div className="alter-register">
              <GoogleLogin
                id="google-register"
                classname="alter-register"
                clientId="408408598288-o22i4f2u60ggm1pf5aa9is1bctpi75ic.apps.googleusercontent.com"
                buttonText=""
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                isSignedIn={false} //we can change the value here to "true", which will keep the sign in status
                icon={true}
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
        </form>
      </div>
    );
  };
};

export default RegisterForm;
