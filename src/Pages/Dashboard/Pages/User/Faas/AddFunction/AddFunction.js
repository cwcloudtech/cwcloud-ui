import React, {useContext, useState, useEffect} from 'react';
import { Col, Row, Container } from "reactstrap";
import classes from "./AddFunction.module.css";
import '../../../../../../common.css';
import axios from "../../../../../../utils/axios";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import LoadingSpinner from '../../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from '../../../../../../Context/Colors';
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import IOSSwitch from '../../../../../../utils/iosswitch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { OutlinedInput, MenuItem, Select } from '@material-ui/core';
import BlocklyWorkspace from '../../../../../../Components/BlocklyWorkspace/BlocklyWorkspace';
import EditorModal from '../../../../../../Components/Modal/EditorModal';
import BlocklyModal from '../../../../../../Components/Modal/BlocklyModal';
import getSelectedProgrammingLanguage from '../../../../../../utils/language';
import EditorBox from '../../../../../../Components/EditorBox/EditorBox';
import WarningModal from '../../../../../../Components/Modal/WarningModal';
import EnvModal from '../../../../../../Components/Modal/EnvVarModal';
import ArgModal from '../../../../../../Components/Modal/ArgModal';
import EnvTable from '../../../../../../Components/Table/EnvTable';
import ArgTable from '../../../../../../Components/Table/ArgTable';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CallbackModal from '../../../../../../Components/Modal/CallbackModal';
import CallbackTable from '../../../../../../Components/Table/CallbackTable';
import SuggestionsAutoComplete from '../../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete';

function AddFunction() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [withBlockly, setWithBlockly] = useState(false)
    const [users, setUsers] = useState([])

    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false)
    const [showBlocklyFullScreen, setShowBlocklyFullScreen] = useState(false)
    const [changesAreSaved, setChangesAreSaved] = useState(true)
    const [showWarningModal, setShowWarningModal] = useState(false)
    const [showAddNewEnvModal, setShowAddNewEnvModal] = useState(false)
    const [showEditEnvModal, setShowEditEnvModal] = useState(false)
    const [showAddNewArgModal, setShowAddNewArgModal] = useState(false)
    const [showEditArgModal, setShowEditArgModal] = useState(false)
    const [showAddNewCallbackModal, setShowAddNewCallbackModal] = useState(false)
    const [showEditCallbackModal, setShowEditCallbackModal] = useState(false)

    const [selectedEnvVar, setSelectedEnvVar] = useState(null)
    const [selectedEnvVarIndex, setSelectedEnvVarIndex] = useState(0)
    const [selectedArg, setSelectedArg] = useState("")
    const [selectedArgIndex, setSelectedArgIndex] = useState(0)
    const [selectedCallback, setSelectedCallback] = useState(null)
    const [selectedCallbackIndex, setSelectedCallbackIndex] = useState(0)
    
    const [isPublic, setIsPublic] = useState(false)
    const [ownerId, setOwnerId] = useState(context.user.id)
    const [currentCode, setCurrentCode] = useState('')
    const [currentState, setCurrentState] = useState(null)
    const [languages, setLanguages] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState('')
    const [code, setCode] = useState('')
    const [blockly, setBlockly] = useState('')
    const [name, setName] = useState('')
    const [regexp, setRegexp] = useState('')
    const [callbacks, setCallbacks] = useState([])
    const [args, setArgs] = useState([])
    const [envVars, setEnvVars] = useState([])

    const navigate = useNavigate()
    const location = useLocation()
    const [nextPath, setNextPath] = useState("/function/overview")
    const is_admin = location.pathname.includes("admin");
    const message = context.counterpart("dashboard.function.message.unsavedChangesWarning")
    const defaultBlock= {"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defreturn","id":"|U:JxK,WwHD$^.P_JKyp","x":10,"y":10,"icons":{"comment":{"text":"Describe this function...","pinned":false,"height":80,"width":160}},"fields":{"NAME":"handle"},"inputs":{"RETURN":{"block":{"type":"text","id":"[zf7d#G}*e9tM4;qKep[","fields":{"TEXT":""}}}}}]}}

    const getNextPath = () => {
        if (location.pathname === '/admin/function/add') {
            setNextPath('/admin/function/overview')
        }
    }

    const fetchUsers = () => {
        axios.get("/admin/user/all")
            .then(res => {
                setUsers(res.data.result)
            })
            .catch(err => {
                console.error(err)
            })
    }

    useEffect(() => {
        getNextPath()
        context.setIsGlobal(true)
        setLoading(true)
        if (is_admin) {
            fetchUsers()
        }
        axios.get('/faas/languages')
            .then(res => {
                setLanguages([...res.data.languages, "blockly"])
                setLoading(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        selectedLanguage !== "blockly" ? handleTemplate() : handleBlocklyTemplate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [args, selectedLanguage]);

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

    const navigateToNextPath = () => {
        if (!changesAreSaved) {
            setShowWarningModal(true)
        } else {
            navigate(nextPath);
        }
    }

    const handleClickButton = () => {
        const env = {};
        envVars.forEach(obj => {
            env[obj.name] = obj.value;
        });
        setLoadingSubmit(true)
        var body = {
            is_public: isPublic,
            content: {
                code: code,
                blockly: blockly,
                name: name,
                language: getSelectedProgrammingLanguage(selectedLanguage),
                regexp: regexp,
                callbacks: callbacks,
                args: args,
                env: env
            }
        }
        if (is_admin) {
            body.owner_id = ownerId
        }
        axios.post(`/faas/function`, body).then(response => {
            setLoadingSubmit(false)
            setChangesAreSaved(true)
            toast.success(context.counterpart('dashboard.function.message.successAdd'))
            navigate(nextPath)
        }).catch(err => {
            setLoadingSubmit(false)
        })
    }

    const handleWarningModalClickButton = () => {
        setShowWarningModal(false)
        handleClickButton()
    }
    
    const handleTemplate = () => {
        if (args && selectedLanguage) {
            const requestBody = {
                args: args,
                language: selectedLanguage
            };
        
            axios.post(`/faas/template`, requestBody)
            .then(response => {
                setCode(response.data.template)
                setCurrentCode(response.data.template)
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    const handleBlocklyTemplate = () => {
        setWithBlockly(true)
        setCurrentState(defaultBlock)
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

    const handleDeleteArg = (index) => {
        const updatedArgs = [...args];
        updatedArgs.splice(index, 1);
        setArgs(updatedArgs);
    };

    const handleEditArg = (index) => {
        var selectedArg = args[index]
        setShowEditArgModal(true)
        setSelectedArg(selectedArg)
        setSelectedArgIndex(index)
    }

    const handlAddNewEnvVariable = () => {
        setEnvVars([...envVars, { name: "", value: ""}])
        setShowAddNewEnvModal(true)
    }

    const handleDeleteEnvVariable = (index) => {
        const updatedEnvVars = [...envVars];
        updatedEnvVars.splice(index, 1);
        setEnvVars(updatedEnvVars);
    }

    const handleEditEnvVariable = (index) => {
        var selectedVariable = envVars[index]
        setShowEditEnvModal(true)
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

    const handleCodeAndStateChange = (newCode, newState) => {
        setCurrentCode(newCode)
        setCurrentState(newState)
        setCode(newCode)
        setBlockly(JSON.stringify(newState))
    }

    if (loading)
        return <LoadingSpinner />
    else
        return (
            <div>
                <ArgModal title="dashboard.function.inputs.args.addModalTitle" isOpen={showAddNewArgModal} toggle={() => setShowAddNewArgModal(!showAddNewArgModal)} variable={args[args.length-1]} index={args.length-1} onClick={handleChangeArg} />
                <ArgModal title="dashboard.function.inputs.args.editModalTitle" isOpen={showEditArgModal} toggle={() => setShowEditArgModal(!showEditArgModal)} variable={selectedArg} index={selectedArgIndex} onClick={handleChangeArg} />
                <EnvModal title="dashboard.function.inputs.env_vars.addModalTitle" isOpen={showAddNewEnvModal} toggle={() => setShowAddNewEnvModal(!showAddNewEnvModal)} variable={envVars[envVars.length-1]} index={envVars.length-1} onClick={handleChangeEnvVar} />
                <EnvModal title="dashboard.function.inputs.env_vars.editModalTitle" isOpen={showEditEnvModal} toggle={() => setShowEditEnvModal(!showEditEnvModal)} variable={selectedEnvVar} index={selectedEnvVarIndex} onClick={handleChangeEnvVar}/>
                <CallbackModal title="dashboard.function.inputs.callbacks.addModalTitle" isOpen={showAddNewCallbackModal} toggle={() => setShowAddNewCallbackModal(!showAddNewCallbackModal)} callback={callbacks[callbacks.length-1]} index={callbacks.length-1} onClick={handleChangeCallback} />
                <CallbackModal title="dashboard.function.inputs.callbacks.editModalTitle" isOpen={showEditCallbackModal} toggle={() => setShowEditCallbackModal(!showEditCallbackModal)} callback={selectedCallback} index={selectedCallbackIndex} onClick={handleChangeCallback} />
                <WarningModal title="common.message.warning" isOpen={showWarningModal} toggle={() => setShowWarningModal(!showWarningModal)} message={message} loading={loadingSubmit} nextPath={nextPath} buttonTitle="common.button.save" secondButtonTitle="common.button.unsave" onClick={handleWarningModalClickButton} />
                <Row>
                    <Col>
                        <div onClick={navigateToNextPath} className="goBack">
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
                            <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.function.title.add" />
                            </h5>
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
                                    <TextField id="function_name" label={context.counterpart('dashboard.function.inputs.name.placeholder')} onChange={(e) => setName(e.target.value)} required fullWidth />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {
                        is_admin && (
                            <Row style={{ margin: "30px 0px" }}>
                                <Col>
                                    <Row style={{ display: "flex", alignItems: "center" }}>
                                        <Col md="4">
                                            <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                                <Translate content="dashboard.function.inputs.owner.title" />
                                            </h5>
                                        </Col>
                                        <Col md="6">
                                            <SuggestionsAutoComplete
                                                id="combo-box-email"
                                                onChange={(event, newValue) => {
                                                    const selectedOwnerEmail = newValue
                                                    const selectedOwner = users.find(u => u.email === selectedOwnerEmail)
                                                    setOwnerId(selectedOwner.id)
                                                }}
                                                options={users.map((u) => u.email)}
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={context.counterpart('dashboard.function.inputs.owner.placeholder')}
                                                />
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        )
                    }
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.function.inputs.regexp.title" />
                                    </h5>
                                </Col>
                                <Col md="6">
                                    <TextField id="function_regexp" label={context.counterpart('dashboard.function.inputs.regexp.placeholder')} onChange={(e) => setRegexp(e.target.value)} required fullWidth />
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
                                            control={<IOSSwitch sx={{ m: 1 }} />}
                                            onChange={
                                                (e) => {
                                                    setIsPublic(e.target.checked)
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
                                editEnvVar={handleEditEnvVariable}
                                deleteEnvVar={handleDeleteEnvVariable}
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
                       (selectedLanguage === "blockly" ) && (
                        <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", marginTop: "10px" }}>
                            <div style={{width: "fit-content"}}>
                                <div className="toggleContainer" style={{ backgroundColor: colors.secondBackground[_mode], border: "1px solid "+colors.border[_mode], color: colors.mainText[_mode] }}>
                                    <div
                                        className={withBlockly? "activeToggleItemContainer": "toggleItemContainer"}
                                        onClick={() => setWithBlockly(true)}>
                                        <h5 className="toggleItemText">
                                            <Translate content="dashboard.function.state.lowCode.title" />
                                        </h5>
                                    </div>
                                    <div
                                        className={!withBlockly? "activeToggleItemContainer": "toggleItemContainer"}
                                        onClick={() => setWithBlockly(false)}>
                                        <h5 className="toggleItemText">
                                            <Translate content="dashboard.function.inputs.code.title" />
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </Row>
                       )
                    }
                    <Row className={classes.rowContainer} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '20px' }}>
                        {
                            (withBlockly && (selectedLanguage === "blockly")) ?
                            (
                                <Col md="12">
                                    <BlocklyWorkspace
                                        handleFullScreen={() => setShowBlocklyFullScreen(true)}
                                        showBlocklyFullScreen={false}
                                        key={`blockly-workspace-${showBlocklyFullScreen}`}
                                        code={currentCode}
                                        state={currentState}
                                        args={args}
                                        _mode={_mode}
                                        onWorkspaceChange={ (generatedCode, state) => {
                                               setChangesAreSaved(false);
                                               handleCodeAndStateChange(generatedCode, state)
                                            }
                                        }
                                    />
                                    <BlocklyModal
                                        isOpen={showBlocklyFullScreen}
                                        toggle={() => setShowBlocklyFullScreen(!showBlocklyFullScreen)}
                                        code={currentCode}
                                        state={currentState}
                                        _mode={_mode}
                                        onWorkspaceChange={ (generatedCode, state) => {
                                               setChangesAreSaved(false);
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
                                            textToCopy={code}
                                            handleFullScreen={() => setShowEditorFullScreen(true)}
                                            language={getSelectedProgrammingLanguage(selectedLanguage)}
                                            value={currentCode}
                                            defaultValue=""
                                            onChange={v => {setCode(v);setCurrentCode(v);setChangesAreSaved(false);}} />
                                        <EditorModal
                                            isOpen={showEditorFullScreen}
                                            toggle={() => setShowEditorFullScreen(!showEditorFullScreen)}
                                            language={getSelectedProgrammingLanguage(selectedLanguage)}
                                            value={currentCode}
                                            onChange={v => {setCode(v);setCurrentCode(v);setChangesAreSaved(false);}}
                                        />
                                    </Col>
                                </div>
                            )
                        }
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

export default AddFunction
