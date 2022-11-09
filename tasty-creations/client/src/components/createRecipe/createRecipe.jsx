import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./createRecipe.css";

const CreateRecipe = () => {
    const navigate = useNavigate()
    const userid= localStorage.getItem("userid")
  const [recipe, setRecipes] = useState({
    AuthorName: "",
    RecipeName: "",
    category: "",
    instruction: "",
    ingredientList: "",
    Rating: "",
    UserID: userid,
  });

  const handleReset =()=>navigate("/account")

  const handleFormSubmit = async (e) =>{
    e.preventDefault();
    if(window.confirm("Are you sure you want to create this recipe?") === false){
        return;
    }else{
        await axios.post(`${process.env.REACT_APP_API_HOST}/createrecipe/${userid}`, recipe);
        navigate(`/account`)
    }
  }

  const handleFieldChange = (event, field) =>
    setRecipes((recipes) => ({
      ...recipes,
      [field]: event.target.value,
    }));
  return (
    <div className="recipe">
      <div className="recipePage">
        <h1>Create Recipe</h1>
        <form action="" className="createRecipeForm" onSubmit={handleFormSubmit}>
          <input
            type="text"
            onChange={(event)=> handleFieldChange(event, "AuthorName")}
            className="createRecipeInput"
            placeholder="Author's Name"
            required
          />
          <input
            type="text"
            onChange={(event)=> handleFieldChange(event, "RecipeName")}
            className="createRecipeInput"
            placeholder="Recipe Name"
            required
          />
          <input
            type="text"
            onChange={(event)=> handleFieldChange(event, "category")}
            className="createRecipeInput"
            placeholder="Category"
            required
          />
          <input
            type="text"
            onChange={(event)=> handleFieldChange(event, "instruction")}
            className="createRecipeInput"
            placeholder="Instructions"
            required
          />
          <input
            type="text"
            onChange={(event)=> handleFieldChange(event, "ingredientList")}
            className="createRecipeInput"
            placeholder="Ingredient list"
            required
          />
          <input
            type="text"
            onChange={(event)=> handleFieldChange(event, "Rating")}
            className="createRecipeInput"
            placeholder="Rating"
            required
          />
          <div className="formatButtons">
            <button type="submit">Create</button>
            <button type="reset" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
