import * as React from 'react'
import { useEffect, useState } from 'react'
import { Lock, LockOpen } from '@mui/icons-material';
import classes from './rightSideUserFiles.module.css'

interface authorDataType {
    author: string,
    title: string,
    locked: boolean
}

// const authorData = [
//     { author: 'Arpit', title: 'The Financial World'},
//     { author: 'Rohan', title: 'Bad Politics'},
//     { author: 'Raj', title: 'Shameless Laws'},
//     { author: 'Arpit', title: 'Money Market'},
//     { author: 'Rohan', title: 'Bad Politics'},
//     { author: 'Raj', title: 'Shameless Laws'},
//     { author: 'Arpit', title: 'Money Market'},
//     { author: 'Rohan', title: 'Bad Politics'},
//     { author: 'Raj', title: 'Shameless Laws'},
//     { author: 'Arpit', title: 'Money Market'},
//     { author: 'Rohan', title: 'Bad Politics'},
//     { author: 'Raj', title: 'Shameless Laws'},
//     { author: 'Arpit', title: 'Money Market'},
// ]


const RightSideUserFiles = ({ successMsg }) => {

    const [userFiles, setUserFiles] = useState<authorDataType[]>([]);

    useEffect(() => {
        let user_files = sessionStorage.getItem('user_files');
        if (user_files) {
            const parsedUserFiles = JSON.parse(user_files);
            // Initialize locked property for each item
            const initializedUserFiles = parsedUserFiles.map((file: authorDataType) => ({
                ...file,
                locked: false
            }));
            setUserFiles(initializedUserFiles);
        }
    }, [successMsg]);

    const toggleLock = (index: number) => {
        setUserFiles(prevFiles => 
            prevFiles.map((file, i) => 
                i === index ? { ...file, locked: !file.locked } : file
            )
        );
    };

  return (
    <div className={classes.right_container}>
        <h3> User Files </h3>
        { userFiles.length >=1 && userFiles.map( (eachBook: authorDataType, index: number)  => {
            return(
                <div className={classes.right_author_list_container} key={index}>
                    <div>
                        <button className={classes.lockButton} onClick={() => toggleLock(index)}>
                            {eachBook.locked ? <Lock /> : <LockOpen />}
                        </button>
                    </div>
                    <div className={classes.author}>
                        <span> {eachBook.author} </span>
                    </div>
                    <div className={classes.title}>
                        {eachBook.title.length<35 ?
                            <span> : {eachBook.title} </span>
                            :
                            <span> : {eachBook.title.slice(0,33)+'...'} </span>
                        }
                    </div>
                </div>
            )
        })
        }
    </div>
  )
}

export default RightSideUserFiles