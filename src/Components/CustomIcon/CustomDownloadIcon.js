import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import counterpart from 'counterpart';
import CustomIcon from './CustomIcon';

const CustomDownloadIcon = (props) => (
    <CustomIcon
        IconComponent={DownloadIcon}
        title={counterpart("common.button.download")}
        onClick={props.onClick}
        iconClass="downloadBtn"
    />
);

export default CustomDownloadIcon
