import React from 'react';
import { Tooltip } from '@mui/material';
import classes from './CustomIcon.module.css';

const CustomIcon = React.forwardRef(({ IconComponent, title, onClick, iconClass }, ref) => {
  return (
    <Tooltip title={title} placement="bottom">
      <IconComponent 
        ref={ref}
        className={`${iconClass} ${classes.icon}`} 
        onClick={onClick} 
      />
    </Tooltip>
  );
});

export default CustomIcon;
