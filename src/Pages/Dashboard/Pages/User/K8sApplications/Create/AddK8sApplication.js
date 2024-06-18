import { useContext, useState, useEffect } from "react";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import { Input, Form, FormGroup, FormFeedback, Col, Row, Label } from "reactstrap"
// import classes from "./AddK8sApplication.module.css"
import '../../../../../../common.css';
import { NavLink, useNavigate } from "react-router-dom"
import GlobalContext from "../../../../../../Context/GlobalContext";
import colors from "../../../../../../Context/Colors";
import { Fab, OutlinedInput, Stack } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import AddIcon from '@mui/icons-material/Add';
import Translate from 'react-translate-component';
import LoadingSpinner from "../../../../../../Components/LoadingSpinner/LoadingSpinner";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";
import DropdownComponent from "../../../../../../Components/Dropdown/Dropdown";
import MiniCardComponent from "../../../../../../Components/Cards/MiniCardComponent/MiniCardComponent";
import useAddK8sApplication from "./useAddK8sApplication";

function AddK8sApplication(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [appInfo, setAppInfo] = useState({ name: "", description: "" })
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedCluster, setSelectedCluster] = useState(null)
    const [isInvalid, setIsInvalid] = useState({ name: false, cluster: false, project: false, environment: false, metadata: false, values: false })
    const { projects, clusters, environments, loading, deployApp } = useAddK8sApplication()
    const [selectedEnvironmentId, setSelectedEnvironmentId] = useState(null)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [selectedProjectEnv, setSelectedProjectEnv] = useState(null)

    const navigate = useNavigate()

    const addInstanceHandler = () => {
        setIsInvalid({
            name: appInfo.name === "",
            namespace: appInfo.namespace === "",
            cluster: selectedCluster === null,
            project: selectedProject === null,
            environment: selectedEnvironmentId === null,
        })

        if (
            appInfo.name === "" ||
            appInfo.namespace === "" ||
            selectedCluster === null ||
            selectedProject === null ||
            selectedEnvironmentId === null
        ) {
            return;
        }
        setLoadingSubmit(true)
        deployApp({
            name: appInfo.name,
            description: appInfo.description,
            project_id: selectedProject,
            cluster_id: selectedCluster,
            env_id: selectedEnvironmentId,
        }, () => {
            setLoadingSubmit(false)
            navigate('/k8s-applications')
        })
    }

    useEffect(() => {
        context.setIsGlobal(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (loading)
        return <LoadingSpinner />
    return (
        <div>
            <Row>
                <Col>
                    <div className="goBack">
                        <NavLink to='/k8s-applications' className="link fs-6">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.k8sApplications.form.backToExplore" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: "30px", marginBottom: "20px", margin: "10px 0px 0px" }}>
                <Col className="borderCol" style={{ boxShadow: "0 3px " + colors.bottomShaddow[_mode] }}>
                    <h5 className='textTitle' style={{ color: colors.title[_mode] }}>
                        <Translate content="dashboard.k8sApplications.form.title" />
                    </h5>
                </Col>
            </Row>
            <CardComponent
                containerStyles={props.containerStyles}
                customMarginTop={"20px"}
                title={context.counterpart('dashboard.k8sApplications.form.title')}>
                <Form>
                    <FormGroup>
                        <Label
                            for="app-name"
                            style={{ color: colors.title[_mode] }}
                        >{context.counterpart('dashboard.k8sApplications.form.nameLabel')}*</Label>
                        <Input className="blackableInput" placeholder={context.counterpart('dashboard.k8sApplications.form.namePlaceHolder')}
                            value={appInfo.name} name="app-name"
                            onChange={(e) => setAppInfo({ ...appInfo, name: e.target.value })} invalid={isInvalid.name} />
                        <FormFeedback>
                            <Translate content="common.message.thisFieldIsRequired" className="errorText" />
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label
                            for="app-description"
                            style={{ color: colors.title[_mode] }}
                        >{context.counterpart('dashboard.k8sApplications.form.descriptionLabel')}</Label>
                        <Input className="blackableInput" type="textarea" placeholder={context.counterpart('dashboard.k8sApplications.form.descriptionPlaceholder')}
                            value={appInfo.description} name="app-description"
                            onChange={(e) => setAppInfo({ ...appInfo, description: e.target.value })} />
                    </FormGroup>
                </Form>
            </CardComponent>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.k8sApplications.form.selectCluster') + '*'}
                subtitle={context.counterpart('dashboard.k8sApplications.form.selectClusterSubtitle')}>
                <Stack>
                    <DropdownComponent
                        inputLabelId="demo-multiple-name-label"
                        name={context.counterpart('dashboard.k8sApplications.form.cluster')}
                        selectLabelId="demo-multiple-name-label"
                        selectId="demo-multiple-name"
                        selectedItem={selectedCluster}
                        onChange={(e) => setSelectedCluster(e.target.value)}
                        input={<OutlinedInput label="Name" />}
                        items={clusters}
                    />
                    {isInvalid.cluster ? <Translate content="common.message.thisFieldIsRequired" className="errorText" /> : null}
                </Stack>
            </CardComponent>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.k8sApplications.form.selectProject') + '*'}
                subtitle={context.counterpart('dashboard.k8sApplications.form.selectProjectSubtitle')}>
                <Stack>
                    <Row>
                        <DropdownComponent
                            inputLabelId="demo-multiple-name-label"
                            name={context.counterpart('dashboard.k8sApplications.form.project')}
                            selectLabelId="demo-multiple-name-label"
                            selectId="demo-multiple-name"
                            selectedItem={selectedProject}
                            onChange={(e) => {
                                const env = projects.find((project) => {
                                    return project.id === e.target.value
                                }).environment
                                if (env){
                                    setSelectedProjectEnv(env.name)
                                    setSelectedEnvironmentId(env.id)
                                }else{
                                    setSelectedProjectEnv(null)
                                    setSelectedEnvironmentId(null)
                                }
                                setSelectedProject(e.target.value)
                            }}
                            input={<OutlinedInput label="Name" />}
                            items={projects}
                        />

                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className="tootltipValue">
                            <Translate content="dashboard.k8sApplications.form.addNewProject" />
                        </h5>} placement="right">
                            <Fab color="primary" aria-label="add" onClick={() => navigate("/projects/create")} style={{ transform: 'scale(0.7)', top: '18px' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                        {selectedProjectEnv && <div>
                            <p style={{ color: colors.mainText[_mode] }}>
                                {context.counterpart('dashboard.k8sApplications.form.selectedProjectEnv')+selectedProjectEnv}
                            </p>
                            <p style={{ color: colors.secondText[_mode] }}>
                                {context.counterpart('dashboard.k8sApplications.form.selectedProjectEnvWarn')}
                            </p>
                        </div>}
                    </Row>
                    {isInvalid.project ? <Translate content="common.message.thisFieldIsRequired" className="errorText" /> : null}
                </Stack>
            </CardComponent>
            {selectedProjectEnv === null  ? <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.k8sApplications.form.selectEnvironement')}
                subtitle={context.counterpart('dashboard.k8sApplications.form.selectEnvironementSubtitle')}>
                <Stack>
                    <Row horizontal="center" >
                        {environments.map((environment) =>
                            <MiniCardComponent
                                instancetitle={environment.name}
                                key={environment.id}
                                checked={selectedEnvironmentId === environment.id}
                                onClick={() => {
                                    if (selectedEnvironmentId !== environment.id) {
                                        setSelectedEnvironmentId(environment.id)
                                    }
                                }} />
                        )}
                    </Row>
                    {isInvalid.environment ? <Translate content="common.message.thisFieldIsRequired" className="errorText" /> : null}
                </Stack>
            </CardComponent> : null}
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
        </div>
    )
}

export default AddK8sApplication;
