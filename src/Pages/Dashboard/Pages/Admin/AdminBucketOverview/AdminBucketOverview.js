import { useContext, useEffect, useRef, useState, Fragment } from 'react';
import { Container } from 'reactstrap';
import { Row, Col, Button, Input } from 'reactstrap';
import classes from "./AdminBucketOverview.module.css";
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
import TransferBucketModal from './TransferBucketModal/TransferBucketModal';
import colors from '../../../../../Context/Colors';
import sliceIfNeeded from '../../../../../utils/stringSlice';

function AdminBucketOverview() {
    const context = useContext(GlobalContext)
    const { bucketId } = useParams()
    const [bucket, setBucket] = useState([])
    const [loading, setloading] = useState(true)
    const [loadingRefresh, setloadingRefresh] = useState(false)
    const [loadingRequest, setloadingRequest] = useState(false)
    const [loadingUpdate, setloadingUpdate] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showTransferModal, setShowTransferModal] = useState(false)
    const [loadingTransfer, setLoadingTransfer] = useState(false)
    const _mode = context.mode;
    const navigate = useNavigate()
    const fetchBucketInterval = useRef(null)
    const [showSecretKey, setShowSecretKey] = useState(false)
    const [showAccessKey, setShowAccessKey] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get(`/admin/bucket/${bucketId}`)
            .then(res => {
                setBucket(res.data)
                axios.get("/admin/user/all")
                    .then(res => {
                        setUsers(res.data.result)
                        setloading(false)
                    })
            }).catch(err => {
                navigate('/admin/buckets')
            })
        // eslint-disable-next-line
    }, [])

    const onPreDeleteHandler = () => {
        setShowConfirmDeleteModal(true)
    }

    const onDeleteHandler = () => {
        setloadingRequest(true)
        axios.delete(`/admin/bucket/${bucket.id}`).then(response => {
            toast.success(context.counterpart('dashboard.bucketOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
            navigate('/admin/buckets')
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
        })
    }

    const refreshBucketStateHandler = () => {
        setloadingRefresh(true)
        axios.post(`/admin/bucket/refresh/${bucket.id}`).then(response => {
            toast.success(context.counterpart('dashboard.bucketOverview.message.successRefresh'))
            setloadingRefresh(false)
        }).catch(err => {
            setloadingRefresh(false)
        })
    }

    const onPreTransferHandler = () => {
        setShowTransferModal(true)
    }

    const onTransferHandler = (userEmail) => {
        setLoadingTransfer(true)
        axios.patch(`/admin/bucket/${bucket.id}`, { email: userEmail }).then(response => {
            toast.success("successfully transfered bucket")
            setShowTransferModal(false)
            setLoadingTransfer(false)
            navigate('/buckets')

        }).catch(err => {

            setShowTransferModal(false)
            setLoadingTransfer(false)
        })
    }

    const updateBucketCredentialsHandler = () => {
        setloadingUpdate(true)
        axios.patch(`/admin/bucket/${bucket.id}`, { update_creds: true }).then(response => {
            toast.success(context.counterpart('dashboard.bucketOverview.message.successUpdate'))
            fetchBucket()
            setloadingUpdate(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setloadingUpdate(false)
        })
    }

    const fetchBucket = () => {
        axios.get(`/admin/bucket/${bucketId}`)
            .then(res => {
                setBucket(res.data)
                setloading(false)
            }).catch(err => {
                setloading(false)
                clearInterval(fetchBucketInterval.current)
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
        if (fetchBucketInterval.current)
            clearInterval(fetchBucketInterval.current)
        if (bucket && bucket.status === "starting") {
            fetchBucketInterval.current = setInterval(() => {
                fetchBucket()
            }, 5000);
        } else {
            fetchBucket()
        }
        return () => {
            clearInterval(fetchBucketInterval.current)
        }
        // eslint-disable-next-line
    }, [bucket.status])

    return (
        <div>
            <TransferBucketModal
                resourceName="bucket"
                users={users}
                isOpen={showTransferModal}
                toggle={() => setShowTransferModal(!showTransferModal)}
                onSave={onTransferHandler} loading={loadingTransfer} />
            <DeleteModal resourceName="bucket" isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={bucket.name} loading={loadingRequest} />
            <div className={classes.goBack} >
                <NavLink to='/admin/buckets' className={classes.link} style={{color: colors.blue[_mode]}}>
                    <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")} style={{color: colors.blue[_mode]}}></i>
                    <Translate content="dashboard.bucketOverview.back" />
                </NavLink>
            </div>
            <div className={classes.colElement}>
                <LoadingButton loading={loadingRefresh} icon="fa-solid fa-rotate" onClick={refreshBucketStateHandler} outline style={{ width: "150px", height: "25px", padding: "0", margin: "0", marginRight: '10px' }} className="blueBtn">
                    <Translate content="dashboard.bucketOverview.buttons.refresh" />
                </LoadingButton>
            </div>
            <div className={classes.row}>
                <Row>
                    <Col className={classes.colinline} >
                        {bucket.status === 'starting' ?
                            <i className={["fa-solid fa-circle", classes.toggleStarting].join(' ')}></i>
                            :
                            bucket.status === 'active' ?
                                <i className={["fa-solid fa-circle", classes.active].join(' ')}></i>
                                :
                                <i className={["fa-solid fa-circle", classes.inactive].join(' ')}></i>
                        }
                        <i className={["fa-solid fa-cube", classes.iconProcessStyle].join(' ')} style={{color: colors.blue[_mode]}}></i>
                        <div style={{ marginLeft: "20px" }}>
                            <h6 style={{color: colors.mainText[_mode]}}>{
                                !loading ? bucket.name
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}}  width={150} />
                            }</h6>
                            <h6 style={{ color: "#C3BCC3", fontWeight: "400" }}>{
                                !loading ?
                                    bucket.type
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}}  width={100} />
                            }</h6>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row className={classes.blocMargin}>
                <h2 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.bucketOverview.fields.title" /></h2>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 style={{color: colors.mainText[_mode]}} className={classes.textStyle}><Translate content="dashboard.bucketOverview.fields.status" />:</h5>
                            <div style={{ display: "flex" }}>
                                {
                                    bucket.status === "active" ?
                                        <i className={["fa-solid fa-circle", classes.active].join(' ')}></i> :
                                        bucket.status === 'starting' ?
                                            <i className={["fa-solid fa-circle", classes.toggleStarting].join(' ')}></i>
                                            :
                                            <i className={["fa-solid fa-circle", classes.powredOff].join(' ')}></i>
                                }
                                {loading ? <h6 className={classes.colInlineValue}><Skeleton style={{opacity: colors.opacity[_mode]}}  width={100} /></h6> :
                                    <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{bucket.status}</h6>
                                }
                            </div>
                        </Col>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.bucketOverview.fields.type" />:</h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ?
                                    bucket.type
                                    :
                                    <Skeleton style={{opacity: colors.opacity[_mode]}}  />
                            }</h6>
                        </Col>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.bucketOverview.fields.region" />:</h5>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                {!loading ? <img src={srcimage(context.region.name)} className={classes.imgstyle} alt="region"></img> : <Skeleton style={{opacity: colors.opacity[_mode]}}  circle height={30} width={30} />}
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                    !loading ? context.region.name
                                        :
                                        <Skeleton style={{opacity: colors.opacity[_mode]}}  width={100} />
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
                        <Col xs="12" md="8" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>Bucket ID:</h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ? cloudResourceName(bucket.name) : <Skeleton style={{opacity: colors.opacity[_mode]}}  />
                            }</h6>
                        </Col>
                        <Col xs="12" md="8" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>Bucket Endpoint:</h5>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                    !loading ?
                                        bucket.endpoint
                                        :
                                        <Skeleton style={{opacity: colors.opacity[_mode]}}  width={100} />
                                }</h6>
                            </div>
                        </Col>
                    </Row >
                    <Row style={{ marginLeft: "15px" }}>
                        {(loading || bucket.access_key) && <Col xs="12" md="5" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>Access Key:</h5>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {!loading ?
                                    <Fragment>
                                        <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                        {showAccessKey ? (
                                        <div className="position-relative">
                                        <Input
                                            type="text"
                                            value={`${sliceIfNeeded(bucket.access_key, 20)}`}
                                            readOnly
                                            style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: colors.smallTitle[_mode],
                                            width: '300px', // Adjust the width as needed
                                            }}
                                        />
                                        <Button
                                            color="secondary"
                                            size="sm"
                                            onClick={() => handleCopyClick(bucket.access_key, "access_key")}
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
                                        <Skeleton style={{opacity: colors.opacity[_mode]}}  />
                                    </h6>
                                }
                            </div>
                        </Col>}
                        {(loading || bucket.secret_key) && <Col xs="12" md="5" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>Secret Key:</h5>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {!loading ?
                                    <Fragment>
                                        <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                        {showSecretKey ? (
                                        <div className="position-relative">
                                        <Input
                                            type="text"
                                            value={`${sliceIfNeeded(bucket.secret_key, 20)}`}
                                            readOnly
                                            style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: colors.smallTitle[_mode],
                                            width: '300px', // Adjust the width as needed
                                            }}
                                        />
                                        <Button
                                            color="secondary"
                                            size="sm"
                                            onClick={() => handleCopyClick(bucket.secret_key, "secret_key")}
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
                                        <Skeleton style={{opacity: colors.opacity[_mode]}}  />
                                    </h6>
                                }
                            </div>
                        </Col>}
                        {(!loading && (bucket.access_key || bucket.secret_key)) && <Col xs="12" md="2" className={classes.row}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingButton
                                    loading={loadingUpdate}
                                    color="warning"
                                    onClick={updateBucketCredentialsHandler}
                                    style={{ width: '120px', height: '40px', marginTop: '20px' }}>
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
                                <Link to={`/user/${bucket.user.id}`} className={classes.colInlineValue}>
                                    {`${bucket.user?.email}`}
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
                <h2 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.bucketOverview.fields.deleteTitle" /></h2>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" sm="12" md="9" className={classes.rowD}>
                            <h6 className={classes.test} style={{color: colors.mainText[_mode]}}>
                                <span style={{ color: "#DF4D7A", fontWeight: "bold" }}><Translate content="dashboard.bucketOverview.fields.warning" />! </span>
                                <Translate content="dashboard.bucketOverview.fields.deleteDescription" />
                            </h6>
                        </Col>
                        <Col xs="12" sm="12" md="3" className={classes.rowD}>
                            <Button color="danger" outline style={{ display: "flex", justifyContent: "center", alignItems: "center", whiteSpace: "nowrap", height: "100%" }} onClick={onPreDeleteHandler}>
                                <i className="fa-solid fa-trash-can" style={{ marginRight: "8px" }}></i>
                                <h6 style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0" }}>
                                    <Translate content="dashboard.bucketOverview.buttons.delete" />
                                </h6>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Row>}
            {!loading && <Row className={classes.blocMargin}>
                <h5 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}>
                    <Translate content="dashboard.bucketOverview.fields.transferTitle" />
                </h5>
                <Container className={classes.container}  style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row>
                        <Col xs="12" sm="12" md="9" className={classes.rowD}>
                            <h6 className={classes.test} style={{color: colors.smallTitle[_mode]}}>
                                <span style={{ color: "#DF4D7A", fontWeight: "bold" }}><Translate content="dashboard.bucketOverview.fields.warning" />! </span>
                                <Translate content="dashboard.bucketOverview.fields.transferDescription" />
                            </h6>
                        </Col>
                        <Col xs="12" sm="12" md="3" className={classes.rowD}>
                            <Button color="danger" outline style={{ display: "flex", justifyContent: "center", alignItems: "center", whiteSpace: "nowrap", height: "100%" }} onClick={onPreTransferHandler}>
                                <i className="fa-solid fa-gift" style={{ marginRight: "8px" }}></i>
                                <h6 style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0" }}>
                                    <Translate content="dashboard.bucketOverview.buttons.transfer" />
                                </h6>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Row >}
        </div >
    )
}

export default AdminBucketOverview