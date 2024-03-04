import React, { useContext } from 'react';
import { Col, Row } from 'reactstrap';
import Skeleton from 'react-loading-skeleton'
import GlobalContext from '../../../../Context/GlobalContext';
import colors from '../../../../Context/Colors';
import classes from './ResourceUsage.module.css';
import { Stack } from '@mui/material';
import Translate from 'react-translate-component';
import { LinearProgress } from '@material-ui/core';

const ResourceUsage = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    if (props.loading)
        return (
            <Stack xs='5' md='3' className={classes.mainContainer} onClick={props.onClick}
                style={{
                    backgroundColor: colors.secondBackground[_mode],
                    border: '1px solid ' + colors.border[_mode],
                    ...props.customStyles,
                }}>
                <Row className={classes.cardHeader}>
                    <Col className={classes.resourceNameContainer}>
                        <div className={classes.iconContainer}>
                            <i className={`${props.icon} ${classes.icon} gadientIcon`}></i>
                        </div>
                        <div>
                            <h3 className={classes.resourceNameText} style={{ color: colors.blue[_mode] }}>
                                <Skeleton width={100} style={{ opacity: colors.opacity[_mode] }} />
                            </h3>
                        </div>
                    </Col>
                </Row>
                <Row className={classes.progressHeader}>
                    <Col style={{ padding: '0px' }}>
                        <Skeleton width={'full'} style={{ opacity: colors.opacity[_mode] }} />
                    </Col>
                    <Col className={classes.leftMostItem}>
                        <Skeleton width={50} style={{ opacity: colors.opacity[_mode] }} />
                    </Col>
                </Row>
                <Row style={{ width: '100%' }}>
                    <Col style={{ padding: '0px' }}>
                        <Skeleton width={'full'} style={{ opacity: colors.opacity[_mode] }} />
                    </Col>
                </Row>
            </Stack>
        )
    return (
        <Stack xs='5' md='3' className={classes.mainContainer} onClick={props.onClick}
            style={{
                backgroundColor: colors.secondBackground[_mode],
                border: '1px solid ' + colors.border[_mode],
                ...props.customStyles,
            }}>
            <Row className={classes.cardHeader}>
                <Col className={classes.resourceNameContainer}>
                    <div className={classes.iconContainer}>
                        <i className={`${props.icon} ${classes.icon} gadientIcon`}></i>
                    </div>
                    <div>
                        <h3 className={classes.resourceNameText} style={{ color: colors.blue[_mode] }}>
                            {props.resourceName}
                        </h3>
                    </div>
                </Col>
            </Row>
            <Row className={classes.progressHeader}>
                <Col style={{ padding: '0px' }}>
                    <span className={classes.progressLabel} style={{ color: colors.mainText[_mode] }}>
                        <Translate content="dashboard.kubernetesDashboardPages.clusterOverview.used" />
                        <span className={classes.progressLabel} style={{ color: colors.mainText[_mode] }}>: {props.usedText}</span>
                    </span>
                </Col>
                <Col className={classes.leftMostItem}>
                    <span className={classes.progressLabel} style={{ color: colors.mainText[_mode] }}>{props.percentage} %</span>
                </Col>
            </Row>

            <Row style={{ width: '100%', marginBottom: '10px'}}>
                <LinearProgress variant="determinate" style={{
                    height: '10px',
                    borderRadius: 10
                }} value={props.percentage} />
            </Row>
        </Stack>
    )
}

export default ResourceUsage;
