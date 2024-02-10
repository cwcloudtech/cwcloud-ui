
import axios from '../../../../../utils/axios'
import { useContext, useState, useEffect, Fragment } from 'react';
import { Col, Row, Container } from "reactstrap"
import EnvironmentCard from './EnvironmentCard/EnvironmentCard'
import ResourceItem from './ResourceItem/ResourceItem'
import classes from "./UserDashboard.module.css"
import { useNavigate } from 'react-router-dom'
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from "../../../../../Context/Colors";
import * as moment from 'moment';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js';
import DoughnutChart from '../../../../../Components/DoughnutChart/DoughnutChart'
import Translate from 'react-translate-component'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);
const UserDashboard = () => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [environments, setEnvironments] = useState([])
    const [loading, setLoading] = useState(true)
    const [projects, setProjects] = useState(0)
    const [instances, setInstances] = useState(0)
    const [registries, setRegistries] = useState(0)
    const [buckets, setBuckets] = useState(0)
    const [currentConsumptions, setCurrentConsumptions] = useState(null)
    const [currentDataConsumptions, setCurrentDataConsumptions] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        context.setIsGlobal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const responseEnv = await axios.get('/environment/all')
            setEnvironments(responseEnv.data)
            const responseUserResources = await axios.get(`/user/statistics`)
            setProjects(responseUserResources.data.projects)
            setInstances(responseUserResources.data.instances)
            setRegistries(responseUserResources.data.registries)
            setBuckets(responseUserResources.data.buckets)
            const startOfMonth = moment().clone().startOf('month').format('YYYY/MM/DD');
            const endOfMonth = moment().clone().endOf('month').format('YYYY/MM/DD');
            const responseCurrentConsumptions = await axios.get(`/consumption?from=${startOfMonth}&to=${endOfMonth}`)
            setCurrentConsumptions(responseCurrentConsumptions.data)
            setCurrentDataConsumptions(getPieData(responseCurrentConsumptions.data.map(c => c.instance_name),
                responseCurrentConsumptions.data.map(c => c.total_price)))
            setLoading(false)
        }
        fetchData()
    }, [context.region])

    const getPieData = (labels, data) => ({
        labels: labels,
        datasets: [
            {
                label: '# of Votes',
                data: data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.9)',
                    'rgba(255, 206, 86, 0.9)',
                    'rgba(75, 192, 192, 0.9)',
                    'rgba(153, 102, 255, 0.9)',
                    'rgba(255, 159, 64, 0.9)',
                ].slice(0, labels.length),
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ].slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    });

    const getTotalCurrentConsumptions = () => {
        if (!currentConsumptions)
            return 0.00
        let total = 0
        currentConsumptions.forEach(c => {
            total += c.total_price
        })
        return total.toFixed(4)
    }
    return (
        <Container fluid className={classes.container} style={{ padding: "0px 20px 20px 20px" }} >
            <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col>
                    <h1 className={classes.mainTitleText} style={{color: colors.mainText[_mode]}}>
                        <Translate content="dashboard.userDashboard.resourceOverview.title" />
                    </h1>
                </Col>
            </Row>
            <Row>
                <ResourceItem
                    loading={loading}
                    icon='fa-solid fa-microchip'
                    resourceCount={instances}
                    onClick={() => navigate('/instances')}
                    resourceName={context.counterpart('dashboard.userDashboard.resourceOverview.instances')} />
                <ResourceItem
                    loading={loading}
                    icon='fa-solid fa-layer-group'
                    onClick={() => navigate('/projects')}
                    resourceCount={projects}
                    resourceName={context.counterpart('dashboard.userDashboard.resourceOverview.projects')} />
                <ResourceItem
                    loading={loading}
                    icon='fa-solid fa-cube'
                    onClick={() => navigate('/buckets')}
                    resourceCount={buckets}
                    resourceName={context.counterpart('dashboard.userDashboard.resourceOverview.buckets')} />
                <ResourceItem
                    loading={loading}
                    icon='fa-brands fa-docker'
                    onClick={() => navigate('/registries')}
                    resourceCount={registries}
                    resourceName={context.counterpart('dashboard.userDashboard.resourceOverview.registries')} />
            </Row>
            {process.env.REACT_APP_DISABLE_PAYMENT_FEATURE.includes("false") && <Fragment>
                <Row style={{ marginTop: '20px', marginBottom: '10px' }}>
                    <Col>
                        <h1 className={classes.mainTitleText} style={{color: colors.mainText[_mode]}}>
                            <Translate content="dashboard.userDashboard.consumptions.title" />
                        </h1>
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px', color: colors.secondText[_mode]}}>
                    <DoughnutChart title={context.counterpart('dashboard.userDashboard.consumptions.currentConsumptions')} loading={loading} totalConsumptions={getTotalCurrentConsumptions()} data={currentDataConsumptions} />
                </Row>
            </Fragment>}
            <Row style={{ marginTop: '20px', marginBottom: '10px' }}>
                <Col>
                    <h1 className={classes.mainTitleText} style={{color: colors.mainText[_mode]}}>
                        <Translate content="dashboard.userDashboard.availableEnvironments.title" />
                    </h1>
                </Col>
            </Row>
            <Row>
                {!loading ?
                    environments.map(environment => (
                        <EnvironmentCard
                            key={environment.id}
                            name={environment.name}
                            logo_url={environment.logo_url}
                            description={environment.description}
                            onClick={() => navigate(`/instances/create?environment=${environment.path}`)}
                        />
                    ))
                    :
                    [1, 2, 3, 4].map(index => (
                        <EnvironmentCard loading key={index} onClick={() => { }} />
                    ))
                }
            </Row>
        </Container>
    )
}
export default UserDashboard

