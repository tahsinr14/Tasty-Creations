import { useState } from "react";
import "./navbar.css";
import axios from "axios";
import { useEffect } from "react";

function checkUser() {
  let id = localStorage.getItem("userid");
  if (id !== null) {
    return "";
  }
  return "hidden-css";
}

const NavBar = () => {
  let id = localStorage.getItem("userid");
  console.log(id);
  const [name, setName] = useState("");
  useEffect(() => {
    axios.get(`http://localhost:3001/user/${id}`).then((res) => {
      // console.log(res);
      setName(res.data.fullName);

      if (id !== null) {
        document.getElementById("statusUser").style.display = "none";
        document.getElementById("logout").style.display = "block";
        document.getElementById("profile").style.display = "block";
      }
    });
  }, []);

  console.log(name);

  return (
    <header className="App-header">
      <div className="navbar">
        <div className="App-logo">
          <a href="/home">Tasty Creations</a>
        </div>
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>External Source</li>
          <li><a href="/about">About</a></li>
          <li>
            <a href="/chat">Chat</a>
          </li>
          <li className={checkUser()}>
            <a href="/account">{name}</a>
          </li>
          <li>
            <a id="statusUser" href="/">
              Log In
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
