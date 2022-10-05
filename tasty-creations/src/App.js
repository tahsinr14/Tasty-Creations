import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginForm from './components/loginForm'
import RegisterForm from './components/registerForm';

function App() {
  return (
    <div className="page">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm/>}/>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={ <RegisterForm/>}/> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
