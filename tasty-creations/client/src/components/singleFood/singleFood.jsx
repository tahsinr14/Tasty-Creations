import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './singleFood.css'




function ViewOne(){
    const [food, setFood] = useState({})
    const foodid = useParams() 
    const [rating, setRating] = useState(0);

    useEffect(() =>{
        axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodid.id}`)
        .then(response => {
            console.log(response.data.meals[0]);
            setFood(response.data.meals[0])
        })
        .catch((error) => console.log(error))
        axios
        .get(`/rating/${foodid.id}`)
        .then((response) => {
            console.log(response)
          setRating(response.data.rating);
        })
        .catch((e) => {
          if (e.response.status === 404) {
            axios.post('/rating', {
              recipeId: foodid.id,
              rating: rating,
            });
          }
        });
    },[])

    useEffect(()=>{
        console.log(food);
    },food)
    return (
        <>
        
               <div className='overall-container' >
                <div className='left'>
                    <div className="image">
                        <img src={food.strMealThumb} alt="" />    
                    </div>

                    <div>
                        Instructions:
                        <div className="instructions">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio inventore laborum, cum, vel dolorem culpa quia tempore laboriosam assumenda obcaecati eum, dolorum autem eos voluptate libero odit alias! Laudantium, in?
                        </div>
                    </div>
                </div>
                <div className="description">
                    <table border>
                        <tr>
                            <th>Author:</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Recipe:</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Category:</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Keyword Text:</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Last Update:</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Likes: {rating}</th>
                            <td></td>
                        </tr>
                    </table>
                     
                </div>
            </div>
        
         
        </>
    );
}

export default ViewOne;