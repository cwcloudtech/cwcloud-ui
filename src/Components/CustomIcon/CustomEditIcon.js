import React from 'react';
import classes from './CustomIcon.module.css';
import EditIcon from '@mui/icons-material/Edit';
import { Tooltip } from '@mui/material';
import counterpart from 'counterpart';

const CustomEditIcon = (props) => {
    return <Tooltip title={counterpart("common.button.edit")} placement='bottom'>
        <EditIcon className={classes.editIcon + ' editBtn'} onClick={props.onClick} />
    </Tooltip>
    
}

export default CustomEditIcon