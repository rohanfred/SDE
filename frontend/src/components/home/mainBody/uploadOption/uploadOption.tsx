import * as React from 'react'
import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import classes from './uploadOption.module.css'
import InputField from '../../../utils/inputField/inputField';


const UploadOption = ({ successMsg, setSuccessMsg}) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [subject, setSubject] = useState('')
    const [uploadFile, setUploadFile] = useState('')
    const [fileName, setFileName] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loader, setLoader] = useState(false)

    const handleFile = (e) => {
        setUploadFile(e.target.files[0])
        setFileName(e.target.files[0].name)
    }
    const handleCross = (e) => {
        setUploadFile('')
        setFileName('')
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        setSuccessMsg('')
        setLoader(true)
        
        if(!uploadFile || uploadFile===''){
            setErrorMsg('Please Upload the file')
        }else if(title && author && subject && uploadFile){  
            const currentTime = new Date()
            const user = sessionStorage.getItem('user')
            const session_id = currentTime.getTime()+"-"+user?.split('@')[0]
            const user_id = sessionStorage.getItem('user_id')

            const formData = new FormData()
            formData.append('file', uploadFile)
            formData.append ('doc_title', title )
            formData.append ('doc_author', author )
            formData.append ('doc_category', subject )
            
            const url = `${process.env.REACT_APP_BACKEND_URL}/upload/${session_id}/${user_id}`
            
            try {
                const response = await axios.post(url, formData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data'
                    },
                });
                if(response.data){
                    // console.log(JSON.stringify(response.data));
                    setSuccessMsg('File is Successfully Uploaded')
                    sessionStorage.setItem('user_files', JSON.stringify(response.data.docs));
                    setTitle('')
                    setAuthor('')
                    setSubject('')
                    setUploadFile('')
                    setFileName('')
                    setLoader(false)
                }
            }catch (error) {
                console.log(error);
                setErrorMsg(error.message)
                setLoader(false)
            } 
        }else{
            setErrorMsg('All the fields are mandatory')
        }
        setLoader(false)
    }

  return (
    <div>
        <div className={classes.search_options}>
            <form className={classes.login_container} onSubmit={handleUpload}>
                <InputField label={'Title'} type={'text'} value={title} setValue={setTitle} />
                <InputField label={'Author'} type={'text'} value={author} setValue={setAuthor} />
                <InputField label={'Subject'} type={'text'} value={subject} setValue={setSubject} />

                <div className={classes.search_button_div}>     
                    { uploadFile ?
                        <>
                            <span> {fileName.slice(0, 50)}... </span>
                            <button className={classes.cross_button} onClick={handleCross}> &times; </button>
                        </>
                        :
                        <Button variant="outlined" component="label" className={classes.browse_button}> 
                            Browse <input type="file" hidden onChange={handleFile}/>
                        </Button>
                    }           
                    <Button variant="outlined" type='submit' className={classes.upload_button}> Upload </Button>
                </div>
            </form>
            { errorMsg && <p className={classes.error}> { errorMsg }</p> }
            { successMsg && <p className={classes.success}> { successMsg }</p> }
            {loader && <CircularProgress /> }
        </div>
    </div>
  )
}

export default UploadOption