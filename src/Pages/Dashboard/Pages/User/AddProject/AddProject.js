import { useContext, useEffect, useState } from "react";
import { Col, Collapse, Form, FormFeedback, FormGroup, FormText, Input, Row } from "reactstrap";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
// import classes from "./AddProject.module.css";
import { Box, TextField } from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Translate from 'react-translate-component';
import { Container } from 'reactstrap';
import SimpleDropdown from "../../../../../Components/Dropdown/SimpleDropdown";
import LoadingButton from "../../../../../Components/LoadingButton/LoadingButton";
import colors from "../../../../../Context/Colors";
import GlobalContext from "../../../../../Context/GlobalContext";
import '../../../../../common.css';
import axios from "../../../../../utils/axios";
import SuggestionsAutoComplete from "../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete";

function AddProject(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const location = useLocation()
    const currentPath = location.pathname
    const is_admin = currentPath === "/admin/projects/create"
    const [type, setType] = useState("")
    const [project, setProject] = useState({type})
    const [projectType, setProjectType] = useState([])
    const [disabled, setdisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [isOpenOptions, setIsOpenOptions] = useState(false)
    const navigate = useNavigate()

  useEffect(() => {
        context.setIsGlobal(false)
        axios.get("/admin/user/all")
            .then(res => {
                setUsers(res.data.result)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.region.name])

    useEffect(() => {
        const types = []
        if (context.user?.enabled_features?.daasapi){
            types.push("vm")
        }
        if (context.user?.enabled_features?.k8sapi){
            types.push("k8s")
        }
        setProjectType(types)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addProjectHandler = () => {
        setLoading(true)
        setdisabled(!project?.name)
        var api_url = is_admin ? "/admin/project" : "/project"
        axios.post(api_url, project)
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
                    <div className="goBack">
                        <NavLink to='/projects' className="link fs-6">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.addProject.back" />
                        </NavLink>
                    </div>

                </Col>
            </Row>
            <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
                <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                    <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                        <Translate content="dashboard.addProject.mainTitle" />
                    </h5>
                </Col>
            </Row>
            <Row>
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
            <Row>
                <Col>
                    <CardComponent 
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.addProject.inputs.type.title')} 
                        >
                        <Box style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 'fit-content',
                        }}>
                            <SimpleDropdown
                                items={projectType}
                                selectedItem={type}
                                onChange={(e) => {
                                    setType(e.target.value)
                                    setProject({ ...project, type: e.target.value })
                                }}
                            />
                            <FormText>
                                <Translate content="dashboard.addProject.inputs.type.subtitle" />
                            </FormText>
                        </Box>
                    </CardComponent>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart(
                        "dashboard.addProject.inputs.email.title"
                        )}
                        subtitle={context.counterpart(
                        "dashboard.addProject.inputs.email.subtitle"
                        )}
                    >
                        <Form>
                        <SuggestionsAutoComplete
                            id="combo-box-email"
                            onChange={(event, newValue) => {
                            setProject({ ...project, email: newValue });
                            }}
                            options={users.map((u) => u.email)}
                            renderInput={(params) => (
                            <TextField
                                onChange={(e) =>
                                setProject({ ...project, email: e.target.value })
                                }
                                {...params}
                                label={context.counterpart(
                                "dashboard.addProject.inputs.email.placeholder"
                                )}
                            />
                            )}
                            feedbackMessage="common.message.thisFieldIsRequired"
                            hint="dashboard.addProject.inputs.email.feedback"
                        />
                        </Form>
                    </CardComponent>
                </Col>
            </Row>
            <Row>
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
        </Container>
    )
}

export default AddProject;
