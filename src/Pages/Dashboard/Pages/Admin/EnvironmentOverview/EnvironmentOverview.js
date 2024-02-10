import { useContext, useState, useEffect } from 'react';
import { Spinner, Col, Row, Container } from "reactstrap"
import classes from "./EnvironmentOverview.module.css"
import axios from "../../../../../../src/utils/axios";
import { NavLink, useParams } from "react-router-dom"
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import formateDate from '../../../../../utils/FormateDate';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Fab } from '@mui/material';
import DragDropList from '../../../../../Components/DragDropList/DragDropList';
import Button from '@mui/material/Button';
import LoadingSpinner from '../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { saveAs } from 'file-saver';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import IOSSwitch from '../../../../../utils/iosswitch';
import EditorModal from '../../../../../Components/EditorModal/EditorModal';
import EditorBox from '../../../../../Components/EditorBox/EditorBox';

function EnvironmentOverview(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [environment, setEnvironment] = useState({})
    const [loadingRoles, setLoadingRoles] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [allRoles, setAllRoles] = useState([])
    const [unselectedRoles, setUnselectedRoles] = useState([])
    const [loadingExport, setLoadingExport] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState([])
    const { id } = useParams()
    const [showFirstEditorFullScreen, setShowFirstEditorFullScreen] = useState(false)
    const [showSecondEditorFullScreen, setShowSecondEditorFullScreen] = useState(false)

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
                const byteCharacters = atob(res.data.blob.toString("base64"));
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const pdfBlob = new Blob([byteArray], { type: 'application/json' });
                saveAs(pdfBlob, res.data.file_name);
                toast.success('Successfully exported environment')
                setLoadingExport(false)
            }).catch(err => {
                setLoadingExport(false)
            })
    }
    const handleClickButton = () => {
        setLoadingSubmit(true)
        const joinedRoles = selectedRoles.join(';')
        const joinedSubdomains = environment.subdomains.join(';')
        axios.put(`/admin/environment/${id}`, { ...environment, roles: joinedRoles, subdomains: joinedSubdomains })
            .then(response => {
                setLoadingSubmit(false)
                toast.success(context.counterpart('dashboard.environmentOverview.message.successUpdate'))
            }).catch(err => {
                setLoadingSubmit(false)

            })
    }

    const updateSubdomainHandler = (index, value) => {
        const _environment = { ...environment }
        _environment.subdomains[index] = value
        setEnvironment({ ..._environment })
    }

    if (loading || loadingRoles)
        return <LoadingSpinner />
    else
        return (
            <div>
                <Row>
                    <Col>
                        <div className={classes.goBack}>
                            <NavLink to='/environment/overview' className={classes.link}>
                                <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                                <Translate content="dashboard.environmentOverview.back" />
                            </NavLink>
                        </div>
                    </Col>
                </Row>
                <Container className={classes.container} fluid style={{ marginTop: "20px" }}>
                    <Row>
                        <Col className={classes.borderCol} style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                            <h5 className={classes.textTitle} style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.environmentOverview.mainTitle" />
                            </h5>
                            <h4 className={classes.createdStyle} style={{color: colors.smallTitle[_mode]}}><Translate content="dashboard.environmentOverview.createdAt" /> : {formateDate(environment.created_at)}</h4>
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
                            <Row style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                                <Col md="3">
                                    <h5 className={classes.labelName} style={{display: 'inline', color: colors.secondText[_mode]}}>
                                        <Translate content="dashboard.addEnvironement.inputs.subdomains.title" />
                                    </h5>
                                    <Fab color="primary" aria-label="add" onClick={() => setEnvironment({ ...environment, subdomains: [...environment.subdomains, ''] })} style={{ transform: 'scale(0.7)' }} >
                                        <AddIcon />
                                    </Fab>
                                </Col>
                                <Col md="8">
                                    {environment.subdomains?.map((subdomain, index) => (    
                                        <Row >
                                            <Col>
                                                <TextField
                                                    key={index}
                                                    style={{ marginTop: '10px' }}
                                                    value={subdomain}
                                                    onChange={(e) => updateSubdomainHandler(index, e.target.value)}
                                                    label={context.counterpart('dashboard.addEnvironement.inputs.subdomains.placeholder')}
                                                    fullWidth />
                                            </Col>
                                            <Col xs="1">
                                                <Fab aria-label="delete" color='primary' onClick={() => setEnvironment({ ...environment, subdomains: [...environment.subdomains.filter((s, i) => i !== index)] })} style={{ transform: 'scale(0.7)' }} >
                                                    <DeleteIcon />
                                                </Fab>
                                            </Col>
                                        </Row>
                                    ))}
                                </Col>
                            </Row>
                        </Col>
                        <Col md="6">
                            <Row>
                                <Col md="12">
                                    <TextField id="Logo URL" label={context.counterpart("dashboard.environmentOverview.inputs.logo_url.title")} value={environment.logo_url} onChange={(e) => setEnvironment({ ...environment, logo_url: e.target.value })} fullWidth variant='outlined' />
                                </Col>
                                <Col md="12" style={{ paddingTop: "20px" }}>
                                    <TextareaAutosize
                                        minRows={7}
                                        value={environment.description}
                                        style={{ width: "100% ", padding: "10px", backgroundColor: colors.mainBackground[_mode], color: colors.menuText[_mode], border: "1px solid "+ colors.textAreaBorder[_mode], borderRadius: "3px" }}
                                        onChange={e => setEnvironment({ ...environment, description: e.target.value })}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '20px' }}>
                        <Col md="12" style={{ marginBottom: '20px' }}>
                            <h5 className={classes.labelName} style={{ color: colors.secondText[_mode] }}>
                                <Translate content="dashboard.environmentOverview.inputs.roles.title" />
                            </h5>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '20px' }}>
                        <Col md={{ offset: 2, size: 8 }}>
                            <DragDropList
                                roles={allRoles}
                                setUnselectedRoles={setUnselectedRoles}
                                unselectedRoles={unselectedRoles}
                                setSelectedRoles={setSelectedRoles}
                                selectedRoles={selectedRoles} />
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