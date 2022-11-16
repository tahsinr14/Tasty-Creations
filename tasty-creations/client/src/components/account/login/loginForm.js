import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import "./loginForm.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = ({ error }) => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [err, setErr] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "408408598288-o22i4f2u60ggm1pf5aa9is1bctpi75ic.apps.googleusercontent.com",
        scope: "",
      });
    }
    gapi.load("client: auth2", start);
  });

  const handleFogotPassword = () => {
    const email = userName;
    axios
      .post("http://localhost:3001/reset-password", { email })
      .then((res) => {
        console.log(res);
        alert("Please check your email to reset your password");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3001/login",
        {
          email: userName,
          password: userPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      .then((response) => {
        console.log("Res: ", response.data.user._id);
        localStorage.setItem("userid", response.data.user._id);

        onSuccess();
      })
      .catch(function (error) {
        alert(error.response.data.message);
        console.log(error);
      });
  };

  const onSuccess = (e) => {
    alert("Signed in successfully!");
    navigate(`/home`);
    console.log(e);
    window.location.reload();
  };

  const onFailure = (e) => {
    alert("User is NOT signed in!");
    console.log(e);
  };

  return (
    <div className="page">
      <form onSubmit={submitHandler} method="POST">
        <div className="login">
          <h1>Login</h1>
          <div>
            {err.length > 0 &&
              err.map((er) => (
                <div key={er} style={{ color: "red" }}>
                  {er?.msg} for {er?.param}
                </div>
              ))}
          </div>
          <input
            className="loginInput"
            type="email"
            required
            placeholder="Enter your email"
            name="username"
            id="username"
            onChange={(e) => setUserName(e.target.value)}
            //value={userName.username}
          />
          <input
            className="loginInput"
            type="password"
            placeholder="Enter password"
            name="password"
            id="password"
            maxLength="12"
            minlength="8"
            onChange={(e) => setUserPassword(e.target.value)}
            // value={details.password}
          />
          {/* <div className="login-button" onClick={popup}>
          <input type="submit" value="LOGIN" />
        </div> */}
          <input className="login-button" type="submit" value="LOGIN" />
          <p className="text">Login Using</p>
          <div className="alter-login">
            <div className="alter-login">
              <GoogleLogin
                id="googleLogin"
                // classname="google-login"
                className="alter-login"
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
            <a href="/register">Don't have an account?</a>
          </div>
          <a href="/forgotPassword"> Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

// import React, { useState } from "react";
// import GoogleLogin from "react-google-login";
// import {useNavigate} from 'react-router-dom'
// import  axios  from "axios";
// import "./loginForm.css";

// const LoginForm = ({ error }) => {
//   const [fields, setFields] = useState({
//     email: "",
//     password: ""
//   });

//   const navigate = useNavigate();
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     localStorage.clear();
//     if (fields.email!=="" && fields.password !== ""){
//           await axios.post(
//       `${process.env.REACT_APP_API_HOST}/login`,
//       fields
//     ).then(res=>{
//       if(res.data._id){
//         localStorage.setItem('userid', res.data._id);
//         alert("Logged in successfully!");
//         navigate(`/home`);
//       }
//       else{
//         alert('Incorrect credentials')
//       }
//     });

//     }
//     else{
//       alert("All fields are required")
//     }

//   };

//   const handleFieldChange = (event, field) =>
//   setFields((fields) => ({
//   ...fields,
//   [field]: event.target.value,
//   }));

//   const onSuccess = (e) => {
//     alert("Signed in successfully!");
//     console.log(e);
//   };

//   return (
//     <div className="page">
//           <form onSubmit={handleFormSubmit} method="POST">
//       <div className="login">
//         <h1>Login</h1>
//         {error !== "" ? <div className="error">{error}</div> : ""}
//         <input className="loginInput"
//           type="email"
//           placeholder="Enter username"
//           name="username"
//           id="username"
//           onChange={(e) =>handleFieldChange(e, 'email')}
//         />
//         <input className="loginInput"
//           type="password"
//           placeholder="Enter password"
//           name="password"
//           id="password"
//           onChange={(e) => handleFieldChange(e, 'password')}

//         />
//         <input className="login-button" type="submit" value="LOGIN" />
//         <p className="text">Login Using</p>
//         <div className="alter-login">
//           <div className="google">
//             <GoogleLogin
//               classname="google-login"
//               clientId="408408598288-o22i4f2u60ggm1pf5aa9is1bctpi75ic.apps.googleusercontent.com"
//               buttonText=""
//               onSuccess={onSuccess}
//               cookiePolicy={"single_host_origin"}
//               isSignedIn={false}
//               icon={false}
//               theme="dark"
//             />
//           </div>
//         </div>
//         <div>
//           <a href="/register">Don't have an account?</a>
//         </div>

//       </div>
//     </form>
//     </div>
//   );
// };

// export default LoginForm;
