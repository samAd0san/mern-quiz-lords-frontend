import React from 'react';
import '../styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* Import Components */
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
    element: <Main />
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