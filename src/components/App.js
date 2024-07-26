import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../styles/App.css';

/* Import Components */
import Home from './Home'; // Import Home component
import Main from './Main';
import Quiz from './Quiz';
import Result from './Result';
import { CheckUserExist } from '../helper/helper';
import Header from './Header';
import Footer from './Footer';
import ResultTable from './ResultTable';
import Signup from '../user/Signup';
import Login from '../user/Login';
import Contact from '../utils/Contact';
import Profile from '../user/Profile';
import UserContext from "../context/UserContext";
import About from './About'

const Layout = () => {
  return (
    <div>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<CheckUserExist><Quiz /></CheckUserExist>} />
          <Route path="/result" element={<CheckUserExist><Result /></CheckUserExist>} />
          <Route path="/faculty" element={<ResultTable />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  const [isLoggedin, setLoggedin] = useState(false);
  return (
    <BrowserRouter>
      <UserContext.Provider value={{ isLoggedin, setLoggedin }}>
        <Layout />
      </UserContext.Provider>
    </BrowserRouter>
  );
}