import React from 'react';
import LinkIcon from '@mui/icons-material/Link';
import CustomIcon from './CustomIcon';

const CustomLinkIcon = (props) => (
    <CustomIcon
        IconComponent={LinkIcon}
        title={props.title}
        onClick={props.onClick}
    />
);

export default CustomLinkIcon
