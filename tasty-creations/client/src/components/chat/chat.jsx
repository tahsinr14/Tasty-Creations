import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./chat.css";
import io from "socket.io-client";
import ChatHistory from "./components/chatHistory";
import { useNavigate, useParams } from "react-router";

function Chat() {
  // create value from getuser function use State to update value in chatHistory
  // check login user

  const isAuthenticated = localStorage.getItem("userid") !== null;
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [message, setMessage] = useState([]);
  const [userName, setUserName] = useState([]);

  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

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

  let { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/${id}`)
      .then((response) => {
        setUserName(response.data.fullName);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // get user id from url

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
    e.target.message.value = "";
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
          <img
            src="https://www.samenfiks.nl/wp-content/uploads/2020/02/no-profile-picture.jpg"
            alt="avatar"
          />

          <div className="chat-about">
            <div className="chat-with">Chat with {userName}</div>
            <div className="chat-num-messages">Already 1 902 messages</div>
          </div>
          <i className="fa fa-star"></i>
        </div>

        <div className="chat-history">
          <ul style={{ display: "block" }} id="chat-list-history">
            {message.map((item) => {
              return (
                <ChatHistory
                  key={item._id}
                  time={`${hour}:${minute}`}
                  name={item.fromSelf ? "me" : "to you"}
                  message={item.message}
                  chatType={item.fromSelf ? "0" : "1"}
                />
              );
            })}
          </ul>
        </div>

        <form onSubmit={handleOnSubmit} className="chat-message clearfix">
          <textarea
            name="message"
            id="message"
            placeholder="Type your message"
            rows="2"
          ></textarea>

          <i className="fa fa-file-o"></i>
          <i className="fa fa-file-image-o"></i>

          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
