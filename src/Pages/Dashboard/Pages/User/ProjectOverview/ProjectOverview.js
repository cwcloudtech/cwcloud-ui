import { useContext, useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import classes from "./ProjectOverview.module.css"
import { Row, Col, Button } from "reactstrap"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import axios from "../../../../../utils/axios"
import { toast } from 'react-toastify'
import { Tooltip } from '@mui/material';
import DeleteModal from '../../../../../Components/DeleteModal/DeleteModal'
import Fade from '@mui/material/Fade';
import GlobalContext from '../../../../../Context/GlobalContext';
import Skeleton from 'react-loading-skeleton'
import Translate from "react-translate-component"
import colors from '../../../../../Context/Colors';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';

function ProjectOverview() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const { projectId } = useParams();
    const [project, setProject] = useState([]);
    const [loading, setloading] = useState(true);
    const [loadingRequest, setloadingRequest] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get(`/project/${projectId}`)
            .then(res => {
                setProject(res.data)
                console.log(res.data)
                setloading(false)
            }).catch(err => {

            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onPreDeleteHandler = () => {
        setShowConfirmDeleteModal(true)
    }

    const onDeleteHandler = () => {
        setloadingRequest(true)
        axios.delete(`/project/${project.id}`).then(response => {
            toast.success(context.counterpart('dashboard.projectOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
            navigate('/projects')
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
        })
    }

    const instanceClickedHandler = (instance) => {
        const providerIndex = context.providers.findIndex(p => p.name === instance.provider)
        const regionIndex = context.providers[providerIndex].regions.findIndex(r => r.name === instance.region)
        context.setRegion(context.providers[providerIndex].regions[regionIndex])
        context.setSelectedProvider(context.providers[providerIndex])
        navigate(`/instance/${instance.id}`)
    }

    return (
        <div>
            <DeleteModal resourceName="project" isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={project.name} loading={loadingRequest} />
            <div className={classes.goBack}>
                <NavLink to='/projects' className={classes.link} style={{color: colors.blue[_mode]}}>
                    <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")} style={{color: colors.blue[_mode]}}></i>
                    <Translate content="dashboard.projectOverview.back" />
                </NavLink>
            </div>
            {!loading && <div className={classes.colElement}>
                <Button outline style={{ width: "150px", height: "25px", padding: "0", margin: "0", borderColor: colors.blue[_mode]}} className="blueBtn">
                    <a href={project.url} target="_blank" rel='noreferrer' style={{ textDecoration: "none" }}>
                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: "8px" }}></i>
                        <Translate content="dashboard.projectOverview.buttons.open" />
                    </a>
                </Button>
            </div>}
            <div className={classes.row}>
                <Row>
                    <Col className={classes.colinline} >
                        <i className={["fa-brands fa-gitlab", classes.iconProcessStyle].join(' ')} style={{color: colors.blue[_mode]}}></i>
                        <div style={{ marginLeft: "20px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h6 style={{ fontWeight: '700', color: colors.mainText[_mode] }} >{!loading ? project.name : <Skeleton width={120} style={{opacity: colors.opacity[_mode]}} />}</h6>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row className={classes.blocMargin}>
                <h2 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}>
                    <Translate content="dashboard.projectOverview.fields.title" />
                </h2>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="4" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.projectOverview.fields.status" />:</h5>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? 'Available' : <Skeleton width={100} style={{opacity: colors.opacity[_mode]}} />}</h6>
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
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.projectOverview.fields.activeInstances" />:</h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? project.instances.length : <Skeleton width={50} style={{opacity: colors.opacity[_mode]}} />}</h6>
                            </div>
                        </Col>
                        <Col xs="12" md="6" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.projectOverview.fields.numberPlaybooks" />:</h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? project.playbooks?.length : <Skeleton width={50} style={{opacity: colors.opacity[_mode]}} />}</h6>
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
                            <div >
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.projectOverview.fields.playbooks" />:</h5>
                                {!loading ? 
                                    project.playbooks?.length > 0 ?
                                        project.playbooks.map(playbook => (
                                            <h6 key={playbook} className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                                {playbook}
                                            </h6>
                                        ))
                                    :
                                    <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                        <Translate content="dashboard.projectOverview.fields.emptyPlaybook" />{' '}
                                    </h6>
                                : [1, 2, 3, 4].map(index => (
                                        <h6 key={index} className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                            <Skeleton width={150} style={{opacity: colors.opacity[_mode]}} />
                                        </h6>
                                    ))
                                }
                            </div>

                        </Col>
                    </Row>

                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="12" className={classes.row}>
                            <div>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.projectOverview.fields.activeInstances" />:</h5>
                                {!loading ?
                                    project.instances.length > 0 ?
                                        project.instances.map(instance => (
                                            <h6 className={classes.colInlineValue} style={{color: colors.link[_mode], cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }} onClick={() => instanceClickedHandler(instance)} key={instance.id}  >
                                                {instance.name}
                                            </h6>
                                        ))
                                        :
                                        <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                            <Translate content="dashboard.projectOverview.fields.emptyInstances" />{' '}
                                        </h6>
                                    :
                                    <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>
                                        <Skeleton width={150} style={{opacity: colors.opacity[_mode]}} />
                                        <Skeleton width={150} style={{opacity: colors.opacity[_mode]}} />
                                        <Skeleton width={150} style={{opacity: colors.opacity[_mode]}} />
                                        <Skeleton width={150} style={{opacity: colors.opacity[_mode]}} />
                                    </h6>
                                }
                            </div>
                        </Col>
                    </Row>
                    {
                        project.playbooks?.map(p => p.split('playbook-')[1]).filter(playbookName => (
                            !project.instances.some(instance => instance.name === playbookName)
                        ))?.length > 0 &&
                        <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                            <Col xs="8" md="8" className={classes.row}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}>
                                    <Translate content="dashboard.projectOverview.fields.regenerateDeletedInstances" />:
                                </h5>
                                <h6 style={{ marginTop: "2px", paddingLeft: "10px", fontSize: '15px' }}>
                                        <Translate style={{color: colors.secondText[_mode]}} content="dashboard.projectOverview.fields.instances.hint" />
                                </h6>
                            </Col>
                            <Col xs="4" md="4" className={classes.row}>
                                <LoadingButton
                                    color="warning"
                                    onClick={() => navigate(`/instances/attach/${project.id}`)}
                                    style={{ width: '300px', height: '40px', marginLeft: '10px', marginTop: "20px"}}>
                                    <Translate content="dashboard.projectOverview.buttons.attachInstance" />
                                </LoadingButton>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col>
                            <hr className={classes.separator} ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="12" className={classes.row}>
                            <Row>
                                <Col xs="auto" md="auto">
                                    <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.projectOverview.fields.link.title" />:</h5>
                                </Col>
                                <Col className={classes.colinline} xs="auto" md="auto">
                                    <h6 className={classes.colInlineValueSpec} style={{color: colors.smallTitle[_mode]}}>{
                                        !loading ?
                                            project.url
                                            :
                                            <Skeleton width={300} style={{opacity: colors.opacity[_mode]}} />
                                    }</h6>
                                    {!loading && <a href={project.url} target="_blank" rel='noreferrer'>
                                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} sx={{ borderRadius: '50px' }} title={context.counterpart('dashboard.projectOverview.fields.link.hint')} placement="top">
                                            <i className={["fa-solid fa-arrow-up-right-from-square", classes.icon].join(' ')} style={{color: colors.blue[_mode]}}></i>
                                        </Tooltip>
                                    </a>}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Row >
            {!loading && project.userid === context.user.id && <Row className={classes.blocMargin}>
                <h5 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}>
                    <Translate content="dashboard.projectOverview.fields.deleteTitle" />
                </h5>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode], borderRadius: "7px"}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" sm="12" md="9" className={classes.rowD}>
                            <h6 className={classes.test} style={{color: colors.smallTitle[_mode]}}>
                                <span style={{ color: "#DF4D7A", fontWeight: "bold" }}><Translate content="dashboard.projectOverview.fields.warning" />! </span>
                                <Translate content="dashboard.projectOverview.fields.deleteDescription" />
                            </h6>
                        </Col>
                        <Col xs="12" sm="12" md="3" className={classes.rowD}>
                            <Button color="danger" outline style={{ display: "flex", justifyContent: "center", alignItems: "center", whiteSpace: "nowrap", height: "100%" }} onClick={onPreDeleteHandler}>
                                <i className="fa-solid fa-trash-can" style={{ marginRight: "8px" }}></i>
                                <h6 style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0" }}>
                                    <Translate content="dashboard.projectOverview.buttons.delete" />
                                </h6>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Row>}
        </div>
    )
}

export default ProjectOverview