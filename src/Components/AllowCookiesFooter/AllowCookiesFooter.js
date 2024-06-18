import React from 'react';
import { Button } from 'reactstrap';
import GlobalContext from '../../Context/GlobalContext'
import classes from './AllowCookiesFooter.module.css';
import '../../common.css';
import Translate from 'react-translate-component'

const AllowCookiesFooter = () => {
    const context = React.useContext(GlobalContext)
    return (
        <div className={classes.mainContainer}>
            <div className={classes.containerText}>
                <h5 className={classes.cookiesText}>
                    <Translate content="cookies.why" />{' '}
                    <a href={`${process.env.REACT_APP_DOCURL}/docs/terms/`} className={classes.learnMore}>
                        <Translate content="cookies.learnMore" />
                    </a>
                </h5>
            </div>
            <div className={classes.containerControl}>
                <Button className={classes.buttonAllow} onClick={context.allowCookies}>
                    <Translate content="cookies.understand" />
                </Button>
            </div>
        </div>
    )
}

export default AllowCookiesFooter