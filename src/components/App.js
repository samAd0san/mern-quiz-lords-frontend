import React from 'react';
import '../styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* Import Components */
import Home from './Home'; // Import Home component
import Main from './Main';
import Quiz from './Quiz';
import Result from './Result';
import { CheckUserExist } from '../helper/helper';
import Header from './Header';
import Footer from './Footer';
import ResultTable from './ResultTable';

/* Define Routes */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home /> // Set Home component as root
  },
  {
    path: '/main',
    element: <Main /> // Update path to '/main' for Main component
  },
  {
    path: '/quiz',
    element: <CheckUserExist><Quiz /></CheckUserExist>
  },
  {
    path: '/result',
    element: <CheckUserExist><Result /></CheckUserExist>
  },
  {
    path: '/faculty',
    element: <ResultTable />
  },
]);

function App() {
  return (
    <div>
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;