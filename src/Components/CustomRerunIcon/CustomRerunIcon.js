import React from 'react';
import classes from './CustomRerunIcon.module.css';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import { Tooltip } from '@material-ui/core';

const CustomRerunIcon = (props) => {
    return <Tooltip title={props.title} placement='right'>
        <AutorenewOutlinedIcon className={classes.rerunIcon + ' rerunBtn'} onClick={props.onClick} />
    </Tooltip>
}

export default CustomRerunIcon