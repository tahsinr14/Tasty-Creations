import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./chat.css";
import { useNavigate, useParams } from "react-router";

function ChatList() {
  // create value from getuser function use State to update value in chatHistory
  // check login user

  const isAuthenticated = localStorage.getItem("userid") !== null;
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/list-user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const { id } = useParams();

  useEffect(() => {
    setInterval(() => {
      axios
        .post("http://localhost:3001/messages/getMessages", {
          from: localStorage.getItem("userid"),
          to: id,
        })
        .then((response) => {
          setMessage(...message, response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 2000);
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    const message = e.target.message.value;
    const from = localStorage.getItem("userid");
    //get id on url
    const to = id;

    console.log(message, from, to);
    axios
      .post(
        "http://localhost:3001/messages/addMessage",

        {
          message: message,
          from: from,
          to: to,
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (!isAuthenticated) {
    return navigate("/login");
  }

  return (
    <div className="container clearfix">
      <div className="people-list-chat" id="people-list-chat">
        <div className="search">
          <input type="text" placeholder="search" />
          <i className="fa fa-search"></i>
        </div>
        <ul className="list">
          {user.map((item) => {
            return (
              <li className="clearfix" key={item._id}>
                <img
                  src="https://www.samenfiks.nl/wp-content/uploads/2020/02/no-profile-picture.jpg"
                  alt="avatar"
                />
                <div className="about">
                  <div className="name">
                    <a href={`/chat/${item._id}`} style={{ color: "white" }}>
                      {item.fullName}
                    </a>
                  </div>
                  <div className="status">
                    <i className="fa fa-circle online"></i> Online
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="chat">
        <div className="chat-header clearfix">
          <div className="chat-about">
            <div className="chat-with">Pick a user to chat</div>
          </div>
          <i className="fa fa-star"></i>
        </div>

        <div className="chat-history">
          <h1>Pick a user to chat</h1>
        </div>
      </div>
    </div>
  );
}

export default ChatList;
