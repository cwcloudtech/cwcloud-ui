import React from 'react';
import { Tooltip } from '@mui/material';
import classes from './CustomIcon.module.css';

const CustomIcon = ({ IconComponent, title, onClick, iconClass }) => {
    return (
        <Tooltip title={title} placement="bottom">
            <IconComponent className={`${iconClass} ${classes.icon}`} onClick={onClick} />
        </Tooltip>
    );
};

export default CustomIcon;
