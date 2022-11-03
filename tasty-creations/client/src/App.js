import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginForm from "./components/account/login/loginForm";
import RegisterForm from "./components/registerForm";
import AccountEdit from "./components/account/edit/edit";
import AccountDetails from "./components/account/details/details";
import ViewOne from "./components/singleFood/singleFood";
import Home from "./components/home/home"
import Navbar from "./components/layout/navbar";

function App() {
  return (
    <div>
      <div className="App">
      <Navbar />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/view/:id" element={<ViewOne/>}></Route>
            <Route path="/account" element={<AccountDetails />}></Route>
            <Route path="/account/edit" element={<AccountEdit />}></Route>
          </Routes>
        </BrowserRouter>
        </div>
    </div>

  );
}

export default App;
