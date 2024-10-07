import React from 'react';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CustomIcon from './CustomIcon';

const CustomRerunIcon = (props) => (
    <CustomIcon
        IconComponent={AutorenewOutlinedIcon}
        title={props.title}
        onClick={props.onClick}
        iconClass="rerunBtn"
    />
);

export default CustomRerunIcon
