import { useState, useContext, useEffect, useRef } from 'react';
import { Container } from 'reactstrap';
import classes from "./InstanceOverView.module.css";
import { Row, Col, Button } from "reactstrap";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../../../../../utils/axios";
import srcimage from '../../../../../utils/regions';
import cloudResourceName from '../../../../../utils/cloudResourceName';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';
import DeleteModal from '../../../../../Components/Modal/DeleteModal';
import GlobalContext from '../../../../../Context/GlobalContext';
import PowerModal from '../../../../../Components/Modal/PowerModal';
import RebootModal from '../../../../../Components/Modal/RebootModal';
import Skeleton from 'react-loading-skeleton';
import Translate from 'react-translate-component';
import colors from '../../../../../Context/Colors';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import OpenInBrowserOutlinedIcon from '@mui/icons-material/OpenInBrowserOutlined';
import counterpart from 'counterpart';

function InstanceOverview() {
    const { instanceId } = useParams()
    const [instance, setInstance] = useState({})
    const [loading, setloading] = useState(true)
    const [loadingRequest, setloadingRequest] = useState(false)
    const [showConfirmPowerModal, setshowConfirmPowerModal] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showConfirmRebootModal, setshowConfirmRebootModal] = useState(false)
    const [instanceInfo, setinstanceInfo] = useState([])
    const fetchInstanceInterval = useRef(null)
    const [isInstanceStarting, setIsInstanceStarting] = useState(false)
    const context = useContext(GlobalContext)
    const navigate = useNavigate()
    const _mode = context.mode;

    useEffect(() => {
        context.setIsGlobal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const onPreRebootHandler = () => {
        setshowConfirmRebootModal(true)
    }
    const onPreUpdateStatusHandler = () => {
        setshowConfirmPowerModal(true)
    }
    const onPreDeleteHandler = () => {
        setShowConfirmDeleteModal(true)
    }
    const onPowerHandler = () => {
        const payload = {
            status: instance.status === 'active' ? 'poweroff' : 'poweron'
        }
        setloadingRequest(true)
        axios.patch(`/instance/${context.selectedProvider.name}/${context.region.name}/${instance.id}`, payload).then(response => {
            setloadingRequest(false)
            toast.success(context.counterpart('dashboard.instanceOverview.message.successUpdate'))
            setshowConfirmPowerModal(false)
            instance.status === "active" ? setInstance({ ...instance, status: "poweredoff" }) : setInstance({ ...instance, status: "active" })
        }).catch(err => {
            setloadingRequest(false)
            setshowConfirmPowerModal(false)
        })
    }
    const onRebootHandler = () => {
        const payload = {
            status: "reboot",
        }
        setloadingRequest(true)
        axios.patch(`/instance/${context.selectedProvider.name}/${context.region.name}/${instance.id}`, payload).then(response => {
            toast.success(context.counterpart('dashboard.instanceOverview.message.successUpdate'))
            setshowConfirmRebootModal(false)
            setloadingRequest(false)
        }).catch(err => {
            setshowConfirmRebootModal(false)
            setloadingRequest(false)
        })
    }
    const onDeleteHandler = () => {
        setloadingRequest(true)
        axios.delete(`/instance/${context.selectedProvider.name}/${context.region.name}/${instance.id}`).then(response => {
            toast.success(context.counterpart('dashboard.instanceOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
            navigate('/instances')
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
        })
    }
    const fetchInstance = () => {
        axios.get(`/instance/${context.selectedProvider.name}/${context.region.name}/${instanceId}`)
            .then(res => {
                axios.get(`/provider/${context.selectedProvider.name}/instance/${context.region.name}/${res.data.zone}/config`)
                    .then(configs => {
                        const infos = configs.data.instances.filter(el => el.type === res.data.type)
                        setinstanceInfo(infos[0])
                        setInstance(res.data)
                        setIsInstanceStarting(res.data.status === 'starting')
                        setloading(false)
                    })
            }).catch(err => {
                navigate('/instances')
                clearInterval(fetchInstanceInterval.current)
            })
    }
    useEffect(() => {
        if (fetchInstanceInterval.current)
            clearInterval(fetchInstanceInterval.current)
        if (isInstanceStarting) {
            fetchInstanceInterval.current = setInterval(() => {
                fetchInstance()
            }, 5000);
        } else if (showConfirmDeleteModal) {
            navigate('/instances')
            clearInterval(fetchInstanceInterval.current)
        }
        else {
            fetchInstance()
        }

        return () => {
            clearInterval(fetchInstanceInterval.current)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInstanceStarting])

    return (
        <div>
            <PowerModal isOpen={showConfirmPowerModal} toggle={() => setshowConfirmPowerModal(!showConfirmPowerModal)} onPower={onPowerHandler} name={instance.name} loading={loadingRequest} status={instance.status} />
            <RebootModal isOpen={showConfirmRebootModal} toggle={() => setshowConfirmRebootModal(!showConfirmRebootModal)} onReboot={onRebootHandler} name={instance.name} loading={loadingRequest} />
            <DeleteModal resourceName="instance" isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={instance.name} loading={loadingRequest} />
            <div className={classes.goBack} >
                <NavLink to='/instances' className={classes.link} style={{color: colors.blue[_mode]}}>
                    <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")} style={{color: colors.blue[_mode]}}></i>
                    <Translate content="dashboard.instanceOverview.back" />
                </NavLink>
            </div>
            <div className={classes.row}>
                <Row>
                    <Col className={classes.colinline} >
                        {instance.status === 'starting' ?
                            <i className={["fa-solid fa-circle", classes.toggleStarting].join(' ')}></i>
                            :
                            instance.status === 'active' ?
                                <i className={["fa-solid fa-circle", classes.active].join(' ')}></i>
                                :
                                <i className={["fa-solid fa-circle", classes.inactive].join(' ')}></i>
                        }
                        <i className={["fa-solid fa-microchip", classes.iconProcessStyle].join(' ')} style={{color: colors.blue[_mode]}}></i>
                        <div style={{ marginLeft: "20px" }}>
                            <h6 style={{color: colors.mainText[_mode]}}>{
                                !loading ? instance.name
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}} width={150} />
                            }</h6>
                            <h6 style={{ color: "#C3BCC3", fontWeight: "400" }}>{
                                !loading ?
                                    instance.type
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                            }</h6>
                        </div>
                    </Col>
                    {!loading && 
                        <Col className={classes.colElement}>
                            {instance.status === "active"
                                ?
                                <div className={classes.colElement}>
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.open")} placement="bottom">
                                        <a href={`https://${cloudResourceName(instance)}.${instance.path}.${instance.root_dns_zone}`} target="_blank" rel='noreferrer' style={{ textDecoration: "none", color: "inherit" }}>
                                            <OpenInBrowserOutlinedIcon className='orangeBtn' style={{ fontSize: "30px", marginLeft: "10px" }} />
                                        </a>
                                    </Tooltip>
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.reboot")} placement="bottom">
                                        <RestartAltOutlinedIcon style={{ fontSize: "30px"}} className={classes.reboot} onClick={onPreRebootHandler} />
                                    </Tooltip>
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.powerOff")} placement="bottom">
                                        <PowerSettingsNewOutlinedIcon style={{ fontSize: "30px"}} className={["successBtn", classes.toggleOn].join(' ')} onClick={onPreUpdateStatusHandler} />
                                    </Tooltip>
                                </div>
                                :
                                <div>
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.powerOn")} placement="bottom">
                                        <PowerSettingsNewOutlinedIcon style={{ fontSize: "30px"}} className={["dangerBtn", classes.toggleOff].join(' ')} onClick={onPreUpdateStatusHandler} />
                                    </Tooltip>
                                </div>
                            }
                        </Col>
                    }
                </Row>
            </div>
            <Row className={classes.blocMargin}>
                <h2 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.title" /></h2>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="3" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.status" />:</h5>
                            <div style={{ display: "flex" }}>
                                {
                                    instance.status === "active" ?
                                        <i className={["fa-solid fa-circle", classes.active].join(' ')}></i> :
                                        instance.status === 'starting' ?
                                            <i className={["fa-solid fa-circle", classes.toggleStarting].join(' ')}></i>
                                            :
                                            <i className={["fa-solid fa-circle", classes.powredOff].join(' ')}></i>
                                }
                                {loading ? <h6 className={classes.colInlineValue}><Skeleton style={{opacity: colors.opacity[_mode]}} width={100} /></h6> :
                                    <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{instance.status}</h6>
                                }
                            </div>
                        </Col>
                        <Col xs="12" md="3" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.environment" />:</h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ? instance.environment
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}} />
                            }</h6>
                        </Col>
                        <Col xs="12" md="3" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.type" />:</h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ?
                                    instance.type
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}} />
                            }</h6>
                        </Col>
                        <Col xs="12" md="3" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.availabilityZone" />:</h5>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                {!loading ? <img src={srcimage(context.region.name)} className={classes.imgstyle} alt="region"></img> : <Skeleton style={{opacity: colors.opacity[_mode]}} circle height={30} width={30} />}
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                    !loading ? context.region.name
                                        :
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                }</h6>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className={classes.separator} ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="3" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.cores" />: </h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? instanceInfo.core : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div>
                        </Col>
                        <Col xs="12" md="3" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.ram" />:</h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? instanceInfo.ram : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div>
                        </Col>
                        <Col xs="12" md="3" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.disk" />:</h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? instanceInfo.disk : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div >
                        </Col>
                        <Col xs="12" md="3" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.bandwidth" />:</h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? instanceInfo.bandwidth : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className={classes.separator} ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="6" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.volumes" />:</h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                    {!loading ? 1
                                        :
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                    }
                                </h6>
                            </div>
                        </Col>
                        <Col xs="12" md="6" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.localStorage" />:</h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? instanceInfo.localstorage : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className={classes.separator} ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="12" className={classes.row}>
                            <div className={classes.colinline} >
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.publicIp" />:</h5>
                                {!loading ?
                                    instance.ip_address !== "Null" ?
                                        <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{instance.ip_address}</h6>
                                        :
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                    :
                                    <h6 className={classes.colInlineValue} >
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                    </h6>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className={classes.separator} ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="12" className={classes.row}>
                            <Row>
                                <Col xs="auto" md="auto">
                                    <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.project" />:</h5>
                                </Col>
                                <Col className={classes.colinline} xs="auto" md="auto">
                                    <h6 className={classes.colInlineValueSpec} style={{color: colors.smallTitle[_mode]}}>{instance.gitlab_project_url}</h6>
                                    {!loading ? <Link to={`/project/${instance.project.id}`}>
                                        {instance.project.name}
                                    </Link>
                                        :
                                        <h6 className={classes.colInlineValueSpec}>
                                            <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                        </h6>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Row >
            {!loading && instance.user_id === context.user.id && <Row className={classes.blocMargin}>
                <h2 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.deleteTitle" /></h2>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" sm="12" md="9" className={classes.rowD}>
                            <h6 className={classes.test} style={{color: colors.mainText[_mode]}}>
                                <span style={{ color: "#DF4D7A", fontWeight: "bold" }}><Translate content="dashboard.instanceOverview.fields.warning" />! </span>
                                <Translate content="dashboard.instanceOverview.fields.deleteDescription" />
                            </h6>
                        </Col>
                        <Col xs="12" sm="12" md="3" className={classes.rowD}>
                            <Button color="danger" outline style={{ display: "flex", justifyContent: "center", alignItems: "center", whiteSpace: "nowrap", height: "100%" }} onClick={onPreDeleteHandler}>
                                <i className="fa-solid fa-trash-can" style={{ marginRight: "8px" }}></i>
                                <h6 style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0" }}>
                                    <Translate content="dashboard.instanceOverview.buttons.delete" />
                                </h6>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Row>}
        </div >
    )
}

export default InstanceOverview