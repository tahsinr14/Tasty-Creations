import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const AllRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/allrecipes")
      .then((res) => {
        console.log(res.data.recipes);
        setRecipes(res.data.recipes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigateToHome=()=>{
    navigate("/home")
  }
  return (
    <>
      <div className="details-container">
        <div>
          <h1
            id="page-title"
            style={{
              textAlign: "center",
              margin: "2rem 0 2rem",
            }}
          >
            All Recipes
          </h1>
          <div>
            <button onClick={navigateToHome}>Close</button>
          </div>
          <br />
          {recipes
            .filter((el) => {
              return el;
            })
            .map((recipe) => {
              if (recipe.length !== 0) {
                return (
                  <div key={recipe.RecipeName}  className="RecipeContainer">
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
                    {/* <hr /> */}
                    <br />
                  </div>
                );
              } else {
                return <div>You have not created any recipes yet</div>;
              }
            })}
        </div>
      </div>
    </>
  );
};

export default AllRecipes;