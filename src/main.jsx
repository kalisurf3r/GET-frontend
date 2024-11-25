
import { createRoot } from 'react-dom/client'
import ReactDom from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import './index.css'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import MyPostsSingle from './pages/MyPostsSingle.jsx'
import AllMyPosts from './pages/AllMyPosts.jsx'
import PublicDash from './pages/PublicDash.jsx'
import ViewProfile from './pages/ViewProfiles.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/post/:id',
        element: <MyPostsSingle  />
      },
      {
        path: '/posts/user/:id',
        element: <AllMyPosts />
      },
      {
        path: '/public',
        element: <PublicDash />
      },
      {
        path: '/profile/:id',
        element: <ViewProfile />
      }
    ],
  },
]);

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);