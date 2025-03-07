import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Translate from 'react-translate-component';
import { Col, Container, Row, Spinner } from "reactstrap";
import axios from "../../../../../../src/utils/axios";
import DragDropList from '../../../../../Components/DragDropList/DragDropList';
import EditorBox from '../../../../../Components/EditorBox/EditorBox';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import LoadingSpinner from '../../../../../Components/LoadingSpinner/LoadingSpinner';
import ArgModal from '../../../../../Components/Modal/InputModals/ArgModal';
import EditorModal from '../../../../../Components/Modal/EditorModal';
import SubdomainModal from '../../../../../Components/Modal/InputModals/SubdomainModal';
import ArgTable from '../../../../../Components/Table/ArgTable';
import SubdomainTable from '../../../../../Components/Table/SubdomainTable';
import colors from '../../../../../Context/Colors';
import GlobalContext from '../../../../../Context/GlobalContext';
import useTableArgs from '../../../../../Hooks/subdomain/useSubdomain';
import '../../../../../common.css';
import formateDate from '../../../../../utils/FormateDate';
import IOSSwitch from '../../../../../utils/iosswitch';
import { fileDownloadFromResponse } from "../../../../../utils/fileApiDownloader";
import classes from "./EnvironmentOverview.module.css";

function EnvironmentOverview(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [environment, setEnvironment] = useState({})
    const [subdomains, setSubdomains] = useState([])
    const [loadingRoles, setLoadingRoles] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [allRoles, setAllRoles] = useState([])
    const [unselectedRoles, setUnselectedRoles] = useState([])
    const [loadingExport, setLoadingExport] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState([])
    const [args, setArgs] = useState([])
    const { id } = useParams()
    const [showFirstEditorFullScreen, setShowFirstEditorFullScreen] = useState(false)
    const [showSecondEditorFullScreen, setShowSecondEditorFullScreen] = useState(false)
    const [showAddNewSubdomain, setShowAddNewSubdomain] = useState(false)
    const [showEditSubdomain, setShowEditSubdomain] = useState(false)
    const [selectedSubdomain, setSelectedSubdomain] = useState('')
    const [selectedSubdomainIndex, setSelectedSubdomainIndex] = useState(0)

    useEffect(() => {
        context.setIsGlobal(true)
        setLoadingRoles(true)
        axios.get('/admin/environment/roles')
            .then(res => {
                setAllRoles(res.data.roles)
                setLoadingRoles(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (!loadingRoles) {
            setLoading(true)
            axios.get(`/admin/environment/${id}`)
                .then(res => {
                    setEnvironment({ ...res.data, subdomains: res.data.subdomains?.split(';') || [] })
                    setSubdomains(res.data.subdomains?.split(';') || [])
                    setArgs(JSON.parse(res.data.args) || [])
                    const _envRoles = res.data.roles.split(';')
                    setSelectedRoles(_envRoles)
                    setUnselectedRoles(allRoles.filter(role => !_envRoles.includes(role)))
                    setLoading(false)
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingRoles, allRoles])

    const exportEnvironmentHandler = () => {
        setLoadingExport(true)
        axios.get(`/admin/environment/${id}/export`)
            .then((res) => {
                fileDownloadFromResponse(res, "application/json")
                toast.success('Successfully exported environment')
                setLoadingExport(false)
            }).catch(err => {
                setLoadingExport(false)
            })
    }
    const handleClickButton = () => {
        setLoadingSubmit(true)
        const joinedRoles = selectedRoles.join(';')
        const joinedSubdomains = subdomains.join(';')
        axios.put(`/admin/environment/${id}`, { ...environment, args, roles: joinedRoles, subdomains: joinedSubdomains })
            .then(response => {
                setLoadingSubmit(false)
                toast.success(context.counterpart('dashboard.environmentOverview.message.successUpdate'))
            }).catch(err => {
                setLoadingSubmit(false)

            })
    }

    const handleChangeSubdomain = (index, value) => {
        const updatedSubdomains = [...subdomains]
        updatedSubdomains[index] = value
        setSubdomains(updatedSubdomains)
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

    if (loading || loadingRoles)
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
                                <Translate content="dashboard.environmentOverview.back" />
                            </NavLink>
                        </div>
                    </Col>
                </Row>
                <Container fluid style={{ marginTop: "20px" }}>
                    <Row>
                        <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                            <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.environmentOverview.mainTitle" />
                            </h5>
                            <h4 className="createdStyle" style={{color: colors.smallTitle[_mode]}}><Translate content="dashboard.environmentOverview.createdAt" /> : {formateDate(environment.created_at)}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <LoadingButton loading={loadingExport} onClick={exportEnvironmentHandler}>Export</LoadingButton>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "30px" }}>
                        <Col md="6">
                            <Row>
                                <Col md="12">
                                    <TextField id="Environment Name" label={context.counterpart("dashboard.environmentOverview.inputs.name.title")} value={environment.name} onChange={(e) => setEnvironment({ ...environment, name: e.target.value })} required fullWidth variant='outlined' />
                                </Col>
                                <Col md="12" style={{ paddingTop: "20px" }}>
                                    <TextField id="Path Name" label={context.counterpart("dashboard.environmentOverview.inputs.path.title")} value={environment.path} onChange={(e) => setEnvironment({ ...environment, path: e.target.value })} required fullWidth variant='outlined' />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "30px", marginBottom: "30px", marginLeft: "0", marginRight: "0" }}>
                                <Col md="6">
                                    <FormControlLabel
                                        label={context.counterpart("dashboard.environmentOverview.inputs.privacy.title")}
                                        control={<IOSSwitch sx={{ m: 1 }} defaultChecked={environment.is_private} />}
                                        onChange={(e) => setEnvironment({ ...environment, is_private: !environment.is_private })} />
                                </Col>
                            </Row>
                        </Col>
                        <Col md="6">
                            <Row>
                                <Col md="12">
                                    <TextField id="Logo URL" label={context.counterpart("dashboard.environmentOverview.inputs.logo_url.title")} value={environment.logo_url} onChange={(e) => setEnvironment({ ...environment, logo_url: e.target.value })} fullWidth variant='outlined' />
                                </Col>
                                <Col md="12" style={{ paddingTop: "20px" }}>
                                    <TextField
                                        id='Description'
                                        label={context.counterpart("dashboard.environmentOverview.inputs.description.title")}
                                        value={environment.description}
                                        onChange={e => setEnvironment({ ...environment, description: e.target.value })}
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '20px' }}>
                        <Col>
                            <DragDropList
                                title='dashboard.environmentOverview.inputs.roles.title'
                                roles={allRoles}
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
                            <Button onClick={handleClickButton} style={{ width: "250px", height: "50px" }} variant="outlined"
                                size="large">
                                {loadingSubmit ? <Spinner size="sm" style={{ marginRight: "8px" }} />
                                    : <i className="fa-solid fa-floppy-disk" style={{ marginRight: "8px" }}></i>}
                                <Translate content="common.button.save" />
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
}
export default EnvironmentOverview