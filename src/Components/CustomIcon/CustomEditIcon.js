import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import counterpart from 'counterpart';
import CustomIcon from './CustomIcon';

const CustomEditIcon = (props) => (
    <CustomIcon
        IconComponent={EditIcon}
        title={counterpart("common.button.edit")}
        onClick={props.onClick}
        iconClass="editBtn"
    />
);

export default CustomEditIcon