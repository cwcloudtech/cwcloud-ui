import { useContext, useState, useEffect } from 'react';
import { Col, Row, Container } from "reactstrap";
import classes from "./AddEnvironment.module.css";
import '../../../../../common.css';
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import DragDropList from '../../../../../Components/DragDropList/DragDropList';
import LoadingSpinner from '../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import IOSSwitch from '../../../../../utils/iosswitch';
import EditorModal from '../../../../../Components/Modal/EditorModal';
import EditorBox from '../../../../../Components/EditorBox/EditorBox';
import SubdomainTable from '../../../../../Components/Table/SubdomainTable';
import SubdomainModal from '../../../../../Components/Modal/InputModals/SubdomainModal';
import useTableArgs from '../../../../../Hooks/subdomain/useSubdomain';
import ArgModal from '../../../../../Components/Modal/InputModals/ArgModal';
import ArgTable from '../../../../../Components/Table/ArgTable';

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
    const [args, setArgs] = useState([])
    const [subdomains, setSubdomains] = useState([])
    const [unselectedRoles, setUnselectedRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])
    const [nameInputError, setNameInputError] = useState(false)
    const [pathInputError, setPathInputError] = useState(false)
    const navigate = useNavigate()
    const [showFirstEditorFullScreen, setShowFirstEditorFullScreen] = useState(false)
    const [showSecondEditorFullScreen, setShowSecondEditorFullScreen] = useState(false)
    const [showAddNewSubdomain, setShowAddNewSubdomain] = useState(false)
    const [showEditSubdomain, setShowEditSubdomain] = useState(false)
    const [selectedSubdomain, setSelectedSubdomain] = useState('')
    const [selectedSubdomainIndex, setSelectedSubdomainIndex] = useState(0)

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
                setEnvironment({ "is_private": false})
            })
            .catch(err => {
                setLoadingRoles(false)
                console.error(err)
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
                navigate('/admin/environment/overview')
                toast.success(context.counterpart('dashboard.addEnvironement.message.successAdd'))
            }).catch(err => {
                setLoadingSubmit(false)
            })
    }

    const handleChangeSubdomain = (index, value) => {
        const updatedSubdomains = [...subdomains]
        updatedSubdomains[index] = value
        setSubdomains(updatedSubdomains)
        const joinedSubdomains = subdomains.join(';')
        setEnvironment({ ...environment, subdomains: joinedSubdomains })
    }

    const handleAddNewSubdomain = () => {
        setSubdomains([...subdomains, ''])
        setShowAddNewSubdomain(true)
    }

    const handleEditSubdomain = (index) => {
        var selectedSubdomain = subdomains[index]
        setShowEditSubdomain(true)
        setSelectedSubdomain(selectedSubdomain)
        setSelectedSubdomainIndex(index)
    }

    const handleDeleteSubdomain = (index) => {
        const updatedSubdomains = [...subdomains]
        updatedSubdomains.splice(index, 1)
        setSubdomains(updatedSubdomains)
    }

    const {
        showArgsModalForm,
        setShowArgsModalForm,
        selectedArg,
        handleChangeArgs,
        handleAddNewArgs,
        handleEditArgs,
        handleDeleteArgs,
    } = useTableArgs(args, setArgs);

    if (loadingRoles)
        return <LoadingSpinner />
    else
        return (
            <div>
                <ArgModal
                    title={
                    selectedArg
                        ? "dashboard.function.inputs.args.addModalTitle"
                        : "dashboard.function.inputs.args.editModalTitle"
                    }
                    isOpen={showArgsModalForm}
                    toggle={() => setShowArgsModalForm((prev) => !prev)}
                    variable={args[args.length - 1]}
                    index={args.length - 1}
                    onClick={handleChangeArgs}
                />
                <SubdomainModal title="dashboard.addEnvironement.inputs.subdomains.addModalTitle" isOpen={showAddNewSubdomain} toggle={() => setShowAddNewSubdomain(!showAddNewSubdomain)} variable={subdomains[subdomains.length-1]} index={subdomains.length-1} onClick={handleChangeSubdomain} />
                <SubdomainModal title="dashboard.addEnvironement.inputs.subdomains.editModalTitle" isOpen={showEditSubdomain} toggle={() => setShowEditSubdomain(!showEditSubdomain)} variable={selectedSubdomain} index={selectedSubdomainIndex} onClick={handleChangeSubdomain} />
                <Row>
                    <Col>
                        <div className="goBack">
                            <NavLink to='/admin/environment/overview' className="link">
                                <i className="fa-solid fa-arrow-left iconStyle"></i>
                                <Translate content="dashboard.addEnvironement.back" />
                            </NavLink>
                        </div>
                    </Col>
                </Row>
                <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                    <Row>
                        <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                            <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.addEnvironement.mainTitle" />
                            </h5>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className="labelName" style={{color: colors.title[_mode]}}>
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
                                    <h5 className="labelName" style={{color: colors.title[_mode]}}>
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
                            <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.addEnvironement.inputs.logo_url.title" />
                            </h5>
                        </Col>
                        <Col md="6" style={{ margin: "0" }}>
                            <TextField id="logo_url" label={context.counterpart('dashboard.addEnvironement.inputs.logo_url.placeholder')} onChange={(e) => setEnvironment({ ...environment, logo_url: e.target.value })} fullWidth />
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col md="4">
                            <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.addEnvironement.inputs.description.title" />
                            </h5>
                        </Col>
                        <Col md="6" style={{ margin: "0" }}>
                            <TextField
                                id='description'
                                label={context.counterpart('dashboard.addEnvironement.inputs.description.placeholder')}
                                value={environment.description}
                                onChange={e => setEnvironment({ ...environment, description: e.target.value })}
                                fullWidth
                                multiline
                                rows={4}
                            />
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
                    <Row style={{ marginBottom: '20px' }}>
                        <Col>
                            <DragDropList
                                title="dashboard.addEnvironement.inputs.roles.title"
                                roles={roles}
                                setUnselectedRoles={setUnselectedRoles}
                                unselectedRoles={unselectedRoles}
                                setSelectedRoles={setSelectedRoles}
                                selectedRoles={selectedRoles} 
                                externalRolesEnabled={false} /> 
                        </Col>
                    </Row>
                    <SubdomainTable
                        subdomains={subdomains}
                        addNewSubdomain={handleAddNewSubdomain}
                        editSubdomain={handleEditSubdomain}
                        deleteSubdomain={handleDeleteSubdomain}
                    />
                    <ArgTable
                        args={args}
                        addNewArg={handleAddNewArgs}
                        editArg={handleEditArgs}
                        deleteArg={handleDeleteArgs}
                    />
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