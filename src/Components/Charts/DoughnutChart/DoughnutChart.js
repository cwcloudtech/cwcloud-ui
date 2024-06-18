import React, { useContext } from "react"
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import configs from './configs'
import { Container, Row } from "reactstrap";
import classes from '../Chart.module.css';
import '../../../common.css';
import Skeleton from "react-loading-skeleton";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = (props) => {
    const { options } = configs();
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    options.plugins.legend.labels.color = colors.secondText[_mode];
    const priceUnit = process.env.REACT_APP_PRICE_UNIT === null ? " " : process.env.REACT_APP_PRICE_UNIT;
    return (
        <Container className={classes.mainContainer} fluid>
            <Row>
                <div style={{width: "25%", margin:"5px"}}>
                    <h2 className={classes.chartTitle} style={{color: colors.title[_mode]}}>{props.title}</h2>
                    <h5 className={classes.TotalConsumptionsText} style={{color: colors.secondText[_mode], marginTop: "10px"}}>{`Total: ${props.totalConsumptions === null ? "" : props.totalConsumptions} ${priceUnit}`}</h5>
                </div>
                {!props.loading ?
                    <div style={{width: "50%", margin:"5px", textAlign: "right"}}>
                        <Doughnut data={props.data} options={options} />
                    </div>
                    :
                    <div style={{width: "50%", margin:"5px", textAlign: "right"}}>
                        <Skeleton height={150} />
                    </div>}
            </Row>
        </Container>
    );
}

export default DoughnutChart;
