import { useContext, useState, useEffect } from "react";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Input, Form, FormGroup, FormFeedback, FormText, Col, Row } from "reactstrap"
import classes from "./AddInstance.module.css"
import axios from "../../../../../utils/axios";
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import GlobalContext from "../../../../../Context/GlobalContext";
import colors from "../../../../../Context/Colors";
import { Fab, OutlinedInput } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import AddIcon from '@mui/icons-material/Add';
import * as queryString from 'query-string';
import Translate from 'react-translate-component';
import ServiceNotAvailable from "../../../../../Components/ServiceNotAvailable/ServiceNotAvailable";
import LoadingSpinner from "../../../../../Components/LoadingSpinner/LoadingSpinner";
import LoadingButton from "../../../../../Components/LoadingButton/LoadingButton";
import MiniCardComponent from "../../../../../Components/Cards/MiniCardComponent/MiniCardComponent";
import SimpleDropdown from "../../../../../Components/Dropdown/SimpleDropdown";
import DropdownComponent from "../../../../../Components/Dropdown/Dropdown";
import DropdownComponentWithoutId from "../../../../../Components/Dropdown/DropdownWithoutItemId";

function AddInstance(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [EnvironmentSelected, setEnvironmentSelected] = useState("")
    const [instanceInfo, setInstanceInfo] = useState({ type: "" })
    const [disabled, setdisabled] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [loading, setLoading] = useState(true)
    const [environments, setEnvironments] = useState([])
    const [projects, setProjects] = useState([])
    const [dns_zones, setDnsZones] = useState([])
    const [prices, setPrices] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [zone, setZone] = useState(null)
    const [selectedDnsZone, setSelectedDnsZone] = useState(null)
    const [instancesTypesAvailability, setInstancesTypesAvailability] = useState([])
    const [serviceNotAvailable, setServiceNotAvailable] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const priceUnit = process.env.REACT_APP_PRICE_UNIT

    useEffect(() => {
        context.setIsGlobal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setZone(null)
    }, [context.region])

    useEffect(() => {
        setdisabled(false)
    }, [instanceInfo])

    useEffect(() => {
        if (zone) {
            axios.get(`/provider/${context.selectedProvider.name}/instance/${context.region.name}/${zone}/pricing`)
                .then(res => {
                    setPrices(res.data.types)
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zone])
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setServiceNotAvailable(false)
            const responseInstanceAvailibility = await axios.get(`/provider/${context.selectedProvider.name}/instance`)
            if (!responseInstanceAvailibility.data.availability.map(a => a.region).includes(context.region.name)) {
                setLoading(false)
                return setServiceNotAvailable(true)
            }
            const availabilityIndex = responseInstanceAvailibility.data.availability.findIndex(a => a.region === context.region.name)
            setInstancesTypesAvailability(responseInstanceAvailibility.data.availability[availabilityIndex].zones)

            const parsedQuery = queryString.parse(location.search);
            const responseProjects = await axios.get(`/project?type=vm`)
            setProjects(responseProjects.data)
            const responseEnvironments = await axios.get("/environment/all")
            setEnvironments(responseEnvironments.data)
            if (parsedQuery.environment)
                setEnvironmentSelected(parsedQuery.environment)
            const responseDnsZones = await axios.get(`/dns_zones`)
            setDnsZones(responseDnsZones.data.zones)
            setLoading(false)
        }
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.region, location])

    const addInstanceHandler = () => {
        setLoadingSubmit(true)
        setdisabled(!instanceInfo.name)
        axios.post(`/instance/${context.selectedProvider.name}/${context.region.name}/${zone}/provision/${EnvironmentSelected}`, { ...instanceInfo, project_id: selectedProject, root_dns_zone: selectedDnsZone })
            .then(response => {
                setLoadingSubmit(false)
                toast.success(context.counterpart('dashboard.addInstance.message.successAdd'))
                navigate(`/instance/${response.data.id}`)
            }).catch(err => {
                setLoadingSubmit(false)
            })
    }

    if (loading)
        return <LoadingSpinner />
    if (serviceNotAvailable)
        return (
            <ServiceNotAvailable region={context.region.name} backLink={'/instances'} />
        )
    return (
        <div>
            <Row>
                <Col>
                    <div className={classes.goBack}>
                        <NavLink to='/instances' className={classes.link}>
                            <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                            <Translate content="dashboard.addInstance.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: "30px", marginBottom: "20px", margin: "10px 0px 0px" }}>
                <Col className={classes.borderCol} style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                    <h5 className={classes.textTitle} style={{color: colors.title[_mode]}}>
                        <Translate content="dashboard.addInstance.mainTitle" />
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.addInstance.inputs.name.title')}>
                        <Form>
                            <FormGroup>
                                <Input className="blackableInput" placeholder={context.counterpart('dashboard.addInstance.inputs.name.placeholder')}
                                    value={instanceInfo.name}
                                    onChange={(e) => setInstanceInfo({ ...instanceInfo, name: e.target.value })} invalid={disabled} />
                                <FormFeedback>
                                    <Translate content="common.message.thisFieldIsRequired" />
                                </FormFeedback>
                                <FormText>
                                    <Translate content="dashboard.addInstance.inputs.name.hint" />
                                </FormText>
                            </FormGroup>
                        </Form>
                    </CardComponent>
                </Col>
            </Row>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.addInstance.inputs.zone.title')}>
                <SimpleDropdown
                    selectedItem={zone}
                    onChange={(e) => { setZone(e.target.value); }}
                    placeholder="dashboard.addInstance.inputs.zone.placeholder"
                    items={instancesTypesAvailability}
                />
            </CardComponent>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.addInstance.inputs.type.title')}
                subtitle={context.counterpart('dashboard.addInstance.inputs.type.subtitle')} >
                <Row horizontal="center" >
                    {prices.map(price =>
                        <MiniCardComponent
                            instancetitle={price.name}
                            value={priceUnit + ' ' + price.price}
                            key={price.name}
                            checked={instanceInfo.type === price.name}
                            onClick={() => setInstanceInfo({ ...instanceInfo, type: price.name })} />
                    )}
                </Row>
            </CardComponent>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.addInstance.inputs.project.title')}
                subtitle={context.counterpart('dashboard.addInstance.inputs.project.subtitle')}>
                <DropdownComponent
                    inputLabelId="demo-multiple-name-label"
                    name="Project"
                    selectLabelId="demo-multiple-name-label"
                    selectId="demo-multiple-name"
                    selectedItem={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    input={<OutlinedInput label="Name" />}
                    items={projects}
                />
                <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                    <Translate content="dashboard.addInstance.inputs.addProject.title" />
                </h5>} placement="right">
                    <Fab color="primary" aria-label="add" onClick={() => navigate("/projects/create")} style={{ transform: 'scale(0.7)', top: '18px' }} >
                        <AddIcon className="whiteIcon"/>
                    </Fab>
                </Tooltip>
            </CardComponent>

            {dns_zones.length > 0 && <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.addInstance.inputs.dns.title')}
                subtitle={context.counterpart('dashboard.addInstance.inputs.dns.subtitle')}>
                <DropdownComponentWithoutId
                    inputLabelId="dns-zone-label"
                    name="DNS"
                    labelId="dns-zone-label"
                    selectId="dns-zone-multiple-name"
                    selectedItem={selectedDnsZone}
                    onChange={(e) => setSelectedDnsZone(e.target.value)}
                    input={<OutlinedInput label="Name" />}
                    items={dns_zones}
                />
            </CardComponent>}

            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.addInstance.inputs.environment.title')}
                subtitle={context.counterpart('dashboard.addInstance.inputs.environment.subtitle')}>
                <Row horizontal="center" >
                    {environments.map((environment) =>
                        context.user.is_admin ?
                            <MiniCardComponent
                                instancetitle={environment.name}
                                key={environment.id}
                                checked={EnvironmentSelected === environment.path}
                                onClick={() => setEnvironmentSelected(environment.path)} />
                            : !environment.is_private && !context.user.is_admin &&
                            <MiniCardComponent
                                instancetitle={environment.name}
                                key={environment.id}
                                checked={EnvironmentSelected === environment.path}
                                onClick={() => setEnvironmentSelected(environment.path)} />
                    )}
                </Row>
            </CardComponent>
            <Row style={{ marginTop: '30px' }}  >
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingButton
                        loading={loadingSubmit}
                        icon="fa-solid fa-floppy-disk"
                        onClick={addInstanceHandler}  >
                        <Translate content="common.button.create" />
                    </LoadingButton>

                </Col>
            </Row>
        </div >
    )
}

export default AddInstance;
