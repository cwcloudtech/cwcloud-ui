import React from 'react';
import classes from './CustomDownloadIcon.module.css';
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip } from '@mui/material';
import counterpart from 'counterpart';

const CustomDownloadIcon = (props) => {
    return <Tooltip title={counterpart("common.button.download")} placement='right'>
        <DownloadIcon className={classes.downloadIcon + ' downloadBtn'} onClick={props.onClick} />
    </Tooltip>
    
}

export default CustomDownloadIcon