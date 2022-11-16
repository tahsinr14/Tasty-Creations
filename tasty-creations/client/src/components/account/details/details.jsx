import axios from "axios";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./detailsStyle.css";

function Details() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [recipes, setRecipes] = useState([]);
  const LoggedIn = localStorage.getItem("userid");
  const [pic, setpic] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
  );

  const userid = localStorage.getItem("userid");
  useEffect(() => {
    axios
      .get("http://localhost:3001/user/" + userid)
      .then((res) => {
        // console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/userrecipes/" + userid)
      .then((res) => {
        setRecipes(res.data.data);
        console.log(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/profile/" + userid).then((res) => {
      let userProfile =
        res.data.preSignedUrls[res.data.preSignedUrls.length - 1];
      console.log("profile pic", res.data, userProfile);
      setpic(userProfile);
    });
  }, []);

  const onLogout = (e) => {
    localStorage.clear();
    navigate("/login");
    alert("Logout success!");
    console.log(e);
    window.location.reload();
  };

  return (
    <>
      <div className="overall">
        <div className="logout">
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
        <div className="details-container">
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
            <div>
              <h4>Full name</h4>
              <ul>{user.fullName}</ul>
            </div>
            <div>
              <h4>E-mail Address</h4>
              <ul>{user.email}</ul>
            </div>
            <div>
              <h4>Gender</h4>
              <ul>{user.gender}</ul>
            </div>
            <br />
            <div>
              {LoggedIn && (
                <Link to="/account/edit" id="ChangeInfobtn">
                  Change information
                </Link>
              )}
              <br />
              <br />
              <br />
              {LoggedIn && (
                <Link to="/createrecipe" id="createParcelbtn">
                  Create Recipe
                </Link>
              )}
            </div>
          </div>
          <div>
            <img src={pic} alt="user profile" />
          </div>
        </div>
        <div className="details-container">
          {LoggedIn && (
            <div>
              <h1
                id="page-title"
                style={{
                  textAlign: "center",
                  margin: "2rem 0 2rem",
                }}
              >
                My Recipes
              </h1>
              {recipes
                .filter((el) => {
                  return el;
                })
                .map((recipe) => {
                  if (recipe.length !== 0) {
                    return (
                      <div key={recipe.RecipeName} className="recipePage">
                        <div>
                          <ul>
                            <b>Author Name:</b>
                            {recipe.AuthorName}
                          </ul>
                          <div>
                            <ul>
                              <b>Recipe Name:</b>
                              {recipe.RecipeName}
                            </ul>
                          </div>
                          <div>
                            <ul>
                              <b>Category: </b>
                              {recipe.category}
                            </ul>
                          </div>
                          <ul>
                            <b>Instructions:</b>
                            {recipe.instruction}
                          </ul>
                          <div>
                            <ul>
                              <b>Ingredient:</b>
                              {recipe.ingredientList}
                            </ul>
                          </div>
                          <div>
                            <ul>
                              <b>Rating: </b>
                              {recipe.Rating}
                            </ul>
                          </div>
                        </div>
                        <hr />
                        <br />
                      </div>
                    );
                  } else {
                    return <div>You have not created any recipes yet</div>;
                  }
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Details;
