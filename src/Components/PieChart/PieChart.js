import React, { useContext } from 'react';
import { Pie } from "react-chartjs-2";
import { Col, Container, Row } from "reactstrap";
import classes from './PieChart.module.css';
import configs from './configs'
import Skeleton from "react-loading-skeleton";
import GlobalContext from '../../Context/GlobalContext';
import colors from '../../Context/Colors';

const PieChart = (props) => {
    const { options } = configs();
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const priceUnit = process.env.REACT_APP_PRICE_UNIT === null ? " " : process.env.REACT_APP_PRICE_UNIT;
    options.plugins.legend.labels.color = colors.secondText[_mode];
    
    return (
        <Container className={classes.mainContainer} fluid>
            <Row>
                <Col>
                    <h5 className={classes.chartTitle} style={{color: colors.secondText[_mode]}}>{props.title}</h5>
                </Col>
            </Row>
            <Row>
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                        <h5 className={classes.TotalConsumptionsText} style={{color: colors.title[_mode]}}>{`Total: ${props.totalConsumptions === null ? "" : props.totalConsumptions} ${priceUnit}`}</h5>
                    </div>
                </Col>
                {!props.loading ?
                    <Col>
                        <Pie data={props.data} options={options} />
                    </Col>
                    :
                    <Col>
                        <Skeleton height={150} />
                    </Col>}
            </Row>
        </Container>
    )
}

export default PieChart;
