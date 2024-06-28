// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Registration } from './components/Registration';
import { OTPVerification } from './components/OTPVerification';
import { Login } from './components/Login';
import { Main } from './components/Main';
import { Admin } from './components/Admin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Registration />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
