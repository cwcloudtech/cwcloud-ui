import { useContext, useState, useEffect } from "react";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Input, Form, FormGroup, FormFeedback, FormText, Collapse, Col, Row } from "reactstrap"
import classes from "./AdminAddProject.module.css"
import axios from "../../../../../utils/axios";
import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import GlobalContext from "../../../../../Context/GlobalContext";
import colors from "../../../../../Context/Colors";
import { TextField } from "@mui/material";
import Translate from 'react-translate-component';
import LoadingButton from "../../../../../Components/LoadingButton/LoadingButton";
import SuggestionsAutoComplete from "../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete";

function AdminAddProject(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [project, setProject] = useState({})
    const [invalid, setInvalid] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [isOpenOptions, setIsOpenOptions] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/admin/user/all")
            .then(res => {
                setUsers(res.data.result)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const addProjectHandler = () => {
        setLoading(true)
        setInvalid(!project?.name)
        axios.post(`/admin/project`, project)
            .then(response => {
                setLoading(false)
                toast.success(context.counterpart('dashboard.addProject.message.successAdd'))
                navigate(`/admin/projects`)
            }).catch(err => {
                setLoading(false)
            })

    }

    return (
        <div>
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
            <Row style={{ marginTop: '30px', marginBottom: '20px' }}>
                <Row>
                    <Col className={classes.borderCol} style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                        <h5 className={classes.textTitle} style={{color: colors.title[_mode]}}>
                            <Translate content="dashboard.addProject.mainTitle" />
                        </h5>
                    </Col>
                </Row>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.addProject.inputs.name.title')}>
                        <Form>
                            <FormGroup>
                                <Input className="blackableInput" placeholder={context.counterpart('dashboard.addProject.inputs.name.placeholder')} onChange={(e) => setProject({ ...project, name: e.target.value })} invalid={invalid}/>
                                <FormFeedback>
                                    <Translate content="common.message.thisFieldIsRequired" />
                                </FormFeedback>
                                <FormText>
                                    <Translate content="dashboard.addProject.inputs.name.subtitle" />

                                </FormText>
                            </FormGroup>
                        </Form>
                    </CardComponent>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.addProject.inputs.email.title')}
                        subtitle={context.counterpart('dashboard.addProject.inputs.email.subtitle')}>
                        <SuggestionsAutoComplete
                            id="combo-box-email"
                            onChange={(event, newValue) => {
                                setProject({ ...project, email: newValue });
                            }}
                            options={users.map(u => u.email)}
                            renderInput={(params) =>
                                <TextField onChange={(e) => setProject({ ...project, email: e.target.value })} {...params} label={context.counterpart('dashboard.addProject.inputs.email.placeholder')} />}
                            feedbackMessage="common.message.thisFieldIsRequired"
                            hint="dashboard.addProject.inputs.email.feedback"
                        />
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
                            Show options</LoadingButton>
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
                                    <Input className="blackableInput" placeholder={context.counterpart('dashboard.addProject.inputs.gitlabHost.placeholder')} onChange={(e) => setProject({ ...project, host: e.target.value })} />

                                </FormGroup>
                            </Form>
                        </CardComponent>
                        <CardComponent
                            containerStyles={props.containerStyles}
                            title={context.counterpart('dashboard.addProject.inputs.accessToken.title')}
                            subtitle={context.counterpart('dashboard.addProject.inputs.accessToken.subtitle')}>
                            <Form>
                                <FormGroup>
                                    <Input className="blackableInput" placeholder={context.counterpart('dashboard.addProject.inputs.accessToken.placeholder')} onChange={(e) => setProject({ ...project, token: e.target.value })} />
                                </FormGroup>
                            </Form>
                        </CardComponent>
                        <CardComponent
                            containerStyles={props.containerStyles}
                            title={context.counterpart('dashboard.addProject.inputs.gitUsername.title')}
                            subtitle={context.counterpart('dashboard.addProject.inputs.gitUsername.subtitle')}>
                            <Form>
                                <FormGroup>
                                    <Input className="blackableInput" placeholder={context.counterpart('dashboard.addProject.inputs.gitUsername.placeholder')} onChange={(e) => setProject({ ...project, git_username: e.target.value })} />
                                </FormGroup>
                            </Form>
                        </CardComponent>
                        <CardComponent
                            containerStyles={props.containerStyles}
                            title={context.counterpart('dashboard.addProject.inputs.namespace.title')}
                            subtitle={context.counterpart('dashboard.addProject.inputs.namespace.subtitle')}>
                            <Form>
                                <FormGroup>
                                    <Input className="blackableInput" placeholder={context.counterpart('dashboard.addProject.inputs.namespace.placeholder')} onChange={(e) => setProject({ ...project, namespace: e.target.value })} />
                                </FormGroup>
                            </Form>
                        </CardComponent>
                    </Collapse>
                </Col>
            </Row>
            <Row style={{ marginTop: '30px' }}  >
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingButton loading={loading} icon="fa-solid fa-floppy-disk" onClick={addProjectHandler}  >
                        <Translate content="common.button.create" />
                    </LoadingButton>
                </Col>
            </Row>
        </div>
    )
}

export default AdminAddProject;
