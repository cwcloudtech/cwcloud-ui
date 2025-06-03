import React, { useContext, useState, useEffect } from 'react';
import { Spinner, Col, Row, Container } from "reactstrap";
import classes from "./FunctionOverview.module.css";
import '../../../../../../common.css';
import axios from "../../../../../../utils/axios";
import { isNotBlank } from "../../../../../../utils/common";
import { NavLink, useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingSpinner from '../../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from '../../../../../../Context/Colors';
import FormControlLabel from '@mui/material/FormControlLabel';
import IOSSwitch from '../../../../../../utils/iosswitch';
import formateDate from '../../../../../../utils/FormateDate';
import { OutlinedInput, MenuItem, Select } from '@material-ui/core';
import EditorModal from '../../../../../../Components/Modal/EditorModal';
import BlocklyWorkspace from '../../../../../../Components/BlocklyWorkspace/BlocklyWorkspace';
import BlocklyModal from '../../../../../../Components/Modal/BlocklyModal';
import { fileDownloadFromResponseWithName } from "../../../../../../utils/fileApiDownloader";
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import getSelectedProgrammingLanguage from '../../../../../../utils/language';
import EditorBox from '../../../../../../Components/EditorBox/EditorBox';
import WarningModal from '../../../../../../Components/Modal/WarningModal';
import EnvModal from '../../../../../../Components/Modal/InputModals/EnvVarModal';
import EnvTable from '../../../../../../Components/Table/EnvTable';
import ArgModal from '../../../../../../Components/Modal/InputModals/ArgModal';
import ArgTable from '../../../../../../Components/Table/ArgTable';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CallbackTable from '../../../../../../Components/Table/CallbackTable';
import CallbackModal from '../../../../../../Components/Modal/CallbackModal';

function FunctionOverview() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [withBlockly, setWithBlockly] = useState(false)
    const [openedBlockly, setOpenedBlockly] = useState(false)
    const [functionIsPublic, setFunctionIsPublic] = useState(false)
    const [changesAreSaved, setChangesAreSaved] = useState(false)
    const [showWarningModal, setShowWarningModal] = useState(false)
    const [showAddNewCallbackModal, setShowAddNewCallbackModal] = useState(false)
    const [showEditCallbackModal, setShowEditCallbackModal] = useState(false)
    const [showAddNewEnvModal, setShowAddNewEnvModal] = useState(false)
    const [showEditEnvModal, setshowEditEnvModal] = useState(false)
    const [showAddNewArgModal, setShowAddNewArgModal] = useState(false)
    const [showEditArgModal, setShowEditArgModal] = useState(false)

    const [selectedCallback, setSelectedCallback] = useState(null)
    const [selectedCallbackIndex, setSelectedCallbackIndex] = useState(0)
    const [selectedEnvVar, setSelectedEnvVar] = useState("")
    const [selectedEnvVarIndex, setSelectedEnvVarIndex] = useState(0)
    const [selectedArg, setSelectedArg] = useState("")
    const [selectedArgIndex, setSelectedArgIndex] = useState(0)

    const [functionCode, setFunctionCode] = useState('')
    const [functionName, setFunctionName] = useState('')
    const [functionBlockly, setFunctionBlockly] = useState('')
    const [functionRegexp, setFunctionRegexp] = useState('')
    const [functionCreatedAt, setFunctionCreatedAt] = useState('')
    // eslint-disable-next-line
    const [functionUpdatedAt, setFunctionUpdatedAt] = useState('')
    const [callbacks, setCallbacks] = useState([])
    const [envVars, setEnvVars] = useState([])
    const [args, setArgs] = useState([])
    const [languages, setLanguages] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState('')
    const [currentCode, setCurrentCode] = useState('')
    const [currentState, setCurrentState] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingExport, setLoadingExport] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const { id } = useParams()
    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false)
    const [showBlocklyFullScreen, setShowBlocklyFullScreen] = useState(false)
    const [functionIsProtected, setFunctionIsProtected] = useState(false)
    const message = context.counterpart("dashboard.function.message.unsavedChangesWarning")

    useEffect(() => {
        context.setIsGlobal(true)
        setLoading(true)
        axios.get('/faas/languages')
            .then(res => {
                setLanguages([...res.data.languages, "blockly"])
                axios.get(`/faas/function/${id}`)
                    .then(res => {
                        setFunctionIsPublic(res.data.is_public)
                        setFunctionIsProtected(res.data.is_protected)
                        setFunctionCode(res.data.content.code)
                        setFunctionName(res.data.content.name)
                        setFunctionBlockly(res.data.content.blockly)
                        setFunctionRegexp(res.data.content.regexp)
                        setFunctionCreatedAt(res.data.created_at)
                        setFunctionUpdatedAt(res.data.updated_at)
                        setCurrentCode(res.data.content.code)
                        setCallbacks(res.data.content.callbacks)
                        setArgs(res.data.content.args)
                        setSelectedLanguage(res.data.content.language)
                        if (isNotBlank(res.data.content.env)) {
                            var envVars = createEnvironmentVariablesArray(res.data.content.env)
                            setEnvVars(envVars)
                        }
                        if (isNotBlank(res.data.content.blockly)) {
                            setWithBlockly(true)
                            setOpenedBlockly(true)
                            setSelectedLanguage(selectedLanguage ? "python" : "blockly")
                            setCurrentState(JSON.parse(res.data.content.blockly))
                        }
                        setLoading(false)
                        setChangesAreSaved(true)
                    })
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!changesAreSaved) {
                (event || window.event).returnValue = message;
                return message;
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changesAreSaved]);

    const navigateBack = () => {
        if (!changesAreSaved) {
            setShowWarningModal(true)
        } else {
            navigate("/function/overview");
        }
    }

    const handleClickButton = () => {
        const env = {};
        envVars.forEach(obj => {
            env[obj.name] = obj.value;
        });
        setLoadingSubmit(true)
        axios.put(`/faas/function/${id}`, {
            id: id,
            is_public: functionIsPublic,
            content: {
                code: functionCode,
                blockly: functionBlockly,
                name: functionName,
                language: getSelectedProgrammingLanguage(selectedLanguage),
                callbacks: callbacks,
                regexp: functionRegexp,
                args: args,
                env: env
            }
        }).then(response => {
            setLoadingSubmit(false)
            setChangesAreSaved(true)
            toast.success(context.counterpart('dashboard.function.message.successUpdate'))
            navigate('/function/overview')
        }).catch(err => {
            setLoadingSubmit(false)
        })
    }

    const handleWarningModalClickButton = () => {
        setShowWarningModal(false)
        handleClickButton()
    }
    
    const handleChangeArg = (index, value) => {
        const updatedArgs = [...args];
        updatedArgs[index] = value;
        setArgs(updatedArgs);
    }

    const handleAddNewArg = () => {
        setArgs([...args, ''])
        setShowAddNewArgModal(true)
    }

    const handleEditArg = (index) => {
        const selectedArg = args[index]
        setShowEditArgModal(true)
        setSelectedArg(selectedArg)
        setSelectedArgIndex(index)
    };

    const handleDeleteArg = (index) => {
        const updatedArgs = [...args];
        updatedArgs.splice(index, 1);
        setArgs(updatedArgs);
    };

    const handleCodeAndStateChange = (newCode, newState) => {
        if (newState.error) {
            setOpenedBlockly(false);
            setWithBlockly(false);
            setSelectedLanguage('python');
            setFunctionBlockly('');
            return;
        }

        if (JSON.stringify(newState) !== JSON.stringify(currentState)) {
            setChangesAreSaved(false)
        }
        setCurrentCode(newCode)
        setCurrentState(newState)
        setFunctionCode(newCode)
        setFunctionBlockly(JSON.stringify(newState))
    }

    const exportFunctionHandler = () => {
        setLoadingExport(true)
        axios.get(`/faas/function/${id}/export`)
            .then(res => {
                fileDownloadFromResponseWithName(res, `${functionName}.json`, 'application/json')
                toast.success(context.counterpart('dashboard.function.message.successExport'))
                setLoadingExport(false)
            })
            .catch(err => {
                setLoadingExport(false)
            })
    }

    const createEnvironmentVariablesArray = (env) => {
        const envVarsArray = []
        for (const [name, value] of Object.entries(env)) {
            envVarsArray.push({ name: name, value: value, isHidden: true })
        }
        return envVarsArray
    }

    const handlAddNewEnvVariable = () => {
        setEnvVars([...envVars, { name: "", value: ""}])
        setShowAddNewEnvModal(true)
    }

    const handleDeleteEnVar = (index) => {
        const updatedEnvVars = [...envVars];
        updatedEnvVars.splice(index, 1);
        setEnvVars(updatedEnvVars);
    }

    const handleEditEnVar = (index) => {
        var selectedVariable = envVars[index]
        setshowEditEnvModal(true)
        setSelectedEnvVar(selectedVariable)
        setSelectedEnvVarIndex(index)
    }

    const handleChangeEnvVar = (index, key, value) => {
        const updatedEnvVars = [...envVars];
        updatedEnvVars[index].name = key;
        updatedEnvVars[index].value = value;
        setEnvVars(updatedEnvVars);
    }

    const handleAddNewCallback = () => {
        setCallbacks([...callbacks, { endpoint: "", type: "http"}])
        setShowAddNewCallbackModal(true)
    }

    const handleDeleteCallback = (index) => {
        const updatedCallbacks = [...callbacks]
        updatedCallbacks.splice(index, 1)
        setCallbacks(updatedCallbacks)
    }

    const handleEditCallback = (index) => {
        var selectedCallback = callbacks[index]
        setShowEditCallbackModal(true)
        setSelectedCallback(selectedCallback)
        setSelectedCallbackIndex(index)
    }

    const handleChangeCallback = (index, callback) => {
        const updatedCallbacks = [...callbacks]
        updatedCallbacks[index] = callback
        setCallbacks(updatedCallbacks)
    }

    if (loading)
        return <LoadingSpinner />
    else
        return (
            <div>
                <ArgModal title="dashboard.function.inputs.args.addModalTitle" isOpen={showAddNewArgModal} toggle={() => setShowAddNewArgModal(!showAddNewArgModal)} variable={args[args.length-1]} index={args.length-1} onClick={handleChangeArg} />
                <ArgModal title="dashboard.function.inputs.args.editModalTitle" isOpen={showEditArgModal} toggle={() => setShowEditArgModal(!showEditArgModal)} variable={selectedArg} index={selectedArgIndex} onClick={handleChangeArg} />
                <EnvModal title="dashboard.function.inputs.env_vars.addModalTitle" isOpen={showAddNewEnvModal} toggle={() => setShowAddNewEnvModal(!showAddNewEnvModal)} variable={envVars[envVars.length-1]} index={envVars.length-1} onClick={handleChangeEnvVar} />
                <EnvModal title="dashboard.function.inputs.env_vars.editModalTitle" isOpen={showEditEnvModal} toggle={() => setshowEditEnvModal(!showEditEnvModal)} variable={selectedEnvVar} index={selectedEnvVarIndex} onClick={handleChangeEnvVar}/>
                <CallbackModal title="dashboard.function.inputs.callbacks.addModalTitle" isOpen={showAddNewCallbackModal} toggle={() => setShowAddNewCallbackModal(!showAddNewCallbackModal)} callback={callbacks[callbacks.length-1]} index={callbacks.length-1} onClick={handleChangeCallback} />
                <CallbackModal title="dashboard.function.inputs.callbacks.editModalTitle" isOpen={showEditCallbackModal} toggle={() => setShowEditCallbackModal(!showEditCallbackModal)} callback={selectedCallback} index={selectedCallbackIndex} onClick={handleChangeCallback} />
                <WarningModal title="common.message.warning" isOpen={showWarningModal} toggle={() => setShowWarningModal(!showWarningModal)} message={message} loading={loadingSubmit} nextPath="/function/overview" buttonTitle="common.button.save" secondButtonTitle="common.button.unsave" onClick={handleWarningModalClickButton} />
                <Row>
                    <Col>
                        <div onClick={navigateBack} className="goBack">
                            <NavLink className="link fs-6">
                                <i className="fa-solid fa-arrow-left iconStyle"></i>
                                <Translate content="dashboard.function.back" />
                            </NavLink>
                        </div>
                    </Col>
                </Row>
                <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                    <Row>
                        <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                            <h5 className='textTitle' style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.function.title.overview" />
                            </h5>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <h4 className="createdStyle" style={{color: colors.smallTitle[_mode]}}>
                                    <Translate content="dashboard.table.createdAt" /> : {formateDate(functionCreatedAt)}
                                </h4>
                                <div 
                                    style={{ 
                                        marginLeft: "15px",
                                        padding: "3px 10px", 
                                        borderRadius: "16px",
                                        backgroundColor: functionIsProtected ? "#4caf50" : "#f50057", 
                                        color: "#fff",
                                        fontSize: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        height: "24px"
                                    }}
                                >
                                    <i className={`fa-solid ${functionIsProtected ? "fa-lock" : "fa-lock-open"}`} style={{ marginRight: "5px" }}></i>
                                    <Translate content={functionIsProtected ? "dashboard.function.is_protected" : "dashboard.function.is_unprotected"} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <LoadingButton loading={loadingExport} onClick={exportFunctionHandler}>Export</LoadingButton>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.function.inputs.language.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                                </Col>
                                <Col md="6">
                                    <Select
                                        id="function_language"
                                        value={selectedLanguage || 'none'}
                                        onChange={(e) => {
                                            setSelectedLanguage(e.target.value)
                                            var blocklyTurnedOn = selectedLanguage === "blockly" ? true : false
                                            setWithBlockly(blocklyTurnedOn)
                                            setOpenedBlockly(blocklyTurnedOn)
                                        }}
                                        input={<OutlinedInput label="Name" />}
                                        required 
                                        fullWidth
                                    >
                                        {languages.map(language => (
                                            <MenuItem
                                                key={language}
                                                value={language}
                                            >
                                                {language}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.function.inputs.name.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                                </Col>
                                <Col md="6">
                                    <TextField id="function_name" label={context.counterpart('dashboard.function.inputs.name.placeholder')} onChange={(e) => setFunctionName(e.target.value)} value={functionName} required fullWidth />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.function.inputs.regexp.title" />
                                    </h5>
                                </Col>
                                <Col md="6">
                                    <TextField id="function_regexp" label={context.counterpart('dashboard.function.inputs.regexp.placeholder')} onChange={(e) => setFunctionRegexp(e.target.value)} value={functionRegexp} required fullWidth />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md={{ size: 2 }}>
                                    <Row>
                                        <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                            <Translate content="dashboard.function.is_public" />
                                            <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                        </h5>
                                        <FormControlLabel
                                            checked={functionIsPublic}
                                            control={<IOSSwitch sx={{ m: 1 }} />}
                                            onChange={
                                                (e) => {
                                                    setFunctionIsPublic(e.target.checked)
                                                }
                                            } />
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Translate content="dashboard.function.inputs.args.title" />
                        </AccordionSummary>
                        <AccordionDetails>
                            <ArgTable
                                args={args}
                                addNewArg={handleAddNewArg}
                                editArg={handleEditArg}
                                deleteArg={handleDeleteArg}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Translate content="dashboard.function.inputs.env_vars.title" />
                        </AccordionSummary>
                        <AccordionDetails>
                            <EnvTable
                                envVars={envVars}
                                addNewEnvVar={handlAddNewEnvVariable}
                                deleteEnvVar={handleDeleteEnVar}
                                editEnvVar={handleEditEnVar} 
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Translate content="dashboard.function.inputs.callbacks.title" />
                        </AccordionSummary>
                        <AccordionDetails>
                            <CallbackTable
                                callbacks={callbacks}
                                addNewCallback={handleAddNewCallback}
                                editCallback={handleEditCallback}
                                deleteCallback={handleDeleteCallback}
                            />
                        </AccordionDetails>
                    </Accordion>
                    {
                       (selectedLanguage === "blockly") && (
                        <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", marginTop: "10px" }}>
                            <div style={{width: "fit-content"}}>
                                <div className="toggleContainer" style={{ backgroundColor: colors.secondBackground[_mode], border: "1px solid "+colors.border[_mode], color: colors.mainText[_mode] }}>
                                    <div
                                        className={openedBlockly? "activeToggleItemContainer": "toggleItemContainer"}
                                        onClick={() => setOpenedBlockly(true)}>
                                        <h5 className="toggleItemText">
                                            <Translate content="dashboard.function.state.lowCode.title" />
                                        </h5>
                                    </div>
                                    <div
                                        className={!openedBlockly? "activeToggleItemContainer": "toggleItemContainer"}
                                        onClick={() => setOpenedBlockly(false)}>
                                        <h5 className="toggleItemText">
                                            <Translate content="dashboard.function.inputs.code.title" />
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </Row>
                       )
                    }
                    <Row className={classes.rowContainer} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '20px', marginTop: "30px" }}>
                        {
                            (selectedLanguage === "blockly" && openedBlockly) ?
                            (
                                <Col md="12">
                                    <BlocklyWorkspace
                                        handleFullScreen={() => setShowBlocklyFullScreen(true)}
                                        showBlocklyFullScreen={false}
                                        key={`blockly-workspace-${showBlocklyFullScreen}`}
                                        code={currentCode}
                                        args={args}
                                        state={currentState}
                                        _mode={_mode}
                                        onWorkspaceChange={
                                            (generatedCode, newState) => {
                                                handleCodeAndStateChange(generatedCode, newState)
                                            }
                                        }
                                    />
                                    <BlocklyModal
                                        isOpen={showBlocklyFullScreen}
                                        showBlocklyFullScreen={showBlocklyFullScreen}
                                        toggle={() => setShowBlocklyFullScreen(!showBlocklyFullScreen)}
                                        code={currentCode}
                                        state={currentState}
                                        _mode={_mode}
                                        onWorkspaceChange={ (generatedCode, state) => {
                                               handleCodeAndStateChange(generatedCode, state)
                                            }
                                        }
                                    />
                                </Col>
                            ): 
                            (
                                <div>
                                    <Col md="12">
                                        <EditorBox
                                            title={context.counterpart('dashboard.function.inputs.code.title')}
                                            textToCopy={functionCode}
                                            handleFullScreen={() => setShowEditorFullScreen(true)}
                                            language={getSelectedProgrammingLanguage(selectedLanguage)}
                                            value={currentCode}
                                            defaultValue=""
                                            onChange={v => {setFunctionCode(v);setCurrentCode(v);setChangesAreSaved(false)}}
                                        />
                                        <EditorModal
                                            isOpen={showEditorFullScreen}
                                            toggle={() => setShowEditorFullScreen(!showEditorFullScreen)}
                                            language={getSelectedProgrammingLanguage(selectedLanguage)}
                                            value={currentCode}
                                            onChange={v => {setFunctionCode(v);setCurrentCode(v);setChangesAreSaved(false)}}
                                        />
                                    </Col>
                                </div>
                            )
                        }
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

export default FunctionOverview
