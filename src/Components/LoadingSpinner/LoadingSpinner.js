import React, { useContext } from 'react';
import classes from './LoadingSpinner.module.css';
import { Spinner } from 'reactstrap';
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";

const LoadingSpinner = () => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    return (
        <div className={classes.mainContainer} style={{backgroundColor: colors.spinload[_mode]}}>
            <Spinner style={{ height: '80px', width: '80px', color: colors.title[_mode], borderWidth: '8px' }} />
        </div>
    )
}

export default LoadingSpinner
