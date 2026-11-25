import React, { forwardRef } from 'react';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
// import classes from './LoadingButton.module.css';
import '../../common.css';
import { Spinner } from 'reactstrap';

// Forwards its ref and any extra props (event handlers, aria-*) to the MUI
// Button, so it can be wrapped in a MUI Tooltip like any native button.
const LoadingButton = forwardRef((props, ref) => {
    const { variant, color, disabled, type, className, style, component, loading, onClick, icon, tooltip, children, ...rest } = props;
    const button = (
        <Button
            {...rest}
            ref={ref}
            variant={variant || 'outlined'}
            color={color}
            disabled={disabled}
            type={type}
            className={`buttonStyle ${className}`}
            style={style}
            component={component}
            onClick={!loading ? onClick : null}>
            {loading ? <Spinner className="spinner" size="sm" /> :
                icon && <i className={`icon ${icon}`}></i>}
            {children}
        </Button>
    );

    return tooltip ? (
        <Tooltip title={tooltip}>
            {button}
        </Tooltip>
    ) : button;
});

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton
