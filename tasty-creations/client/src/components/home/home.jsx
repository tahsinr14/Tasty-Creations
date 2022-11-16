import "./home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemComponent from "../ItemComponent";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();
  const LoggedIn = localStorage.getItem("userid");
  const [foods, setFoods] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/search.php?f=b")
      .then((res) => {
        console.log(res.data.meals);
        setFoods(res.data.meals);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigateToRecipes = () => {
    navigate("/allrecipes");
  };
  return (
    <>
      <div className="overall">
        <div className="search-container">
          <input
            type="text"
            id="search"
            placeholder="Search"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        {
          <div>
            {LoggedIn && (
              <button className="navigateToRecipes" onClick={navigateToRecipes}>
                View all user recipes
              </button>
            )}
          </div>
        }
        <div className="food-container">
          <div>
            {foods
              .filter((val) => {
                if (searchTerm === "") {
                  return val;
                } else if (
                  val.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((f) => (
                <a href={`/view/${f.idMeal}`}>
                  <ItemComponent
                    key={f.idMeal}
                    id={f.idMeal}
                    image={f.strMealThumb}
                    Description={f.strInstructions}
                    title={f.strMeal}
                  />
                </a>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
