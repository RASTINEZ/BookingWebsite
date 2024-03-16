import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Login from './components/Login.jsx'
import Register  from './components/Register.jsx'

import Schedule from './components/Schedule.jsx'
import HistoryPage from './components/HistoryPage.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminPage from './components/AdminPage.jsx'








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
    path: "Schedule/:roomId", //"Schedule/:roomId"
    element: <Schedule/>,
  },
  {
    path: "HistoryPage/:username",
    element: <HistoryPage/>,
  },
  {
    path: "AdminPage",
    element: <AdminPage/>,
  },
  

]);




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)


