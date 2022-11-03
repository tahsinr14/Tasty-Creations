import axios from 'axios'
import { useState, useEffect, useRef } from 'react';
import { Link ,useNavigate} from "react-router-dom";
import "./detailsStyle.css";


function Details() {
  const navigate= useNavigate();
  const [user, setUser] = useState({}) 
  const [pic, setpic] = useState('') 

  const userid= localStorage.getItem('userid');
  useEffect (()=>{
    axios.get("http://localhost:3001/user/" + userid)
    .then(res=>{
      console.log(res.data);
      setUser(res.data)
    }).catch(err=>{
      console.log(err);
    })
  },[] );

  useEffect (()=>{
    axios.get("http://localhost:3001/profile/"+userid)
    .then(res=>{
      let userProfile= res.data.preSignedUrls[res.data.preSignedUrls.length-1];
      console.log(userProfile)
      setpic(userProfile);
    })
  },[])
  
  const onLogout = (e) => {
    localStorage.clear();
    navigate('/login');
    alert("Logout successfully!");
    console.log(e);
  };
  return (
    <>
      <div className="overall">
        <div className="logout">
            <button type="button" onClick={onLogout}>Logout</button>
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
                  user.fullName
                } 
              </ul>
            </div>
            <div>
              <h4>E-mail Address</h4>
              <ul>
                {
                 user.email
                } 
              </ul>
            </div>
            <div>
              <h4>Gender</h4>
              <ul>
                {
                  user.gender
                } 
              </ul>
            </div>
            <div>
              <Link to="/account/edit" id='ChangeInfobtn'>Change information</Link>
            </div>
          </div>
          <div>
          <img src={pic} alt="user profile" />
          </div>
        </div>
      </div>
    </>
  )
};

export default Details;
