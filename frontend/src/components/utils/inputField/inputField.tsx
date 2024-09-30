import * as React from 'react'
import classes from './inputfield.module.css'
import { Input } from '@mui/material'

interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    setValue: any;
}

const InputField: React.FC<InputFieldProps> = ({label, type, value, setValue} : InputFieldProps) => {
  return (
    <div className={classes.input_container}>
        <div className={classes.label}>
            <label> {label}  </label>
        </div>
        <div className={classes.input}>
            <Input type={type} className={classes.textField} value={value} onChange={(e) => setValue(e.target.value)}/>
        </div>                
    </div>
  )
}

export default InputField