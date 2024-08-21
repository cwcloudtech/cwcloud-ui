import React, { useContext } from "react"
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import configs from './configs'
import { Container, Row, Col } from "reactstrap";
import classes from '../Chart.module.css';
import '../../../common.css';
import Skeleton from "react-loading-skeleton";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import CardComponent from "../../Cards/CardComponent/CardComponent";
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = (props) => {
    const { options } = configs();
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    options.plugins.legend.labels.color = colors.secondText[_mode];
    const priceUnit = process.env.REACT_APP_PRICE_UNIT === null ? " " : process.env.REACT_APP_PRICE_UNIT;
    return (
        <Container className={classes.mainContainer} fluid>
            <CardComponent 
                title={context.counterpart("dashboard.userDashboard.consumptions.currentConsumptions")} 
                style={{width: "100%", margin:"15px"}}
            >
                <Row>
                    <Col md="12">
                        <ul>
                            <li style={{color: colors.secondText[_mode]}}>{`Total: ${props.totalConsumptions === null ? "" : props.totalConsumptions} ${priceUnit}`}</li>
                        </ul>
                    </Col>
                    <Col md="9">
                        {!props.loading ?
                            <div style={{width: "140%", height: "250px"}}>
                                <Doughnut data={props.data} options={options} />
                            </div>
                            :
                            <div style={{width: "50%", margin:"5px"}}>
                                <Skeleton height={150} />
                            </div>}
                    </Col>
                </Row>
            </CardComponent>
        </Container>
    );
}

export default DoughnutChart;
