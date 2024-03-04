import React from 'react';
import classes from './CustomIcon.module.css';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Tooltip } from '@mui/material';
import counterpart from 'counterpart';

const CustomDeleteIcon = (props) => {
    return <Tooltip title={counterpart("common.button.delete")} placement='right'>
        <DeleteIcon className={classes.deleteIcon + ' deleteBtn'} onClick={props.onClick} />
    </Tooltip>
    
}

export default CustomDeleteIcon