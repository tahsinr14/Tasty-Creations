import "./navbar.css";

const navBar = () => {
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
          <li>About</li>
          <li>Contact Us</li>
          <li>
            <a href="/account">My Account</a>
          </li>
          <li>
            <a href="/">Log In</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default navBar;

// export default navBar = () => (
//   <header className="App-header">
//     <div className="navbar">
//       <div className="App-logo">
//         Tasty Creations
//       </div>
//       <ul>
//         <li>Home</li>
//         <li>External Source</li>
//         <li>About</li>
//         <li>Contact Us</li>
//         <li>
//           <a href="/account">My Account</a>
//         </li>
//         <li>Log In</li>
//       </ul>
//     </div>
//   </header>
// );
