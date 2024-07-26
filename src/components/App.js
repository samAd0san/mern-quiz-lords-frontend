import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

const Layout = () => {
  return (
    <div>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Login />} />
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
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
