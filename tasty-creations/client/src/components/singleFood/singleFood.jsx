import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./singleFood.css";

function ViewOne() {
  const [food, setFood] = useState({});
  const foodid = useParams();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodid.id}`)
      .then((response) => {
        console.log(response.data.meals[0]);
        setFood(response.data.meals[0]);
      })
      .catch((error) => console.log(error));
    axios
      .get(`/rating/${foodid.id}`)
      .then((response) => {
        console.log(response);
        setRating(response.data.rating);
      })
      .catch((e) => {
        if (e.response.status === 404) {
          axios.post("/rating", {
            recipeId: foodid.id,
            rating: rating,
          });
        }
      });
  }, []);

  useEffect(() => {
    console.log(food);
  }, food);
  return (
    <>
    <div className="foodName">
      {food.strMeal}
    </div>
      <div className="overall-container">
        <div className="top">
          <div className="image">
            <img src={food.strMealThumb} alt="" />
          </div>
          <div className="description">
          <table border>
            <tr>
              <th>Author:</th>
              <td>{food.strArea}</td>
            </tr>
            <tr>
              <th>Recipe:</th>
              <td>
                {food.strIngredient1}, {food.strIngredient2},{" "}
                {food.strIngredient3}, {food.strIngredient4},
                {food.strIngredient5}, {food.strIngredient6},{" "}
                {food.strIngredient7}, {food.strIngredient8}
              </td>
            </tr>
            <tr>
              <th>Category:</th>
              <td>{food.strCategory}</td>
            </tr>
            <tr>
              <th>Likes: </th>
              <td>{rating}</td>
            </tr>
          </table>
        </div>
        </div>
        <div>
            <b style={{ color: "black" }}>Instructions:</b>
            <div className="instructions">{food.strInstructions}</div>
          </div>
      </div>
    </>
  );
}

export default ViewOne;