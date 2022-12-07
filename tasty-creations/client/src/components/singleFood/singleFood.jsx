import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DisplayReviews from "../recipeReview/displayReviews";
import DisplayUserReview from "../recipeReview/displayUserReview";
import "./singleFood.css";

function ViewOne() {
  const [food, setFood] = useState({});
  const foodid = useParams();
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

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
        setRating(response.data.rating);
      })
      .catch((e) => {
        if (e.response.status === 404) {
          axios.post("/rating", {
            recipeId: foodid.id,
            rating: rating,
          });
        }
      })
     axios
      .get(`/review/${foodid.id}`)
      .then((response) => {
        setTotalReviews(response.data.reviews.length);
      })
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
            <tr>
              <th>Reviews: </th>
              <td>{totalReviews}</td>
            </tr>
          </table>
        </div>
        </div>
        <div>
            <b style={{ color: "black" }}>Instructions:</b>
            <div className="instructions">{food.strInstructions}</div>
          </div>
          <DisplayUserReview recipeId={foodid.id}/>
          <DisplayReviews recipeId={foodid.id} />
      </div>
    </>
  );
}

export default ViewOne;