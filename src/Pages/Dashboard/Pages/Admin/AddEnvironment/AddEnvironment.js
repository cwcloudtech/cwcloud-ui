import { useContext, useState, useEffect } from 'react';
import { Col, Row, Container } from "reactstrap";
import classes from "./AddEnvironment.module.css";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Fab } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DragDropList from '../../../../../Components/DragDropList/DragDropList';
import LoadingSpinner from '../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IOSSwitch from '../../../../../utils/iosswitch';
import EditorModal from '../../../../../Components/EditorModal/EditorModal';
import EditorBox from '../../../../../Components/EditorBox/EditorBox';

function AddEnvironment() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loadingRoles, setLoadingRoles] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [roles, setRoles] = useState([])
    const [environment, setEnvironment] = useState({
        name: "",
        path: ""
    })
    const [unselectedRoles, setUnselectedRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])
    const [nameInputError, setNameInputError] = useState(false)
    const [pathInputError, setPathInputError] = useState(false)
    const navigate = useNavigate()
    const [showFirstEditorFullScreen, setShowFirstEditorFullScreen] = useState(false)
    const [showSecondEditorFullScreen, setShowSecondEditorFullScreen] = useState(false)

    useEffect(() => {
        context.setIsGlobal(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoadingRoles(true)
        axios.get('/admin/environment/roles')
            .then(res => {
                setRoles(res.data.roles)
                setUnselectedRoles(res.data.roles)
                setLoadingRoles(false)
                setEnvironment({ "is_private": false, subdomains: [''] })
            })
    }, [])

    const handleClickButton = () => {
        setLoadingSubmit(true)
        if (isBlank(environment.name)) {
            setNameInputError(true)
            setLoadingSubmit(false)
        }

        if (isBlank(environment.path)) {
            setPathInputError(true)
            setLoadingSubmit(false)
        }

        axios.post(`/admin/environment`, { ...environment, roles: selectedRoles })
            .then(response => {
                setLoadingSubmit(false)
                navigate('/environment/overview')
                toast.success(context.counterpart('dashboard.addEnvironement.message.successAdd'))
            }).catch(err => {
                setLoadingSubmit(false)
            })
    }

    const updateSubdomainHandler = (index, value) => {
        const _environment = { ...environment }
        _environment.subdomains[index] = value
        setEnvironment({ ..._environment })
    }

    if (loadingRoles)
        return <LoadingSpinner />
    else
        return (
            <div>
                <Row>
                    <Col>
                        <div className={classes.goBack}>
                            <NavLink to='/environment/overview' className={classes.link}>
                                <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                                <Translate content="dashboard.addEnvironement.back" />
                            </NavLink>
                        </div>
                    </Col>
                </Row>
                <Container className={classes.container} fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                    <Row>
                        <Col className={classes.borderCol} style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                            <h5 className={classes.textTitle} style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.addEnvironement.mainTitle" />
                            </h5>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.addEnvironement.inputs.name.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                                </Col>
                                <Col md="6">
                                    <TextField
                                        id="env_name"
                                        error={nameInputError}
                                        label={context.counterpart('dashboard.addEnvironement.inputs.name.placeholder')}
                                        onChange={(e) => setEnvironment({ ...environment, name: e.target.value })}
                                        required 
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.addEnvironement.inputs.path.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                                </Col>
                                <Col md="6">
                                    <TextField
                                        id="env_path"
                                        error={pathInputError}
                                        label={context.counterpart('dashboard.addEnvironement.inputs.path.placeholder')}
                                        onChange={(e) => setEnvironment({ ...environment, path: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col md="4">
                            <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.addEnvironement.inputs.logo_url.title" />
                            </h5>
                        </Col>
                        <Col md="6" style={{ margin: "0" }}>
                            <TextField id="logo_url" label={context.counterpart('dashboard.addEnvironement.inputs.logo_url.placeholder')} onChange={(e) => setEnvironment({ ...environment, logo_url: e.target.value })} fullWidth />
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col md="4">
                            <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.addEnvironement.inputs.description.title" />
                            </h5>
                        </Col>
                        <Col md="6" style={{ margin: "0" }}>
                            <TextareaAutosize
                                minRows={3}
                                value={environment.description}
                                style={{ width: "100% ", padding: "10px", backgroundColor: colors.mainBackground[_mode], color: colors.menuText[_mode], border: "1px solid "+ colors.textAreaBorder[_mode], borderRadius: "3px" }}
                                placeholder={context.counterpart('dashboard.addEnvironement.inputs.description.placeholder')}
                                onChange={e => setEnvironment({ ...environment, description: e.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.addEnvironement.inputs.subdomains.title" />
                                    </h5>
                                    <Fab color="primary" aria-label="add" onClick={() => setEnvironment({ ...environment, subdomains: [...environment.subdomains, ''] })} style={{ transform: 'scale(0.7)' }} >
                                        <AddIcon className="whiteIcon" />
                                    </Fab>
                                </Col>
                                <Col md="6">
                                    {environment.subdomains?.map((subdomain, index) => (
                                        <Row key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Col>
                                                <TextField
                                                    style={{ marginTop: '10px' }}
                                                    value={subdomain}
                                                    onChange={(e) => updateSubdomainHandler(index, e.target.value)}
                                                    label={context.counterpart('dashboard.addEnvironement.inputs.subdomains.placeholder')}
                                                    fullWidth />
                                            </Col>
                                            <Col xs="1">
                                                <Fab aria-label="delete" color='primary' onClick={() => setEnvironment({ ...environment, subdomains: [...environment.subdomains.filter((s, i) => i !== index)] })} style={{ transform: 'scale(0.7)' }} >
                                                    <DeleteIcon className="whiteIcon" />
                                                </Fab>
                                            </Col>
                                        </Row>
                                    ))}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "90px", marginLeft: "0", marginRight: "0" }}>
                        <Col>
                            <FormControlLabel
                                label={context.counterpart('dashboard.addEnvironement.inputs.privacy.title')}
                                control={<IOSSwitch sx={{ m: 1 }} defaultChecked={environment.is_private} />}
                                onChange={(e) => setEnvironment({ ...environment, is_private: !environment.is_private })}
                            />
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col md="4">
                            <h5 className={classes.labelName} style={{ color: colors.title[_mode] }}>
                                <Translate content="dashboard.addEnvironement.inputs.roles.title" />
                            </h5>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '20px' }}>
                        <Col md={{ offset: 2, size: 8 }}>
                            <DragDropList
                                roles={roles}
                                setUnselectedRoles={setUnselectedRoles}
                                unselectedRoles={unselectedRoles}
                                setSelectedRoles={setSelectedRoles}
                                selectedRoles={selectedRoles} />
                        </Col>
                    </Row>
                    <Row className={classes.rowContainer} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '20px' }}>
                        <Col md="12" >
                            <EditorBox
                                title={context.counterpart('dashboard.addEnvironement.inputs.template.title')}
                                textToCopy={environment.environment_template || ''}
                                handleFullScreen={() => setShowFirstEditorFullScreen(true)}
                                language="yaml"
                                value={environment.environment_template || ''}
                                onChange={v => setEnvironment({ ...environment, environment_template: v })} />
                            <EditorModal
                                isOpen={showFirstEditorFullScreen}
                                toggle={() => setShowFirstEditorFullScreen(!showFirstEditorFullScreen)}
                                language="yaml"
                                value={environment.environment_template || ''}
                                onChange={v => setEnvironment({ ...environment, environment_template: v })}
                            />
                        </Col>
                    </Row>
                    <Row className={classes.rowContainer} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '20px' }}>
                        <Col md="12" >
                            <EditorBox
                                title={context.counterpart('dashboard.addEnvironement.inputs.documentation.title')}
                                textToCopy={environment.doc_template || ''}
                                handleFullScreen={() => setShowSecondEditorFullScreen(true)}
                                font="50px"
                                style={{ fontSize: '40px' }}
                                language="markdown"
                                value={environment.doc_template || ''}
                                onChange={v => setEnvironment({ ...environment, doc_template: v })}
                            />
                            <EditorModal
                                isOpen={showSecondEditorFullScreen}
                                toggle={() => setShowSecondEditorFullScreen(!showSecondEditorFullScreen)}
                                language="markdown"
                                value={environment.doc_template || ''}
                                onChange={v => setEnvironment({ ...environment, doc_template: v })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "20px" }}>
                            <LoadingButton icon="fa-solid fa-floppy-disk" loading={loadingSubmit} onClick={handleClickButton} style={{ width: "250px", height: "50px" }} variant="outlined">
                                <Translate content="common.button.create" />
                            </LoadingButton>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
}
export default AddEnvironment