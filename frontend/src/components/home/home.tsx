import * as React from 'react'
import { useState } from 'react'
import classes from './home.module.css';
import Navbar from './navbar/navbar';
import LeftSideOptions from './leftSideOptions/leftSideOptions';
import RightSideUserFiles from './rightSideUserFiles/rightSideUserFiles';
import MainBody from './mainBody/mainBody';


const Home = () => {

  const [uploadPage, setUploadPage] = useState(true)
  const [successMsg, setSuccessMsg] = useState('')

  return (
    <div className={classes.container}>
      <Navbar />
      <div className={classes.home}>
        <div className={classes.left}>
          <LeftSideOptions uploadPage={uploadPage} setUploadPage={setUploadPage} />
        </div>
        <div className={classes.main}>
          <MainBody uploadPage={uploadPage} successMsg={successMsg} setSuccessMsg={setSuccessMsg} />
        </div>
        <div className={classes.right}>
          <RightSideUserFiles successMsg={successMsg} />
        </div>  
      </div>
    </div>
  )
}

export default Home