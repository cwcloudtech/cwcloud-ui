import { FormControlLabel, FormGroup, MenuItem, OutlinedInput, Select, Switch } from '@material-ui/core';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import { Col, Container, Input, Row } from "reactstrap";
import EditorBox from '../../../../../../Components/EditorBox/EditorBox';
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import CallbackModal from '../../../../../../Components/Modal/CallbackModal';
import EditorModal from '../../../../../../Components/Modal/EditorModal';
import HttpHeaderModal from '../../../../../../Components/Modal/InputModals/HeadersModal';
import SuggestionsAutoComplete from '../../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete';
import CallbackTable from '../../../../../../Components/Table/CallbackTable';
import HttpHeadersTable from '../../../../../../Components/Table/HeadersTable';
import colors from '../../../../../../Context/Colors';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from '../../../../../../utils/axios';
import { field_from_input_name } from '../../../../../../utils/monitor';

const AddMonitor = () => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const location = useLocation()
    const navigate = useNavigate();
    const currentPath = location.pathname
    const is_admin = currentPath.includes("admin")
    const nextPath = is_admin ? "/admin/monitors" : "/monitors"
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [showAddNewHeaderModal, setShowAddNewHeaderModal] = useState(false);
    const [showEditHeaderModal, setShowEditHeaderModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false);
    const [showAddNewCallbackModal, setShowAddNewCallbackModal] = useState(false);
    const [showEditCallbackModal, setShowEditCallbackModal] = useState(false);

    const [selectedHeader, setSelectedHeader] = useState(null);
    const [selectedHeaderIndex, setSelectedHeaderIndex] = useState(0);
    const [selectedCallback, setSelectedCallback] = useState(null);
    const [selectedCallbackIndex, setSelectedCallbackIndex] = useState(0);

    const [notifyOnlyForFailures, setNotifyOnlyForFailures] = useState(true);
    const [headers, setHeaders] = useState([]);
    const [callbacks, setCallbacks] = useState([])
    const [monitor, setMonitor] = useState({
        type: 'HTTP',
        name: '',
        family: '',
        url: '',
        method: 'GET',
        expected_http_code: "20*",
        body: '',
        expected_contain: '',
        timeout: 30,
        username: '',
        password: '',
        headers: [],
        callbacks: [],
        check_tls: true,
        level: 'DEBUG',
        ...(is_admin && { user_id: 0 })
    });
    const [users, setUsers] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMonitor(prev => ({
            ...prev,
            [field_from_input_name(name)]: value
        }));
    };

    const addNewHeader = () => {
        const newHeaders = [...headers, { name: "", value: "" }];
        setHeaders(newHeaders);
        setMonitor(prev => ({
            ...prev,
            headers: newHeaders
        }));
        setShowAddNewHeaderModal(true);
    };

    const editHeader = (index) => {
        var selectedVariable = headers[index];
        setShowEditHeaderModal(true);
        setSelectedHeader(selectedVariable)
        setSelectedHeaderIndex(index);
    };
    
    const deleteHeader = (index) => {
        const newHeaders = [...headers];
        newHeaders.splice(index, 1);
        setHeaders(newHeaders);
        setMonitor(prev => ({
            ...prev,
            headers: newHeaders
        }));
    };

    const handleChangeHeader = (index, key, value) => {
        const updatedHeaders = [...headers];
        updatedHeaders[index].name = key;
        updatedHeaders[index].value = value;
        setHeaders(updatedHeaders);
        setMonitor(prev => ({
            ...prev,
            headers: updatedHeaders
        }));
    };

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

    useEffect(() => {
        if (is_admin) {
            axios.get("/admin/user/all")
                .then(response => {
                    setUsers(response.data.result);
                })
                .catch(error => {
                    toast.error(error.response?.data?.message || context.counterpart("common.message.errorFetchingUsers"));
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_admin]);

    useEffect(() => {
        setMonitor(prev => ({
            ...prev,
            headers: headers
        }));
    }, [headers]);

    useEffect(() => {
        setMonitor(prev => ({
            ...prev,
            callbacks: callbacks
        }));
    }, [callbacks]);

    const handleSubmit = () => {
        if (!monitor.name || !monitor.url) {
            toast.error(context.counterpart("dashboard.monitor.message.nameAndUrlRequired"));
            return;
        }
        if (is_admin && !monitor.user_id) {
            toast.error(context.counterpart("dashboard.monitor.message.userRequired"));
            return;
        }

        if (monitor.type === "TCP") {
            delete monitor.expected_http_code;
        }

        monitor.level = notifyOnlyForFailures ? "DEBUG" : "INFO"

        const submissionData = {
            ...monitor,
            type: monitor.type.toLowerCase()
        };

        setLoadingSubmit(true);
        var api_url = is_admin ? "/admin/monitor" : "/monitor"
        axios.post(api_url, submissionData)
            .then(response => {
                setLoadingSubmit(false);
                toast.success(context.counterpart("dashboard.monitor.message.monitorCreated"));
                navigate(nextPath);
            })
            .catch(error => {
                setLoadingSubmit(false);
                toast.error(error.response?.data?.message || context.counterpart("dashboard.monitor.message.errorCreatingMonitor"));
            });
    };

    return (
        <div>
            <HttpHeaderModal
                title='dashboard.monitor.inputs.headers.addHeader'
                isOpen={showAddNewHeaderModal}
                toggle={() => setShowAddNewHeaderModal(!showAddNewHeaderModal)}
                variable={headers[headers.length - 1]}
                index={headers.length - 1}
                onClick={handleChangeHeader}
            />
            <HttpHeaderModal
                title='dashboard.monitor.inputs.headers.editHeader'
                isOpen={showEditHeaderModal}
                toggle={() => setShowEditHeaderModal(!showEditHeaderModal)}
                variable={selectedHeader}
                index={selectedHeaderIndex}
                onClick={handleChangeHeader}
            />
            <CallbackModal
                title="dashboard.function.inputs.callbacks.addModalTitle"
                isOpen={showAddNewCallbackModal}
                toggle={() => setShowAddNewCallbackModal(!showAddNewCallbackModal)}
                callback={callbacks[callbacks.length-1]}
                index={callbacks.length-1}
                isMonitor
                onClick={handleChangeCallback} />
            <CallbackModal 
                title="dashboard.function.inputs.callbacks.editModalTitle"
                isOpen={showEditCallbackModal}
                toggle={() => setShowEditCallbackModal(!showEditCallbackModal)}
                callback={selectedCallback}
                index={selectedCallbackIndex}
                isMonitor
                onClick={handleChangeCallback}
            />
            <Row>
                <Col>
                    <div onClick={() => navigate(nextPath)} className="goBack">
                        <NavLink className="link fs-6">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.monitor.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                <Row>
                    <Col className="border-bottom pb-2 mb-4" style={{borderColor: colors.bottomShaddow[_mode]}}>
                        <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                            <Translate content="dashboard.monitor.addNewMonitor" />
                        </h5>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.monitor.inputs.type.title" />
                                </h5>
                            </Col>
                            <Col md="6">
                                <Select
                                    id="monitor_type"
                                    name="monitor_type"
                                    value={monitor.type}
                                    onChange={handleInputChange}
                                    input={<OutlinedInput label="Type" />} 
                                    fullWidth
                                >
                                    <MenuItem value="HTTP">HTTP</MenuItem>
                                    <MenuItem value="TCP">TCP</MenuItem>
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    monitor.type === "HTTP" && 
                    <Row style={{ margin: "30px 0px" }}>
                        <Col>
                            <Row style={{ display: "flex", alignItems: "center" }}>
                                <Col md="4">
                                    <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                        <Translate content="dashboard.monitor.inputs.method.title" />
                                    </h5>
                                </Col>
                                <Col md="6">
                                    <Select
                                        id="monitor_method"
                                        name="monitor_method"
                                        value={monitor.method}
                                        onChange={handleInputChange}
                                        input={<OutlinedInput label="Name" />} 
                                        fullWidth
                                    >
                                        <MenuItem value="GET">GET</MenuItem>
                                        <MenuItem value="POST">POST</MenuItem>
                                        <MenuItem value="PUT">PUT</MenuItem>
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                }
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.monitor.inputs.name.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                            </Col>
                            <Col md="6">
                                <TextField 
                                    id="monitor_name"
                                    name="monitor_name"
                                    label={context.counterpart('dashboard.monitor.inputs.name.placeholder')}
                                    onChange={handleInputChange}
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
                                    <Translate content="dashboard.monitor.inputs.url.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField 
                                    id="monitor_url"
                                    name="monitor_url"
                                    label={context.counterpart('dashboard.monitor.inputs.url.placeholder')}
                                    onChange={handleInputChange}
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
                                    <Translate content="dashboard.monitor.inputs.family.title" />
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField 
                                    id="monitor_family"
                                    name="monitor_family"
                                    autoComplete='new-family'
                                    label={context.counterpart('dashboard.monitor.inputs.family.placeholder')}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                { is_admin && (
                        <Row style={{ margin: "30px 0px" }}>
                            <Col>
                                <Row style={{ display: "flex", alignItems: "center" }}>
                                    <Col md="4">
                                        <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                            <Translate content="dashboard.monitor.inputs.owner.title" />
                                            <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                        </h5>
                                    </Col>
                                    <Col md="6">
                                    <SuggestionsAutoComplete
                                        id="combo-box-email"
                                        onChange={(event, newValue) => {
                                            const selectedUserObj = users.find(u => u.email === newValue);
                                            setMonitor(prev => ({
                                                ...prev,
                                                user_id: selectedUserObj ? selectedUserObj.id : 0
                                            }));
                                        }}
                                        options={users.map((u) => u.email)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={context.counterpart('dashboard.monitor.inputs.owner.placeholder')}
                                            />
                                        )}
                                    />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )
                }
                { monitor.method === "POST" || monitor.method === "PUT" ? (
                        <Row style={{ margin: "30px 0px" }}>
                            <Col md="12" >
                                <EditorBox
                                    title={context.counterpart('dashboard.monitor.inputs.body.title')}
                                    textToCopy={monitor.body || ''}
                                    handleFullScreen={() => setShowEditorFullScreen(true)}
                                    language="json"
                                    value={monitor.body || ''}
                                    onChange={v => setMonitor({ ...monitor, body: v })} 
                                />
                                <EditorModal
                                    isOpen={showEditorFullScreen}
                                    toggle={() => setShowEditorFullScreen(!showEditorFullScreen)}
                                    language="json"
                                    value={monitor.body || ''}
                                    onChange={v => setMonitor({ ...monitor, body: v })}
                                />
                            </Col>
                        </Row>
                    ) : null
                }
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Translate content="dashboard.monitor.inputs.requestConfiguration.title" />
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            monitor.type === "HTTP" &&
                            <>
                                <Row style={{ margin: "30px 0px" }}>
                                    <Col>
                                        <Row style={{ display: "flex", alignItems: "center" }}>
                                            <Col md="4">
                                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                                    <Translate content="dashboard.monitor.inputs.expectedHttpCode.title" />
                                                </h5>
                                            </Col>
                                            <Col md="6">
                                                <TextField
                                                    id="monitor_expected_http_code"
                                                    name="monitor_expected_http_code"
                                                    value={monitor.expected_http_code}
                                                    label={context.counterpart('dashboard.monitor.inputs.expectedHttpCode.placeholder')}
                                                    onChange={handleInputChange}
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
                                                    <Translate content="dashboard.monitor.inputs.expectedContain.title" />
                                                </h5>
                                            </Col>
                                            <Col md="6">
                                                <TextField
                                                    id="monitor_expected_contain"
                                                    name="monitor_expected_contain"
                                                    label={context.counterpart('dashboard.monitor.inputs.expectedContain.placeholder')}
                                                    value={monitor.expected_contain}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        }
                        <Row style={{ margin: "30px 0px" }}>
                            <Col>
                                <Row style={{ display: "flex", alignItems: "center" }}>
                                    <Col md="4">
                                        <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                            <Translate content="dashboard.monitor.inputs.timeout.title" />
                                        </h5>
                                    </Col>
                                    <Col md="6">
                                        <Input
                                            type="number"
                                            name="timeout"
                                            value={monitor.timeout}
                                            onChange={handleInputChange}
                                            style={{ background: 'transparent', color: _mode === 'light' ? 'black' : 'white' }} 
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
                                            <Translate content="dashboard.monitor.inputs.logLevel.title" />
                                        </h5>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={notifyOnlyForFailures}/>
                                                }
                                                onChange={(e) => {
                                                    setNotifyOnlyForFailures(e.target.checked)
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            monitor.type === "HTTP" &&
                            <Row style={{ margin: "30px 0px" }}>
                                <Col>
                                    <Row style={{ display: "flex", alignItems: "center" }}>
                                        <Col md="4">
                                            <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                                <Translate content="dashboard.monitor.inputs.checkTls.title" />
                                            </h5>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch checked={monitor.check_tls}/>
                                                    }
                                                    onChange={(e) => {
                                                        setMonitor(prev => ({
                                                            ...prev,
                                                            check_tls: e.target.checked
                                                        }));
                                                    }}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        }
                    </AccordionDetails>
                </Accordion>
                {
                    monitor.type === "HTTP" &&
                    <>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Translate content="dashboard.monitor.inputs.authentification.title" />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Row style={{ margin: "30px 0px" }}>
                                    <Col>
                                        <Row style={{ display: "flex", alignItems: "center" }}>
                                            <Col md="4">
                                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                                    <Translate content="dashboard.monitor.inputs.username.title" />
                                                </h5>
                                            </Col>
                                            <Col md="6">
                                                <TextField 
                                                    id="monitor_username"
                                                    name="monitor_username"
                                                    autoComplete='new-username'
                                                    label={context.counterpart('dashboard.monitor.inputs.username.placeholder')}
                                                    onChange={handleInputChange}
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
                                                    <Translate content="dashboard.monitor.inputs.password.title" />
                                                </h5>
                                            </Col>
                                            <Col md="6">
                                            <TextField 
                                                id="monitor_password"
                                                name="monitor_password"
                                                autoComplete='new-password'
                                                type={showPassword ? 'text' : 'password'}
                                                label={context.counterpart('dashboard.monitor.inputs.password.placeholder')}
                                                onChange={handleInputChange}
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                style={{ background: 'transparent', color: _mode === 'light' ? 'black' : 'white' }}
                                            />
                                        </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Translate content="dashboard.monitor.inputs.headers.title" />
                            </AccordionSummary>
                            <AccordionDetails>
                                <HttpHeadersTable
                                    headers={headers}
                                    addNewHeader={addNewHeader}
                                    editHeader={editHeader}
                                    deleteHeader={deleteHeader}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </>
                }
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
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">
                        <LoadingButton
                            icon="fa-solid fa-floppy-disk"
                            loading={loadingSubmit}
                            onClick={handleSubmit}
                            style={{ width: "250px", height: "50px" }}
                            variant="outlined"
                        >
                            <Translate content="common.button.create" />
                        </LoadingButton>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AddMonitor;
