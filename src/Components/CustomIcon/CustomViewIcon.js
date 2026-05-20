import React from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CustomIcon from './CustomIcon';

const CustomViewIcon = (props) => (
    <CustomIcon
        IconComponent={VisibilityOutlinedIcon}
        title={props.title || 'View'}
        onClick={props.onClick}
        iconClass="viewBtn"
    />
);

export default CustomViewIcon