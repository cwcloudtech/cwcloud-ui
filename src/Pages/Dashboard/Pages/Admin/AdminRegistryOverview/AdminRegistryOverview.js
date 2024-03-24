import { useContext, useEffect, useRef, useState, Fragment } from 'react';
import { Container, Input } from 'reactstrap';
import classes from "./AdminRegistryOverview.module.css";
import { Row, Col, Button } from "reactstrap";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../../../../../utils/axios";
import srcimage from '../../../../../utils/regions';
import cloudResourceName from '../../../../../utils/cloudResourceName';
import { toast } from 'react-toastify';
import GlobalContext from '../../../../../Context/GlobalContext';
import Skeleton from 'react-loading-skeleton';
import Translate from 'react-translate-component';
import DeleteModal from '../../../../../Components/Modal/DeleteModal';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import colors from '../../../../../Context/Colors';
import TransferRegistryModal from './TransferRegistryModal/TransferRegistryModal'
import sliceIfNeeded from '../../../../../utils/stringSlice';

function AdminRegistryOverview() {
    const { registryId } = useParams()
    const [loading, setloading] = useState(true)
    const [loadingRequest, setloadingRequest] = useState(false)
    const [loadingUpdate, setloadingUpdate] = useState(false)
    const [loadingRefresh, setloadingRefresh] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [registry, setRegistry] = useState([])
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const navigate = useNavigate()
    const fetchRegistryInterval = useRef(null)
    const [showSecretKey, setShowSecretKey] = useState(false)
    const [showAccessKey, setShowAccessKey] = useState(false)
    const [users, setUsers] = useState([])
    const [showTransferModal, setShowTransferModal] = useState(false)
    const [loadingTransfer, setLoadingTransfer] = useState(false)

    useEffect(() => {
        context.setIsGlobal(false)
        axios.get(`/admin/registry/${registryId}`)
            .then(res => {
                setRegistry(res.data)
                axios.get("/admin/user/all")
                    .then(res => {
                        setUsers(res.data.result)
                        setloading(false)
                    })
            }).catch(err => {
                navigate('/admin/registries')
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const onPreDeleteHandler = () => {
        setShowConfirmDeleteModal(true)
    }

    const onPreTransferHandler = () => {
        setShowTransferModal(true)
    }

    const onTransferHandler = (userEmail) => {
        setLoadingTransfer(true)
        axios.patch(`/admin/registry/${registry.id}`, { email: userEmail }).then(response => {
            toast.success("successfully transfered registry")
            setShowTransferModal(false)
            setLoadingTransfer(false)
            navigate('/registries')

        }).catch(err => {

            setShowTransferModal(false)
            setLoadingTransfer(false)
        })
    }

    const onDeleteHandler = () => {
        setloadingRequest(true)
        axios.delete(`/admin/registry/${registry.id}`).then(response => {
            toast.success(context.counterpart('dashboard.registryOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
            navigate('/admin/registries')
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
        })
    }

    const updateRegistryCredentialsHandler = () => {
        setloadingUpdate(true)
        axios.patch(`/admin/registry/${registry.id}`, { update_creds: true }).then(response => {
            toast.success(context.counterpart('dashboard.registryOverview.message.successUpdate'))
            fetchRegistry()
            setloadingUpdate(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setloadingUpdate(false)
        })
    }

    const fetchRegistry = () => {
        axios.get(`/admin/registry/${registryId}`)
            .then(res => {
                setRegistry(res.data)
                setloading(false)
            }).catch(err => {
                setloading(false)
                clearInterval(fetchRegistryInterval.current)
            })
    }

    const refreshRegistryStateHandler = () => {
        setloadingRefresh(true)
        axios.post(`/admin/registry/refresh/${registry.id}`).then(response => {
            toast.success(context.counterpart('dashboard.registryOverview.message.successRefresh'))
            setloadingRefresh(false)
        }).catch(err => {
            setloadingRefresh(false)
        })
    }

    const [copiedAccessKey, setCopiedAccessKey] = useState(false);
    const [copiedSecretKey, setCopiedSecretKey] = useState(false);

    const handleCopyClick = (key, keyType) => {
        navigator.clipboard.writeText(key);
        if (keyType === "access_key") {
            setCopiedAccessKey(true);
            setTimeout(() => setCopiedAccessKey(false), 1500);
        } else if (keyType === "secret_key") {
            setCopiedSecretKey(true);
            setTimeout(() => setCopiedSecretKey(false), 1500);
        }
    };

    useEffect(() => {
        if (fetchRegistryInterval.current)
            clearInterval(fetchRegistryInterval.current)
        if (registry && registry.status === "starting") {
            fetchRegistryInterval.current = setInterval(() => {
                fetchRegistry()
            }, 5000);
        } else {
            fetchRegistry()
        }
        return () => {
            clearInterval(fetchRegistryInterval.current)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registry.status])

    return (
        <div>
            <TransferRegistryModal
                resourceName="registry"
                users={users}
                isOpen={showTransferModal}
                toggle={() => setShowTransferModal(!showTransferModal)}
                onSave={onTransferHandler} loading={loadingTransfer} />
            <DeleteModal resourceName="registry" isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={registry.name} loading={loadingRequest} />
            <div className={classes.goBack} >
                <NavLink to='/admin/registries' className={classes.link} style={{color: colors.blue[_mode]}}>
                    <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")} style={{color: colors.blue[_mode]}}></i>
                    <Translate content="dashboard.registryOverview.back" />
                </NavLink>
            </div>
            <div className={classes.colElement}>
                <LoadingButton loading={loadingRefresh} icon="fa-solid fa-rotate" onClick={refreshRegistryStateHandler} outline style={{ width: "150px", height: "25px", padding: "0", margin: "0", marginRight: '10px' }} className="blueBtn">
                    <Translate content="dashboard.registryOverview.buttons.refresh" />
                </LoadingButton>
            </div>
            <div className={classes.row}>
                <Row>
                    <Col className={classes.colinline} >
                        {registry.status === 'starting' ?
                            <i className={["fa-solid fa-circle", classes.toggleStarting].join(' ')}></i>
                            :
                            registry.status === 'active' ?
                                <i className={["fa-solid fa-circle", classes.active].join(' ')}></i>
                                :
                                <i className={["fa-solid fa-circle", classes.inactive].join(' ')}></i>
                        }
                        <i className={["fa-brands fa-docker", classes.iconProcessStyle].join(' ')} style={{color: colors.blue[_mode]}}></i>
                        <div style={{ marginLeft: "20px" }}>
                            <h6 style={{color: colors.mainText[_mode]}}>{
                                !loading ? registry.name
                                    :
                                    <Skeleton width={150} style={{opacity: colors.opacity[_mode]}} />
                            }</h6>
                            <h6 style={{ color: "#C3BCC3", fontWeight: "400" }}>{
                                !loading ?
                                    registry.type
                                    :
                                    <Skeleton width={100} style={{opacity: colors.opacity[_mode]}} />
                            }</h6>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row className={classes.blocMargin}>
            <h2 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.registryOverview.fields.title" /></h2>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.registryOverview.fields.status" />:</h5>
                            <div style={{ display: "flex" }}>
                                {
                                    registry.status === "active" ?
                                        <i className={["fa-solid fa-circle", classes.active].join(' ')}></i> :
                                        registry.status === 'starting' ?
                                            <i className={["fa-solid fa-circle", classes.toggleStarting].join(' ')}></i>
                                            :
                                            <i className={["fa-solid fa-circle", classes.powredOff].join(' ')}></i>
                                }
                                {loading ? <h6 className={classes.colInlineValue}><Skeleton width={100} style={{opacity: colors.opacity[_mode]}} /></h6> :
                                    <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{registry.status}</h6>
                                }
                            </div>
                        </Col>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.registryOverview.fields.type" />:</h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ?
                                    registry.type
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}} />
                            }</h6>
                        </Col>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.registryOverview.fields.region" />:</h5>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                {!loading ? <img src={srcimage(context.region.name)} className={classes.imgstyle} alt="region"></img> : <Skeleton circle height={30} width={30} style={{opacity: colors.opacity[_mode]}} />}
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                    !loading ? context.region.name
                                        :
                                        <Skeleton width={100} style={{opacity: colors.opacity[_mode]}} />
                                }</h6>
                            </div>
                        </Col >
                    </Row >
                    <Row>
                        <Col>
                            <hr className={classes.separator} ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>
                                <Translate content="dashboard.registryOverview.labels.registryId" />:
                            </h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ? cloudResourceName(registry) : <Skeleton style={{opacity: colors.opacity[_mode]}}/>
                            }</h6>
                        </Col>
                        <Col xs="12" md="8" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>
                                <Translate content="dashboard.registryOverview.labels.registryEndpoint" />:
                            </h5>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                    !loading ?
                                        registry.endpoint
                                        :
                                        <Skeleton width={100} style={{opacity: colors.opacity[_mode]}} />
                                }</h6>
                            </div>
                        </Col>
                    </Row >
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        {(loading || registry.access_key) && <Col xs="12" md="5" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>
                                <Translate content="dashboard.registryOverview.labels.accessKey" />:
                            </h5>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {!loading ?
                                    <Fragment>
                                        <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                        {showAccessKey ? (
                                                <div className="position-relative">
                                                <Input
                                                    type="text"
                                                    value={`${sliceIfNeeded(registry.access_key, 30)}`}
                                                    readOnly
                                                    style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: colors.smallTitle[_mode],
                                                    width: '420px', // Adjust the width as needed
                                                    }}
                                                />
                                                <Button
                                                    color="secondary"
                                                    size="sm"
                                                    onClick={() => handleCopyClick(registry.access_key, "access_key")}
                                                    className="position-absolute"
                                                    style={{
                                                    top: '50%',
                                                    right: '10px',
                                                    transform: 'translateY(-50%)',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: colors.smallTitle[_mode],
                                                    }}
                                                >
                                                    {copiedAccessKey ? <Translate content="common.message.copied" /> : <i className="fa fa-copy" />}
                                                </Button>
                                                </div>
                                            ) : (
                                                <span>************************************</span>
                                            )}
                                        </h6>
                                        <LoadingButton
                                            onClick={() => setShowAccessKey(!showAccessKey)}
                                            style={{ width: '120px', height: '40px', marginLeft: '10px' }}
                                            icon={`fa-regular fa-eye${showAccessKey ? '-slash' : ''}`}>
                                            {!showAccessKey ? "Show" : "Hide"}
                                        </LoadingButton>
                                    </Fragment>
                                    :
                                    <h6 className={classes.colInlineValue}>
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} />
                                    </h6>
                                }
                            </div>
                        </Col>}
                        {(loading || registry.secret_key) && <Col xs="12" md="5" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>
                                <Translate content="dashboard.registryOverview.labels.secretKey" />:
                            </h5>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {!loading ?
                                    <Fragment>
                                        <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                        {showSecretKey ? (
                                                <div className="position-relative">
                                                <Input
                                                    type="text"
                                                    value={`${sliceIfNeeded(registry.secret_key, 30)}`}
                                                    readOnly
                                                    style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: colors.smallTitle[_mode],
                                                    width: '420px', // Adjust the width as needed
                                                    }}
                                                />
                                                <Button
                                                    color="secondary"
                                                    size="sm"
                                                    onClick={() => handleCopyClick(registry.secret_key, "secret_key")}
                                                    className="position-absolute"
                                                    style={{
                                                    top: '50%',
                                                    right: '10px',
                                                    transform: 'translateY(-50%)',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: colors.smallTitle[_mode],
                                                    }}
                                                >
                                                    {copiedSecretKey ? <Translate content="common.message.copied" /> : <i className="fa fa-copy" />}
                                                </Button>
                                                </div>
                                            ) : (
                                                <span>************************************</span>
                                            )}
                                        </h6>
                                        <LoadingButton
                                            onClick={() => setShowSecretKey(!showSecretKey)}
                                            style={{ width: '120px', height: '40px', marginLeft: '10px' }}
                                            icon={`fa-regular fa-eye${showSecretKey ? '-slash' : ''}`}>
                                            {!showSecretKey ? "Show" : "Hide"}
                                        </LoadingButton>
                                    </Fragment>
                                    :
                                    <h6 className={classes.colInlineValue}>
                                        <Skeleton style={{opacity: colors.opacity[_mode]}} />
                                    </h6>
                                }
                            </div>
                        </Col>}
                        {(!loading && (registry.secret_key || registry.access_key)) && <Col xs="12" md="2" className={classes.row}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingButton
                                    loading={loadingUpdate}
                                    color="warning"
                                    onClick={updateRegistryCredentialsHandler}
                                    style={{ width: '120px', height: '40px', marginLeft: '270px', marginTop: '20px' }}>
                                    <Translate content="common.admin.renewCredentials" />
                                </LoadingButton>
                            </div>
                        </Col>
                        }
                    </Row >
                    <Row>
                        <Col>
                            <hr className={classes.separator} ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>Owner:</h5>
                            {!loading ?
                                <Link to={`/user/${registry.user.id}`} className={classes.colInlineValue}>
                                    {`${registry.user?.email}`}
                                </Link>
                                :
                                <h6 className={classes.colInlineValue}>
                                    <Skeleton style={{opacity: colors.opacity[_mode]}} />
                                </h6>
                            }
                        </Col>
                    </Row>
                </Container >
            </Row >
            {!loading && <Row className={classes.blocMargin}>
                <h2 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.registryOverview.fields.deleteTitle" /></h2>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" sm="12" md="9" className={classes.rowD}>
                            <h6 className={classes.test} style={{color: colors.mainText[_mode]}}>
                                <span style={{ color: "#DF4D7A", fontWeight: "bold" }}><Translate content="dashboard.registryOverview.fields.warning" />! </span>
                                <Translate content="dashboard.registryOverview.fields.deleteDescription" />
                            </h6>
                        </Col>
                        <Col xs="12" sm="12" md="3" className={classes.rowD}>
                            <Button color="danger" outline style={{ display: "flex", justifyContent: "center", alignItems: "center", whiteSpace: "nowrap", height: "100%" }} onClick={onPreDeleteHandler}>
                                <i className="fa-solid fa-trash-can" style={{ marginRight: "8px" }}></i>
                                <h6 style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0" }}>
                                    <Translate content="dashboard.registryOverview.buttons.delete" />
                                </h6>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Row>}
            {!loading && <Row className={classes.blocMargin}>
                <h5 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}>
                    <Translate content="dashboard.registryOverview.fields.transferTitle" />
                </h5>
                <Container className={classes.container}  style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row>
                        <Col xs="12" sm="12" md="9" className={classes.rowD}>
                            <h6 className={classes.test} style={{color: colors.smallTitle[_mode]}}>
                                <span style={{ color: "#DF4D7A", fontWeight: "bold" }}><Translate content="dashboard.registryOverview.fields.warning" />! </span>
                                <Translate content="dashboard.registryOverview.fields.transferDescription" />
                            </h6>
                        </Col>
                        <Col xs="12" sm="12" md="3" className={classes.rowD}>
                            <Button color="danger" outline style={{ display: "flex", justifyContent: "center", alignItems: "center", whiteSpace: "nowrap", height: "100%" }} onClick={onPreTransferHandler}>
                                <i className="fa-solid fa-gift" style={{ marginRight: "8px" }}></i>
                                <h6 style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0" }}>
                                    <Translate content="dashboard.registryOverview.buttons.transfer" />
                                </h6>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Row >}
        </div >
    )
}

export default AdminRegistryOverview