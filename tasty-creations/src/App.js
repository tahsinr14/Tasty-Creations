import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginForm from './components/loginForm'
import RegisterForm from './components/registerForm';
import AccountDetails from './components/account/details/details';
import AccountEdit from './components/account/edit/edit';

function App() {
  return (
    <div className="page">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm/>}/>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={ <RegisterForm/>}/>
          <Route path="/account" element={<AccountDetails />}></Route>
          <Route path="/account/edit" element={<AccountEdit />}></Route> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
