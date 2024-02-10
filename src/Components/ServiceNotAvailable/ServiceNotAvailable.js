import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap';
import classes from './ServiceNotAvailable.module.css';
import Translate from 'react-translate-component';
import LoadingButton from '../LoadingButton/LoadingButton';
import GlobalContext from '../../Context/GlobalContext';
import colors from '../../Context/Colors';

const ServiceNotAvailable = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const navigate = useNavigate()
    return (
        <Container className={classes.mainContainer}>
            <Row>
                <Col>
                    <Row style={{ marginTop: '20px' }}>
                        <Col>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className={`fa-solid fa-circle-exclamation ${classes.icon}`} style={{color: colors.blue[_mode]}}></i>
                            </div>
                            <h5 className={classes.mainTitle} style={{color: colors.mainText[_mode]}}>
                                <Translate content="common.service.serviceNotAvailable" />{' '}{props.region}</h5>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LoadingButton variant='outlined' onClick={() => navigate(props.backLink)}>
                                <Translate content="common.button.return" />
                            </LoadingButton>
                        </Col>
                    </Row>
                </Col>

            </Row >
        </Container >
    )
}

export default ServiceNotAvailable