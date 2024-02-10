import { useContext, useState, useEffect } from "react";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Input, Form, FormGroup, FormFeedback, FormText, Col, Row, Collapse } from "reactstrap"
import classes from "./AddProject.module.css"
import axios from "../../../../../utils/axios";
import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import GlobalContext from "../../../../../Context/GlobalContext";
import colors from "../../../../../Context/Colors";
import { Container } from 'reactstrap';
import Translate from 'react-translate-component';
import LoadingButton from "../../../../../Components/LoadingButton/LoadingButton";

function AddProject(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [project, setProject] = useState("")
    const [disabled, setdisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isOpenOptions, setIsOpenOptions] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        context.setIsGlobal(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addProjectHandler = () => {
        setLoading(true)
        setdisabled(!project?.name)
        axios.post(`/project`, project)
            .then(response => {
                setLoading(false)
                toast.success(context.counterpart('dashboard.addProject.message.successAdd'))
                navigate(`/projects`)
            }).catch(err => {
                setLoading(false)
            })

    }
    return (
        <Container style={{ padding: "0" }}>
            <Row>
                <Col>
                    <div className={classes.goBack}>
                        <NavLink to='/projects' className={classes.link}>
                            <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                            <Translate content="dashboard.addProject.back" />
                        </NavLink>
                    </div>

                </Col>
            </Row>
            <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
                <Col className={classes.borderCol} style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                    <h5 className={classes.textTitle} style={{color: colors.title[_mode]}}>
                        <Translate content="dashboard.addProject.mainTitle" />
                    </h5>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px" }}>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.addProject.inputs.name.title')} >
                        <Form>
                            <FormGroup>
                                <Input className="blackableInput" placeholder={context.counterpart('dashboard.addProject.inputs.name.placeholder')} onChange={(e) => setProject({ ...project, name: e.target.value })} invalid={disabled} />
                                <FormFeedback>
                                    <Translate content="common.message.thisFieldIsRequired" />
                                </FormFeedback>
                                <FormText>
                                    <Translate content="dashboard.addProject.inputs.name.subtitle" />
                                </FormText>
                            </FormGroup>
                        </Form>
                    </CardComponent>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px" }}>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.addProject.inputs.showOptions.title')}
                        subtitle={context.counterpart('dashboard.addProject.inputs.showOptions.subtitle')}>
                        <LoadingButton
                            variant="contained"
                            icon={isOpenOptions ? "fa-solid fa-minus" : "fa-solid fa-plus"}
                            style={{ textTransform: 'none', backgroundColor: '#0A60AF' }}
                            onClick={() => setIsOpenOptions(!isOpenOptions)}>
                            <Translate content="common.button.showOptions" />
                        </LoadingButton>
                    </CardComponent>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Collapse isOpen={isOpenOptions} toggle={() => setIsOpenOptions(!isOpenOptions)}>
                        <CardComponent
                            containerStyles={props.containerStyles}
                            title={context.counterpart('dashboard.addProject.inputs.gitlabHost.title')}
                            subtitle={context.counterpart('dashboard.addProject.inputs.gitlabHost.subtitle')}>
                            <Form>
                                <FormGroup>
                                    <Input className="blackableInput"placeholder={context.counterpart('dashboard.addProject.inputs.gitlabHost.placeholder')} onChange={(e) => setProject({ ...project, host: e.target.value })} />
                                </FormGroup>
                            </Form>
                        </CardComponent>
                        <CardComponent
                            containerStyles={props.containerStyles}
                            title={context.counterpart('dashboard.addProject.inputs.accessToken.title')}
                            subtitle={context.counterpart('dashboard.addProject.inputs.accessToken.subtitle')}>
                            <Form>
                                <FormGroup>
                                    <Input className="blackableInput"placeholder={context.counterpart('dashboard.addProject.inputs.accessToken.placeholder')} onChange={(e) => setProject({ ...project, token: e.target.value })} />
                                </FormGroup>
                            </Form>
                        </CardComponent>
                        <CardComponent
                            containerStyles={props.containerStyles}
                            title={context.counterpart('dashboard.addProject.inputs.gitUsername.title')}
                            subtitle={context.counterpart('dashboard.addProject.inputs.gitUsername.subtitle')}>
                            <Form>
                                <FormGroup>
                                    <Input className="blackableInput"placeholder={context.counterpart('dashboard.addProject.inputs.gitUsername.placeholder')} onChange={(e) => setProject({ ...project, git_username: e.target.value })} />
                                </FormGroup>
                            </Form>
                        </CardComponent>
                        <CardComponent
                            containerStyles={props.containerStyles}
                            title={context.counterpart('dashboard.addProject.inputs.namespace.title')}
                            subtitle={context.counterpart('dashboard.addProject.inputs.namespace.subtitle')}>
                            <Form>
                                <FormGroup>
                                    <Input className="blackableInput"placeholder={context.counterpart('dashboard.addProject.inputs.namespace.placeholder')} onChange={(e) => setProject({ ...project, namespace: e.target.value })} />
                                </FormGroup>
                            </Form>
                        </CardComponent>
                    </Collapse>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingButton loading={loading} icon={"fa-solid fa-floppy-disk"} onClick={addProjectHandler}>
                        <Translate content="common.button.create" />
                    </LoadingButton>
                </Col>
            </Row>
        </Container >
    )
}

export default AddProject;
