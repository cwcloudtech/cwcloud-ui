import React, { useContext } from 'react';
import classes from './LoadingSpinner.module.css';
import { Spinner } from 'reactstrap';
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";

const LoadingSpinner = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;

    return (
        <div className={classes.mainContainer} style={{
            backgroundColor: props.disableBackgroundColor ? null : colors.spinload[_mode],
            height: props.containerHeight ?? '70vh'
        }}>
            <Spinner style={{
                height: props.spinnerHeight ?? '80px', width: props.spinnerWidth ?? '80px',
                color: colors.title[_mode], borderWidth: props.borderWidth ?? '8px'
            }} />
        </div>
    )
}
export default LoadingSpinner
