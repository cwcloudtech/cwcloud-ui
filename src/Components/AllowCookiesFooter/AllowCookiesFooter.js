import React from 'react';
import { FaCookieBite } from 'react-icons/fa';
import GlobalContext from '../../Context/GlobalContext'
import classes from './AllowCookiesFooter.module.css';
import '../../common.css';
import Translate from '../Translate/Translate'

// A discreet floating card (bottom-left, cwclock/strong-fish style) rather
// than a full-width bar covering the page footer; themed with the design tokens.
const AllowCookiesFooter = () => {
    const context = React.useContext(GlobalContext)
    return (
        <div className={classes.mainContainer} role="dialog" aria-live="polite" aria-label="Cookies">
            <span className={classes.icon} aria-hidden="true">
                <FaCookieBite />
            </span>
            <p className={classes.cookiesText}>
                <Translate content="cookies.why" />{' '}
                <a href={`${process.env.REACT_APP_DOCURL}/docs/terms/`} className={classes.learnMore} target="_blank" rel="noreferrer">
                    <Translate content="cookies.learnMore" />
                </a>
            </p>
            <button type="button" className={classes.buttonAllow} onClick={context.allowCookies}>
                <i className="fa-solid fa-check"></i>
                <Translate content="cookies.understand" />
            </button>
        </div>
    )
}

export default AllowCookiesFooter
