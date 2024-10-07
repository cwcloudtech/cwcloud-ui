import React from 'react';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';
import CustomIcon from './CustomIcon';

const CustomPairIcon = (props) => (
    <CustomIcon
        IconComponent={TapAndPlayIcon}
        title={props.title}
        onClick={props.onClick}
        iconClass="pairBtn"
    />
);

export default CustomPairIcon
