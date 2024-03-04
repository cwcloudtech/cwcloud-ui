import React from 'react';
import classes from './ErrorCard.module.css';
import CardComponent from '../../../Cards/CardComponent/CardComponent';
import GlobalContext from '../../../../Context/GlobalContext';
import colors from '../../../../Context/Colors';

const ErrorCard = (props) => {
    const context = React.useContext(GlobalContext);
    const _mode = context.mode;
    const { error } = props;
    return (
        <CardComponent containerStyles={props.containerStyles}>
            <h3 className={classes.textTitle} style={{ color: colors.title[_mode] }}>Error occured</h3>
            <p className={classes.errorText}>{error}</p>
        </CardComponent>
    );
};

export default ErrorCard;
