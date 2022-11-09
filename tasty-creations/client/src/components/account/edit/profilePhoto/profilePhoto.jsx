import "./profilePhoto.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useState, useEffect } from "react";

const UserProfilePhoto = () => {
  const userid = localStorage.getItem("userid");

  const navigate = useNavigate();
  let avatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";

  useEffect(() => {
    axios
      .get("http://localhost:3001/profile/" + userid)
      .then((res) => {
        avatar = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [profile, setProfile] = useState({
    imageUrl: avatar,
  });

  const handleInput = ({
    target: {
      files: [file],
    },
  }) =>
    setProfile({
      imageUrl: file ? URL.createObjectURL(file) : avatar,
      file,
    });
  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("file", profile.file);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_HOST}/account/editprofile/${userid}`,

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully!");
      navigate(`/account`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = ()=>navigate('/account')
  return (
    <>
      <form className="photo" onSubmit={handleSubmit}>
        <img src={profile.imageUrl} alt="user profile" id="display_image" />{" "}
        <br />
        <input onChange={handleInput} type="file" id="image_input" />
        <br />
        <div className="profilebuttonsdiv">
          <input type="submit" value="Submit" />
          <button type="reset" onClick={handleReset}>
            Cancel
          </button>
        </div>
        <br />
      </form>
    </>
  );
};

export default UserProfilePhoto;
