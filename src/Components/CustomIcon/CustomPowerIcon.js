import React from 'react';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import CustomIcon from './CustomIcon';

const CustomPowerIcon = (props) => (
    <CustomIcon
        IconComponent={PowerSettingsNewOutlinedIcon}
        title={props.title}
        onClick={props.onClick}
        iconClass="powerBtn"
    />
);

export default CustomPowerIcon
