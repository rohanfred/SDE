import * as React from 'react'
import { useEffect } from 'react'

import { Routes, Route, useNavigate, useLocation} from 'react-router-dom'

import Login from './login/login'
import Register from './register/register'
import Home from './home/home'

const Routing = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect( () => {
    const getAuth = sessionStorage.getItem('auth')
    if(getAuth !== 'true' && location.pathname !== '/login'){
      navigate('/login')
    }
  },[] )

  return (
    <div>
      <Routes>
        <Route path="/register" element={ <Register /> } />
        <Route path="/home" element={ <Home /> } />
        <Route path="/*" element={ <Login /> } />
      </Routes>
    </div>
  )
}

export default Routing