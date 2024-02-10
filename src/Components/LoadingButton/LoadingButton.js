import React from 'react';
import Button from '@mui/material/Button';
import classes from './LoadingButton.module.css';
import { Spinner } from 'reactstrap';

const LoadingButton = (props) => {
    return (
        <Button
            variant={props.variant || 'outlined'}
            color={props.color}
            disabled={props.disabled}
            className={`${classes.buttonStyle} ${props.className}`}
            style={props.style}
            onClick={!props.loading ? props.onClick: null}>
            {props.loading ? <Spinner className={classes.spinner} size="sm" />:
                props.icon && <i className={`${classes.icon} ${props.icon}`}></i>}
            {props.children}
        </Button>
    )
}

export default LoadingButton