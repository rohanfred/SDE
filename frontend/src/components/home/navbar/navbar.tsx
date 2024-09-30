import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import classes from './navbar.module.css';

const Navbar = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')

    useEffect( () => {
        const getUser = sessionStorage.getItem('user')
        if(getUser) setUsername(getUser)
    }, [])

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }

  return (
    <div className={classes.navbar_container}>
        <div className={classes.left_navbar}>
            <h3> ICON </h3>
        </div>
        <div className={classes.right_navbar}>
            <span> {username.split('@')[0].toUpperCase()} </span>
            <Button onClick={handleLogout}>  Logout </Button>
        </div>
    </div>
  )
}

export default Navbar