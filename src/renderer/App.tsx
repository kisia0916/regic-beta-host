import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Login from './Pages/Login';
import { useState } from 'react';
import Home from './Pages/Home';


export default function App() {
  const [isLogin,setIsLogin] = useState<boolean>(false)
  return (
    <Router>
      <Routes>
        <Route path="/" element={isLogin?<Home/>:<Login/>} />
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  );
}
