import './navbar.css';

export default () => (
  <header className="App-header">
    <div className="navbar">
      <div className="App-logo">
        Tasty Creations
      </div>
      <ul>
        <li>Home</li>
        <li>External Source</li>
        <li>About</li>
        <li>Contact Us</li>
        <li>
          <a href="/account">My Account</a>
        </li>
        <li>Log In</li>
      </ul>
    </div>
  </header>
);
