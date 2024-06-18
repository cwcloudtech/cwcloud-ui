import {useState, useRef, useContext, useEffect} from 'react';
import { Container } from 'reactstrap';
import classes from "./InstanceOverView.module.css";
import '../../../../../common.css';
import { Row, Col, Button } from "reactstrap";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import srcimage from '../../../../../utils/regions';
import cloudResourceName from '../../../../../utils/cloudResourceName';
import axios from "../../../../../utils/axios";
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
import ProtectionModal from '../../../../../Components/Modal/ProtectionModal';
import counterpart from 'counterpart';
import CustomCopyIcon from '../../../../../Components/CustomIcon/CustomCopyIcon';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

function InstanceOverview() {
    const { instanceId } = useParams()
    const location = useLocation()
    const currentPath = location.pathname
    const is_admin = currentPath.includes('admin')
    const nextPath = is_admin ? '/admin/instances' : '/instances'
    const [instance, setInstance] = useState([])
    const [loading, setloading] = useState(true)
    // eslint-disable-next-line no-unused-vars
    const [loadingRefresh, setloadingRefresh] = useState(false)
    const [loadingRequest, setloadingRequest] = useState(false)
    const [showConfirmPowerModal, setshowConfirmPowerModal] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showConfirmRebootModal, setshowConfirmRebootModal] = useState(false)
    const [showProtectionModal, setShowProtectionModal] = useState(false)
    const [protectionAction, setProtectionAction] = useState('')
    const [instanceInfo, setinstanceInfo] = useState([])
    const fetchInstanceInterval = useRef(null)
    const [isInstanceStarting, setIsInstanceStarting] = useState(false)
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const navigate = useNavigate()
    // eslint-disable-next-line no-unused-vars
    const localProvider = localStorage.getItem('provider')

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
    const copyPublicIp = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(instance.ip_address);
        toast.success(counterpart('dashboard.function.message.successCopyIp'));
    };

    const onPreUpdateInstanceProtection = (action) => {
        setShowProtectionModal(true)
        setProtectionAction(action)
    }
    const onPowerHandler = () => {
        const updateStatus = instance.status === "active" ? "Power Off" : "Power On"
        const payload = {
            status: updateStatus === 'active' ? 'poweroff' : 'poweron',
            type: instance.type
        }
        setloadingRequest(true)
        var api_url = is_admin
            ? `/admin/instance/${instance.id}`
            : `/instance/${context.selectedProvider.name}/${context.region.name}/${instance.id}`
        axios.patch(api_url, payload)
        .then(response => {
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
            status: "reboot"
        }
        var api_url = is_admin
            ? `/admin/instance/${instance.id}`
            : `/instance/${context.selectedProvider.name}/${context.region.name}/${instance.id}`
        setloadingRequest(true)
        axios.patch(api_url, payload).then(response => {
            toast.success(context.counterpart('dashboard.instanceOverview.message.successUpdate'))
            setshowConfirmRebootModal(false)
            setloadingRequest(false)
        }).catch(err => {
            setshowConfirmRebootModal(false)
            setloadingRequest(false)
            console.log(err)
        })
    }

    // const refreshInstanceStateHandler = () => {
    //     setloadingRefresh(true)
    //     axios.post(`/admin/instance/refresh/${instance.id}`).then(response => {
    //         toast.success(context.counterpart('dashboard.instanceOverview.message.successRefresh'))
    //         setloadingRefresh(false)
    //     }).catch(err => {
    //         setloadingRefresh(false)
    //     })
    // }

    const onDeleteHandler = () => {
        setloadingRequest(true)
        var api_url = is_admin
            ? `/admin/instance/${instance.id}`
            : `/instance/${context.selectedProvider.name}/${context.region.name}/${instance.id}`
        axios.delete(api_url).then(response => {
            toast.success(context.counterpart('dashboard.instanceOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
            var nextPath = is_admin
                ? '/admin/instances'
                : '/instances'
            navigate(nextPath)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
            console.log(err)
        })
    }

    const fetchInstance = () => {
        var api_url = is_admin
            ? `/admin/instance/${instanceId}`
            : `/instance/${context.selectedProvider.name}/${context.region.name}/${instanceId}`
        axios.get(api_url)
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
                setloading(false)
                clearInterval(fetchInstanceInterval.current)
            })
    }

    const onUpdateInstanceProtectionHandler = () => {
        var is_protected = protectionAction === 'protect' ? true : false
        const payload = {
            is_protected: is_protected
        }
        setloadingRequest(true)
        axios.patch(`/instance/${context.selectedProvider.name}/${context.region.name}/${instance.id}`, payload).then(response => {
            toast.success(context.counterpart('dashboard.instanceOverview.message.successUpdate'))
            setShowProtectionModal(false)
            setloadingRequest(false)
            instance.is_protected === true ? setInstance({ ...instance, is_protected: false }) : setInstance({ ...instance, is_protected: true })
        }).catch(err => {
            setShowProtectionModal(false)
            setloadingRequest(false)
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
            var nextPath = is_admin
                ? '/admin/instances'
                : '/instances'
            navigate(nextPath)
            clearInterval(fetchInstanceInterval.current)
        } else {
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
            <ProtectionModal isOpen={showProtectionModal} toggle={() => setShowProtectionModal(!showProtectionModal)} onUpdateInstanceProtection={onUpdateInstanceProtectionHandler} name={instance.name} loading={loadingRequest} action={protectionAction} />
            <div className="goBack">
                <NavLink to={nextPath} className="link" style={{color: colors.blue[_mode]}}>
                    <i className="fa-solid fa-arrow-left iconStyle" style={{color: colors.blue[_mode]}}></i>
                    <Translate content="dashboard.instanceOverview.back" />
                </NavLink>
            </div>
            <div className="row">
                <Row>
                    <Col className="colinline" >
                        {instance.status === 'starting' ?
                            <i className="fa-solid fa-circle toggleStarting"></i>
                            :
                            instance.status === 'active' ?
                                <i className="fa-solid fa-circle active"></i>
                                :
                                <i className="fa-solid fa-circle inactive"></i>
                        }
                        <i className="fa-solid fa-microchip iconProcessStyle" style={{color: colors.blue[_mode]}}></i>
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
                         <Col style={{ paddingRight: "30px"}} className="colElement">
                            {
                                instance.is_protected
                                    ?
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.unprotect")} placement="bottom">
                                        <LockOutlinedIcon className= "successBtn toggleOff" style={{ fontSize: "30px"}} onClick={() => onPreUpdateInstanceProtection("unprotect")} />
                                    </Tooltip>
                                    :
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.protect")} placement="bottom">
                                        <LockOpenOutlinedIcon className="toggleOn" style={{ fontSize: "30px"}} onClick={() => onPreUpdateInstanceProtection("protect")} />
                                    </Tooltip>
                            }
                            {instance.status === "active"
                                ?
                                <div className="colElement">
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.open")} placement="bottom">
                                        <a href={`https://${cloudResourceName(instance)}.${instance.path}.${instance.root_dns_zone}`} target="_blank" rel='noreferrer' style={{ textDecoration: "none", color: "inherit" }}>
                                            <OpenInBrowserOutlinedIcon className='orangeBtn' style={{ fontSize: "30px", marginLeft: "10px" }} />
                                        </a>
                                    </Tooltip>
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.reboot")} placement="bottom">
                                        <RestartAltOutlinedIcon style={{ fontSize: "30px"}} className={classes.reboot} onClick={onPreRebootHandler} />
                                    </Tooltip>
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.powerOff")} placement="bottom">
                                        <PowerSettingsNewOutlinedIcon style={{ fontSize: "30px"}} className="successBtn toggleOn" onClick={onPreUpdateStatusHandler} />
                                    </Tooltip>
                                </div>
                                :
                                <div>
                                    <Tooltip title={counterpart("dashboard.instanceOverview.buttons.powerOn")} placement="bottom">
                                        <PowerSettingsNewOutlinedIcon style={{ fontSize: "30px"}} className="dangerBtn toggleOff" onClick={onPreUpdateStatusHandler} />
                                    </Tooltip>
                                </div>
                            }
                        </Col>
                    }
                </Row>
            </div>
            <Row className="blocMargin">
                <h2 className="titleStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.title" /></h2>
                <Container style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="3" className="row">
                            <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.status" />:</h5>
                            <div style={{ display: "flex" }}>
                                {
                                    instance.status === "active" ?
                                        <i className="fa-solid fa-circle active"></i> :
                                        instance.status === 'starting' ?
                                            <i className="fa-solid fa-circle toggleStarting"></i>
                                            :
                                            <i className="fa-solid fa-circle powredOff"></i>
                                }
                                {loading ? <h6 className="colInlineValue"><Skeleton style={{opacity: colors.opacity[_mode]}} width={100} /></h6> :
                                    <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode]}}>{instance.status}</h6>
                                }
                            </div>
                        </Col>
                        <Col xs="12" md="3" className="row">
                            <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.environment" />:</h5>
                            <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode]}}>{
                                !loading ? instance.environment
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}} />
                            }</h6>
                        </Col>
                        <Col xs="12" md="3" className="row">
                            <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.type" />:</h5>
                            <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode]}}>{
                                !loading ?
                                    instance.type
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}} />
                            }</h6>
                        </Col>
                        <Col xs="12" md="3" className="row">
                            <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.availabilityZone" />:</h5>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                {!loading ? <img src={srcimage(context.region.name)} className="imgstyle" alt="region"></img> : <Skeleton style={{opacity: colors.opacity[_mode]}} circle height={30} width={30} />}
                                <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode]}}>{
                                    !loading ? context.region.name
                                        :
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                }</h6>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className="separator" ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="3" className="row">
                            <div className="colinline">
                                <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.cores" />: </h5>
                                <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode], paddingTop: "10px"}}>{!loading ? instanceInfo.core : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div>
                        </Col>
                        <Col xs="12" md="3" className="row">
                            <div className="colinline">
                                <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.ram" />:</h5>
                                <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode], paddingTop: "10px"}}>{!loading ? instanceInfo.ram : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div>
                        </Col>
                        <Col xs="12" md="3" className="row">
                            <div className="colinline">
                                <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.disk" />:</h5>
                                <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode], paddingTop: "10px"}}>{!loading ? instanceInfo.disk : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div >
                        </Col>
                        <Col xs="12" md="3" className="row">
                            <div className="colinline">
                                <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.bandwidth" />:</h5>
                                <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode], paddingTop: "10px"}}>{!loading ? instanceInfo.bandwidth : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className="separator" ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="6" className="row">
                            <div className="colinline">
                                <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.volumes" />:</h5>
                                <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode], paddingTop: "10px"}}>
                                    {!loading ? 1
                                        :
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                    }
                                </h6>
                            </div>
                        </Col>
                        <Col xs="12" md="6" className="row">
                            <div className="colinline">
                                <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.localStorage" />:</h5>
                                <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode], paddingTop: "10px"}}>{!loading ? instanceInfo.localstorage : <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />}</h6>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className="separator" ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="12" className="row">
                            <div className="colinline" style={{ display: 'flex', alignItems: 'center' }}>
                                <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.publicIp" />:</h5>
                                {!loading ?
                                    instance.ip_address !== "Null" ?
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <h6 className="colInlineValue" style={{color: colors.smallTitle[_mode], marginRight: '10px'}}>{instance.ip_address}</h6>
                                            <CustomCopyIcon onClick={copyPublicIp} title={counterpart("dashboard.function.actions.copyPublicIp")} />
                                        </div>    
                                        :
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                    :
                                    <h6 className="colInlineValue" >
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                    </h6>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className="separator" ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="12" className="row">
                            <Row>
                                <Col xs="auto" md="auto">
                                    <h5 className="textStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.project" />:</h5>
                                </Col>
                                <Col className="colinline pt-2" xs="auto" md="auto">
                                    <h6 className="colInlineValueSpec" style={{color: colors.smallTitle[_mode]}}>{instance.gitlab_project_url}</h6>
                                    {!loading ? <Link to={is_admin ? `/admin/project/${instance.project.id}` : `/project/${instance.project.id}` }>
                                        {instance.project.name}
                                    </Link>
                                        :
                                        <h6 className="colInlineValueSpec">
                                            <Skeleton style={{opacity: colors.opacity[_mode]}} width={100} />
                                        </h6>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Row >
            {!loading && <Row className="blocMargin">
                <h2 className="titleStyle" style={{color: colors.mainText[_mode]}}><Translate content="dashboard.instanceOverview.fields.deleteTitle" /></h2>
                <Container style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" sm="12" md="9" className="rowD">
                            <h6 className="test" style={{color: colors.mainText[_mode]}}>
                                <span style={{ color: "#DF4D7A", fontWeight: "bold" }}><Translate content="dashboard.instanceOverview.fields.warning" />! </span>
                                <Translate content="dashboard.instanceOverview.fields.deleteDescription" />
                            </h6>
                        </Col>
                        <Col xs="12" sm="12" md="3" className="rowD">
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