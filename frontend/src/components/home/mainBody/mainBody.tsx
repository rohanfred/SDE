import * as React from 'react'
import classes from "./mainBody.module.css";
import SearchOption from "./seachOption/searchOption";
import UploadOption from "./uploadOption/uploadOption";

const MainBody = ({ uploadPage, successMsg, setSuccessMsg }) => {
  return (
    <div className={classes.main_container}>
      {uploadPage ? (
        <SearchOption />
      ) : (
        <UploadOption successMsg={successMsg} setSuccessMsg={setSuccessMsg} />
      )}
    </div>
  );
};

export default MainBody;
