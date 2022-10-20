import "./home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemComponent from "../ItemComponent";

function Home() {
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
