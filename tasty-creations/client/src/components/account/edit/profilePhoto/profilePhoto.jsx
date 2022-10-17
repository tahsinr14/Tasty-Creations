import "./profilePhoto.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState} from "react";

const UserProfilePhoto = () => {
  const navigate = useNavigate();
  const avatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
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
    const userId = localStorage.getItem("user_id");
    let formData = new FormData();
    formData.append("file", profile.file);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_HOST}/account/editprofile/${userId}`,
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
  return (
    <>
      <form className="photo" onSubmit={handleSubmit}>
        <img src={profile.imageUrl} alt="user profile" id="display_image" />{" "}
        <br />
        <input onChange={handleInput} type="file" id="image_input" />
        <br />
        <input type="submit" value="Submit" />
        <br />
      </form>
    </>
  );
};

export default UserProfilePhoto;