import React from 'react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CustomIcon from './CustomIcon';

const CustomCopyIcon = (props) => (
    <CustomIcon
        IconComponent={ContentCopyOutlinedIcon}
        title={props.title}
        onClick={props.onClick}
        iconClass="copyBtn"
    />
);

export default CustomCopyIcon
