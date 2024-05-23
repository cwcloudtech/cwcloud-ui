import React from 'react';
import classes from './CustomIcon.module.css';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';
import { Tooltip } from '@mui/material';

const CustomPairIcon = (props) => {
    return <Tooltip title={props.title} placement='bottom'>
        <TapAndPlayIcon className={classes.pairIcon + ' pairBtn'} onClick={props.onClick} />
    </Tooltip>
    
}

export default CustomPairIcon
