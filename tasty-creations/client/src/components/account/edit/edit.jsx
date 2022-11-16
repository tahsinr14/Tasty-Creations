import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./editStyle.css";
import UserProfilePhoto from "./profilePhoto/profilePhoto";

const AccountEdit = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const userid = localStorage.getItem("userid");
  useEffect(() => {
    axios
      .get("http://localhost:3001/user/" + userid)
      .then((res) => {
        console.log(res.data);
        setFields(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleFieldChange = (event, field) =>
    setFields((fields) => ({
      ...fields,
      [field]: event.target.value,
    }));

  const handleReset = () => navigate("/account");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (fields.password !== fields.confirmPassword)
      return alert("Password mismatch");

    await axios.put(
      `${process.env.REACT_APP_API_HOST}/account/edit/${userid}`,
      fields
    );
    alert("Updated successfully!");

    navigate(`/account`);
  };
  const handleFormReset = () =>
    setFields((fields) => ({
      ...fields,
      password: "",
      confirmPassword: "",
    }));

  return (
    <>
      <div className="page">
        <div className="formContainer">
          <h1
            id="page-title"
            style={{
              textAlign: "center",
              margin: "2rem 0 2rem",
              color: "black",
            }}
          >
            User Account
          </h1>
          <form
            id="update-account-form"
            onSubmit={handleFormSubmit}
            onReset={handleFormReset}
          >
            <fieldset className="form-group">
              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fields.fullName}
                  onChange={(event) => handleFieldChange(event, "fullName")}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">E-mail Address</label>
                <input
                  type="email"
                  id="email"
                  value={fields.email}
                  onChange={(event) => handleFieldChange(event, "email")}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="text">Gender</label>
                <input
                  type="text"
                  id="gender"
                  value={fields.gender}
                  onChange={(event) => handleFieldChange(event, "gender")}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Change Password</label>
                <input
                  type="password"
                  id="password"
                  value={fields.password}
                  onChange={(event) => handleFieldChange(event, "password")}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={fields.confirmPassword}
                  onChange={(event) =>
                    handleFieldChange(event, "confirmPassword")
                  }
                  required
                />
              </div>
              <div className="action-group">
                <button type="reset" onClick={handleReset}>
                  Cancel
                </button>
                <button type="submit">Update</button>
              </div>
            </fieldset>
          </form>
        </div>
        <div className="profileImg">
          <UserProfilePhoto />
        </div>
      </div>
    </>
  );
};

export default AccountEdit;
