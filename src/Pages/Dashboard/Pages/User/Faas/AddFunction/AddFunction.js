import React, {useContext, useState, useEffect} from 'react';
import { Col, Row, Container } from "reactstrap";
import classes from "./AddFunction.module.css";
import axios from "../../../../../../utils/axios";
import { isNotBlank } from "../../../../../../utils/common";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import LoadingSpinner from '../../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from '../../../../../../Context/Colors';
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IOSSwitch from '../../../../../../utils/iosswitch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { OutlinedInput, MenuItem, Select } from '@material-ui/core';
import BlocklyWorkspace from '../../../../../../Components/BlocklyWorkspace/BlocklyWorkspace';
import EditorModal from '../../../../../../Components/EditorModal/EditorModal';
import BlocklyModal from '../../../../../../Components/BlocklyModal/BlocklyModal';
import getSelectedProgrammingLanguage from '../../../../../../utils/language';
import EditorBox from '../../../../../../Components/EditorBox/EditorBox';
import WarningModal from '../../../../../../Components/WarningModal/WarningModal';

function AddFunction() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [withBlockly, setWithBlockly] = useState(false)
    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false)
    const [showBlocklyFullScreen, setShowBlocklyFullScreen] = useState(false)
    const [isPublic, setIsPublic] = useState(false)
    const [changesAreSaved, setChangesAreSaved] = useState(true)
    const [showWarningModal, setShowWarningModal] = useState(false)
    const [currentCode, setCurrentCode] = useState('')
    const [currentState, setCurrentState] = useState(null)
    const [languages, setLanguages] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState('')
    const [code, setCode] = useState('')
    const [blockly, setBlockly] = useState('')
    const [name, setName] = useState('')
    const [callback_url, setCallback_url] = useState('')
    const [callback_authorization_header, setCallback_authorization_header] = useState('')
    const [regexp, setRegexp] = useState('')
    const [args, setArgs] = useState([])
    const [finalArgs, setFinalArgs] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const nextPath = location.pathname === '/function/add' ? '/function/overview': '/admin/function'
    const message = context.counterpart("dashboard.function.message.unsavedChangesWarning")

    useEffect(() => {
        context.setIsGlobal(true)
        setLoading(true)
        axios.get('/faas/languages')
            .then(res => {
                setLanguages([...res.data.languages, "blockly"])
                setLoading(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        selectedLanguage !== "blockly" ? handleTemplate() : setWithBlockly(true)
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
        setLoadingSubmit(true)
        axios.post(`/faas/function`, {
            is_public: isPublic,
            content: {
                code: code,
                blockly: blockly,
                name: name,
                language: getSelectedProgrammingLanguage(selectedLanguage),
                callback_url: callback_url,
                callback_authorization_header: callback_authorization_header,
                regexp: regexp,
                args: args
            }
        }).then(response => {
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

    const updateArgHandler = (index, value) => {
        const updatedArgs = [...args];
        updatedArgs[index] = value;
        setArgs(updatedArgs);
    };

    const handleTypingFinished = () => {
        setFinalArgs(args.filter(arg => isNotBlank(arg)));
    };

    const handleDeleteArg = (index) => {
        const updatedArgs = [...args];
        updatedArgs.splice(index, 1);
        setArgs(updatedArgs);

        const updatedFinalArgs = [...finalArgs];
        updatedFinalArgs.splice(index, 1);
        setFinalArgs(updatedFinalArgs);
    };

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
                <WarningModal isOpen={showWarningModal} toggle={() => setShowWarningModal(!showWarningModal)} title="common.message.warning" message={message} buttonTitle="common.button.save" cancelbuttonTitle="common.button.return" onClick={handleWarningModalClickButton} loading={loadingSubmit} />
                <Row>
                    <Col>
                        <div onClick={navigateToNextPath} className={classes.goBack}>
                            <NavLink className={classes.link}>
                                <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                                <Translate content="dashboard.function.back" />
                            </NavLink>
                        </div>
                    </Col>
                </Row>
                <Container className={classes.container} fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                    <Row>
                        <Col className={classes.borderCol} style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                            <h5 className={classes.textTitle} style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.function.title.add" />
                            </h5>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
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
                                    <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.function.inputs.name.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                                </Col>
                                <Col md="6">
                                    <TextField id="function_name" label={context.counterpart('dashboard.function.inputs.name.placeholder')} onChange={(e) => setName(e.target.value)} required fullWidth />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
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
                                <Col md="4">
                                    <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.function.inputs.callback_url.title" />
                                    </h5>
                                </Col>
                                <Col md="6">
                                    <TextField id="callback_url" label={context.counterpart('dashboard.function.inputs.callback_url.placeholder')} onChange={(e) => setCallback_url(e.target.value)} fullWidth />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.function.inputs.callback_header.title" />
                                    </h5>
                                </Col>
                                <Col md="6">
                                    <TextField id="callback_authorization_header" label={context.counterpart('dashboard.function.inputs.callback_header.placeholder')} onChange={(e) => setCallback_authorization_header(e.target.value)} fullWidth />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ display: "flex", alignItems: "center", margin: "30px 0px" }}>
                        <Col md="4">
                            <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                <Translate content="dashboard.function.inputs.args.title" />
                            </h5>
                            <Fab color="primary" aria-label="add" onClick={() => setArgs([...args, ''])} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Col>
                        <Col md="6">
                            {args?.map((arg, index) => (
                                <Row key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col>
                                        <TextField
                                            style={{ marginTop: '10px' }}
                                            value={arg}
                                            onChange={(e) => updateArgHandler(index, e.target.value)}
                                            onBlur={handleTypingFinished}
                                            label={context.counterpart('dashboard.function.inputs.args.placeholder')}
                                            fullWidth />
                                    </Col>
                                    <Col xs="1">
                                        <Fab aria-label="delete" color='primary' onClick={() => handleDeleteArg(index)} style={{ transform: 'scale(0.7)' }} >
                                            <DeleteIcon className="whiteIcon" />
                                        </Fab>
                                    </Col>
                                </Row>
                            ))}
                        </Col>
                    </Row>
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md={{ size: 2 }}>
                                    <Row>
                                        <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
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
                                        args={finalArgs}
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
