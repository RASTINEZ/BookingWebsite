import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Login from './components/Login.jsx'
import Register  from './components/Register.jsx'



import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Schedule from './components/Schedule.jsx'







const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "Login",
    element: <Login />,
  },
 
  {
    path: "Register",
    element: <Register/>,
  },
  {
    path: "Schedule/:roomId",
    element: <Schedule/>,
  },
  

]);




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)


