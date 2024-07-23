import Skeleton from 'react-loading-skeleton'
import React, { useContext } from 'react';
import classes from './EnvironmentCard.module.css';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from "../../../../../../Context/Colors";

const EnvironmentCard = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    return (
        <div className={classes.mainContainer} onClick={props.onClick} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+ colors.border[_mode]}}>
            { props.logo_url 
                ? <div className={classes.illustration} style={{backgroundColor: colors.dashboardEnvs[_mode], backgroundImage: `url('${props.logo_url}')`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}></div>
                : <div className={classes.illustration} style={{backgroundColor: colors.dashboardEnvs[_mode]}}></div>
            }
            <div className={classes.textEnv}>
                <div style={{color: colors.mainText[_mode]}}>
                    <h1 className={classes.environmentText}>
                        {props.loading ?
                            <Skeleton style={{opacity: colors.opacity[_mode]}}/> :
                            props.name
                        }
                    </h1>
                </div>
                <div style={{ marginTop: '10px', color: colors.secondText[_mode]}}>
                    {props.loading ?
                        <Skeleton count={5} height={10} style={{opacity: colors.opacity[_mode]}}/> :
                        <h5 className={classes.descriptionText}>
                            {props.description}
                        </h5>
                    }
                </div>
            </div>
        </div>
    )
}

export default EnvironmentCard