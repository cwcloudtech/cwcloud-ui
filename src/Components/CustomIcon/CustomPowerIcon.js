import React from 'react';
import classes from './CustomIcon.module.css';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import { Tooltip } from '@material-ui/core';

const CustomPowerIcon = (props) => {
    return <Tooltip title={props.title} placement='bottom'>
        <PowerSettingsNewOutlinedIcon className={classes.powerIcon + ' powerBtn'} onClick={props.onClick} />
    </Tooltip>
}

export default CustomPowerIcon