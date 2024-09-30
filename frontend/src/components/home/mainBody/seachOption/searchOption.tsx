import * as React from 'react'
import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import classes from './searchOption.module.css'
import InputField from '../../../utils/inputField/inputField';

interface OwnerType {
    id: number,
    email: string,
}

interface authorDataType {
    author: string,
    title: string,
    filepath: string,
    owner: OwnerType,
}

// const searchResults1 = [
//     { author: 'Arpit', title: 'The Financial World The Financial World The Financial', user: 'arpt1'},
//     { author: 'Rohan', title: 'Bad Politics', user: 'raj04'},
//     { author: 'Raj', title: 'Shameless Laws', user: 'rohan2'},
//     { author: 'Arpit', title: 'Money Market', user: 'raj04'},
//     { author: 'Rohan', title: 'Bad Politics', user: 'raj04'},
//     { author: 'Raj', title: 'Shameless Laws', user: 'rohan2'},
//     { author: 'Arpit', title: 'Money Market', user: 'raj04'},
//     { author: 'Rohan', title: 'Bad Politics', user: 'raj04'},
//     { author: 'Raj', title: 'Shameless Laws', user: 'rohan2'},
//     { author: 'Arpit', title: 'Money Market', user: 'raj04'},
// ]

const NO_DATA = 'No Data Found'
// const sample_pdf = 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf'

const SearchOption = () => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [subject, setSubject] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [errorMsg, setErrorMsg] = useState('')
    const [loader, setLoader] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        setSearchResults([])
        setLoader(true)

        if(title || author){        
            let data = JSON.stringify({
                "title": title,
                "author": author,
                "category": subject,
            });

            const currentTime = new Date()
            const user = sessionStorage.getItem('user')
            const session_id = currentTime.getTime()+"-"+user?.split('@')[0]
            const user_id = sessionStorage.getItem('user_id')

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_BACKEND_URL}/search/${session_id}/${user_id}`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };
            
            try {
                const response = await axios.request(config);
                if(response.data){
                    // console.log(JSON.stringify(response.data));
                    if(response.data.docs.length>=1){
                        setSearchResults(response.data.docs)
                    }else{
                        setErrorMsg(NO_DATA)
                    }
                }
                setLoader(false)
            } catch (error) {
                console.log(error);
                setLoader(false)
                setErrorMsg(error.message)
            }
        }else{
            setErrorMsg('Please provide the Author or Title to look for ?')
            setLoader(false)
        }
    }

    const handleDownload = async (filepath) => {
        setLoader(true)
        let fileName = filepath.split('/')
        fileName = fileName[fileName.length-1]

        let data = JSON.stringify({ "filepath": filepath });
        const currentTime = new Date()
        const user = sessionStorage.getItem('user')
        const session_id = currentTime.getTime()+"-"+user?.split('@')[0]
        const user_id = sessionStorage.getItem('user_id')

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BACKEND_URL}/download/${session_id}/${user_id}`,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };

        try {
            const response = await axios.request(config);
            if(response.status === 200){
                // console.log(JSON.stringify(response.data));
                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            setLoader(false)
        } catch (error) {
            console.log(error);
            setLoader(false)
            setErrorMsg(error.message)
        }
    }

  return (
    <div>
        <div className={classes.search_options}>
            <form className={classes.login_container} onSubmit={handleSearch}>
                <InputField label={'Title'} type={'text'} value={title} setValue={setTitle} />
                <InputField label={'Author'} type={'text'} value={author} setValue={setAuthor} />
                <InputField label={'Subject'} type={'text'} value={subject} setValue={setSubject} />

                <div className={classes.search_button}>
                    <Button variant="outlined" type='submit' > Submit </Button>
                </div>
            </form>
            { errorMsg && errorMsg!==NO_DATA ? <p className={classes.error}> { errorMsg }</p>: <p className={classes.blank}> </p> }
        </div>
        <hr />
        <div className={classes.search_result}>
            <div className={classes.right_container}>
                <h3> Search Result </h3>
                {loader && <CircularProgress /> }
                { errorMsg===NO_DATA && <p className={classes.error}> { errorMsg }</p> }

                { searchResults.map( (eachResult: authorDataType, index: number)  => {
                    return(
                        <div className={classes.right_author_list_container} key={index}>
                            <div className={classes.author}>
                                <span> {eachResult.author} </span>
                            </div>
                            <div className={classes.title}>
                                {eachResult.title.length<55 ?
                                    <span> : {eachResult.title} </span>
                                    :
                                    <span> : {eachResult.title.slice(0,45)+'...'} </span>
                                }
                            </div>
                            <div className={classes.user}>
                                <span> {eachResult.owner.email} </span>
                            </div>
                            <button onClick={() => handleDownload(eachResult.filepath)} title='Download'
                                className={classes.downloadButton}>
                                <DownloadIcon />
                            </button>
                            {/* <a href={sample_pdf} className={classes.downloadButton}
                                download="Example-PDF-document" target="_blank" rel="noopener noreferrer">
                                <DownloadIcon />
                            </a> */}
                        </div>
                    )
                })
                }
            </div>
        </div>
    </div>
  )
}

export default SearchOption