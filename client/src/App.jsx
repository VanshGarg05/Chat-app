import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext.jsx'

const App = () => {

  const {authUser} = useContext(AuthContext)

  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <Home/> : <Navigate to='/login'/>} />
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to='/'/>} />
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to='/login'/>} />
      </Routes>
    </div>
  )
}

export default App