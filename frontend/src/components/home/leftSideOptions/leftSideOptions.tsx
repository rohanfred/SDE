import * as React from 'react'
import classes from './leftSideOptions.module.css'
import { Button } from '@mui/material'

const LeftSideOptions = ( {uploadPage, setUploadPage }) => {
  return (
    <div className={classes.left_container}>
        <div className={uploadPage ? classes.button_list+' '+classes.selectedList : classes.button_list}>
            <Button onClick={() => setUploadPage(true)}> Search </Button>
        </div>
        <div className={uploadPage ? classes.button_list : classes.button_list+' '+classes.selectedList}>
            <Button onClick={() => setUploadPage(false)}> Upload </Button>
        </div>
    </div>
  )
}

export default LeftSideOptions