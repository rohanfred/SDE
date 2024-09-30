import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import InputField from '../utils/inputField/inputField';
import classes from './register.module.css';


const Register = () => {
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loader, setLoader] = useState(false)
    
    const handleSubmit = async (e) => {    
        e.preventDefault()
        setErrorMsg('')
        setLoader(true)

        if(!user || !password || !fullName){
            setErrorMsg('Please fill all the fields')
        }else{
            let data = JSON.stringify({
                "username": fullName,
                "password": password,
                "email": user
            });
    
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_BACKEND_URL}/register`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };
            
            try {
                const response = await axios.request(config);
                if(response){
                    // console.log(JSON.stringify(response.data));
                    setLoader(false)
                    navigate('/login')
                }
            } catch (error) {
                console.log(error);
                setLoader(false)
                setErrorMsg(error.message)
            }            
        }
        setLoader(false)
    }

  return (
    <div className={classes.container}>
        <form className={classes.login_container} onSubmit={handleSubmit}>
            <InputField label={'FullName'} type={'text'} value={fullName} setValue={setFullName} />
            <InputField label={'Username'} type={'email'} value={user} setValue={setUser} />
            <InputField label={'Password'} type={'password'} value={password} setValue={setPassword} />

            {loader ? <CircularProgress /> : <div> <br /> <br /> </div>}
            { errorMsg ? <p className={classes.error}> { errorMsg }</p>: <p className={classes.blank}> </p> }

            <div className={classes.button_container}>
                <div className={classes.register_div}>
                    <Link to='/login' className={classes.register_link}> Cancel </Link>
                </div>
                <div className={classes.login_div}>
                    <Button variant="outlined" type='submit' className={classes.login_button}> Submit </Button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default Register