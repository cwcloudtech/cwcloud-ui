import React from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import counterpart from 'counterpart';
import CustomIcon from './CustomIcon';

const CustomDeleteIcon = (props) => (
    <CustomIcon
        IconComponent={DeleteIcon}
        title={counterpart("common.button.delete")}
        onClick={props.onClick}
        iconClass="deleteBtn"
    />
);

export default CustomDeleteIcon