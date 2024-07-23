import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton'
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from "../../../../../../Context/Colors";
import classes from './ResourceItem.module.css';
import '../../../../../../common.css';

const ResourceItem = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    if (props.loading)
        return (
            <div className={classes.mainContainer} onClick={props.onClick}
                style={{
                    backgroundColor: colors.secondBackground[_mode],
                    border: '1px solid ' + colors.border[_mode],
                    ...props.customStyles,
                }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={classes.iconContainer}>
                        <i className={`${props.icon} resourceicon gadientIcon`}></i>
                    </div>
                    <div>
                        <h3 className={classes.resourceNameText} style={{ color: colors.blue[_mode] }}>
                            <Skeleton width={100} style={{ opacity: colors.opacity[_mode] }} />
                        </h3>
                    </div>
                </div>
                <div>
                    <h5 className={classes.countText} style={{ color: colors.mainText[_mode] }}>
                        <Skeleton width={20} style={{ opacity: colors.opacity[_mode] }} />
                    </h5>
                </div>
            </div>
        )
    return (
        <div className={classes.mainContainer} onClick={props.onClick}
            style={{
                backgroundColor: colors.secondBackground[_mode],
                border: '1px solid ' + colors.border[_mode],
                ...props.customStyles,
            }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={classes.iconContainer}>
                    <i className={`${props.icon} resourceicon gadientIcon`}></i>
                </div>
                <div>
                    <h3 className={classes.resourceNameText} style={{ color: colors.blue[_mode] }}>
                        {props.resourceName}
                    </h3>
                </div>
            </div>
            <div>
                <h5 className={classes.countText} style={{ color: colors.mainText[_mode] }}>{props.resourceCount}</h5>
            </div>
        </div>
    )
}

export default ResourceItem