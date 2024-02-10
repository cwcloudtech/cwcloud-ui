import React from 'react';
import logoimage from '../../utils/logo'
import classes from './LoadingComponent.module.css';

const LoadingPage = () => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <div className={classes.mainContainer} style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <div>
                    <img className={classes.logoImage} alt="loading" src={logoimage()} />
                </div>
            </div>
        </div>
    )
}

export default LoadingPage
