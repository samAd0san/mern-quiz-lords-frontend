import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* Import Components */
import Main from './Main';
import Quiz from './Quiz';
import Result from './Result';

/* Define Routes */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />
  },
  {
    path: '/quiz',
    element: <Quiz />
  },
  {
    path: '/result',
    element: <Result />
  },
])

function App() {
  return (
    <div className="text-3xl font-bold underline">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;