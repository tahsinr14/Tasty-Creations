import axios from 'axios'
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./detailsStyle.css";


function Details() {
  const [user, setUser] = useState([]) 

  useEffect (()=>{
    axios.get("http://localhost:3001/account")
    .then(res=>{
      console.log(res.data.users[0]._id);
      localStorage.setItem('user_id', res.data.users[0]._id)
      setUser(res.data.users)
    }).catch(err=>{
      console.log(err);
    })
  },[] );

  return (
    <>
      <div className="overall">
        <div className="logout">
            <button type="button">Logout</button>
        </div>
        <div className='details-container'>
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
              <ul>
                {
                  user.map(u=>(
                    <li key={u._id}>{u.FullName}</li>
                  ))
                } 
              </ul>
            </div>
            <div>
              <h4>E-mail Address</h4>
              <ul>
                {
                  user.map(u=>(
                    <li key={u._id}>{u.Email}</li>
                  ))
                } 
              </ul>
            </div>
            <div>
              <h4>Gender</h4>
              <ul>
                {
                  user.map(u=>(
                    <li key={u._id}>{u.Gender}</li>
                  ))
                } 
              </ul>
            </div>
            <div>
              <Link to="/account/edit">Change information</Link>
            </div>
          </div>
          <div>
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user profile" />
          </div>
        </div>
      </div>
    </>
  )
};

export default Details;
