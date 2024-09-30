import * as React from 'react'
import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from '../utils/inputField/inputField';
import classes from './login.module.css';

//  username: admin@gmail.com(1), 
// password: admin(1),

const Login = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loader, setLoader] = useState(false)
    
    const handleSubmit = async (e) => {  
        e.preventDefault()
        setErrorMsg('')
        setLoader(true)

        if(!user || !password){
            setErrorMsg('Please fill all the fields')
        }else{
            let data = JSON.stringify({
                "email": user,
                "password": password
            });

            const currentTime = new Date()
            const session_id = currentTime.getTime()+"-"+user.split('@')[0]
    
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_BACKEND_URL}/login/${session_id}`,
                timeout: Number(process.env.REACT_APP_TIMEOUT),
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };
            
            try {
                const response = await axios.request(config);
                if(response.data){
                    console.log(JSON.stringify(response.data));
                    sessionStorage.setItem('auth', 'true');
                    sessionStorage.setItem('user', user);
                    sessionStorage.setItem('user_id', response.data.user_id);
                    sessionStorage.setItem('user_files', JSON.stringify(response.data.docs));
                    navigate('/home');
                }
            } catch (error) {
                console.log(error);
                setLoader(false)
                if(error.response?.data?.detail) setErrorMsg(error.response.data.detail)
                else if(error.response) setErrorMsg(error.response.statusText)
                else setErrorMsg(error.message)
            }
        }
        setLoader(false)
    }

  return (
    <div className={classes.container}>
        <form className={classes.login_container} onSubmit={handleSubmit}>
            <InputField label={'Username'} type={'email'} value={user} setValue={setUser} />
            <InputField label={'Password'} type={'password'} value={password} setValue={setPassword} />

            {loader ? <CircularProgress /> : <div> <br /> <br /> </div>}
            { errorMsg ? <p className={classes.error}> { errorMsg }</p>: <p className={classes.blank}> </p> }

            <div className={classes.button_container}>
                <div className={classes.register_div}>
                    <Link to='/register' className={classes.register_link}> New User Register  </Link>
                </div>
                <div className={classes.login_div}>
                    <Button variant="outlined" type='submit' className={classes.login_button}> Submit </Button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default Login