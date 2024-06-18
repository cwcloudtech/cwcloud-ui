import React from 'react';
import Button from '@mui/material/Button';
// import classes from './LoadingButton.module.css';
import '../../common.css';
import { Spinner } from 'reactstrap';

const LoadingButton = (props) => {
    return (
        <Button
            variant={props.variant || 'outlined'}
            color={props.color}
            disabled={props.disabled}
            type={props.type}
            className={`buttonStyle ${props.className}`}
            style={props.style}
            component={props.component}
            onClick={!props.loading ? props.onClick: null}>
            {props.loading ? <Spinner className="spinner" size="sm" />:
                props.icon && <i className={`icon ${props.icon}`}></i>}
            {props.children}
        </Button>
    )
}

export default LoadingButton