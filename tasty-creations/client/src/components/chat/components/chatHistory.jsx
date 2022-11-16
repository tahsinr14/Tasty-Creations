function classRespond(type) {
  if (type === "1") {
    return "message my-message";
  } else {
    return "message other-message float-right";
  }
}

function configClass(type) {
  if (type !== "1") {
    return "message-data align-right";
  } else {
    return "message-data";
  }
}

function ChatHistory(props) {
  return (
    <li className="clearfix" key={props.key}>
      <div className={configClass(props.chatType)}>
        <span className="message-data-time">{props.time}</span> &nbsp; &nbsp;
        <span className="message-data-name">{props.name}</span>{" "}
        <i className="fa fa-circle me"></i>
      </div>
      <div className={classRespond(props.chatType)}>{props.message}</div>
    </li>
  );
}

export default ChatHistory;
