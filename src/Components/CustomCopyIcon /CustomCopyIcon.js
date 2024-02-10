import React from 'react';
import classes from './CustomCopyIcon.module.css';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Tooltip } from '@material-ui/core';

const CustomCopyIcon = (props) => {
    return <Tooltip title={props.title} placement='right'>
        <ContentCopyOutlinedIcon className={classes.copyIcon + ' copyBtn'} onClick={props.onClick} />
    </Tooltip>
}

export default CustomCopyIcon