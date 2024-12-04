import { MenuItem, OutlinedInput, Select } from '@material-ui/core';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import { Col, Container, Input, Row } from "reactstrap";
import EditorBox from '../../../../../../Components/EditorBox/EditorBox';
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import EditorModal from '../../../../../../Components/Modal/EditorModal';
import HttpHeaderModal from '../../../../../../Components/Modal/InputModals/HeadersModal';
import SuggestionsAutoComplete from '../../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete';
import HttpHeadersTable from '../../../../../../Components/Table/HeadersTable';
import colors from '../../../../../../Context/Colors';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from '../../../../../../utils/axios';


const MonitorOverview = () => {
    const context = useContext(GlobalContext);
    const { id } = useParams();
    const _mode = context.mode;
    const location = useLocation();
    const currentPath = location.pathname;
    const is_admin = currentPath.includes("admin");
    const nextPath = is_admin ? "/admin/monitors" : "/monitors";
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingFetch, setLoadingFetch] = useState(true);
    const [headers, setHeaders] = useState([]);
    const [showAddNewHeaderModal, setShowAddNewHeaderModal] = useState(false);
    const [showEditHeaderModal, setShowEditHeaderModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [selectedHeaderIndex, setSelectedHeaderIndex] = useState(0);
    const [monitor, setMonitor] = useState({
        type: 'http',
        name: '',
        family: '',
        url: '',
        method: 'GET',
        expected_http_code: "20*",
        expected_contain: '',
        body: '',
        timeout: 30,
        username: '',
        password: '',
        headers: [],
        ...(is_admin && { user_id: 0 })
    });
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

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
        const fetchMonitorDetails = async () => {
            try {
                setLoadingFetch(true);
                var api_url = is_admin ? `/admin/monitor/${id}` : `/monitor/${id}`;
                const response = await axios.get(api_url);
                const fetchedMonitor = response.data;
                setMonitor(fetchedMonitor);
                if (fetchedMonitor.headers && fetchedMonitor.headers.length > 0) {
                    setHeaders(fetchedMonitor.headers);
                }
                setLoadingFetch(false);
            } catch (error) {
                setLoadingFetch(false);
                toast.error(context.counterpart("dashboard.monitor.message.errorFetchingMonitor"));
                navigate(nextPath);
            }
        };

        fetchMonitorDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate, context]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMonitor(prev => ({
            ...prev,
            [name]: value
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

    const handleSubmit = () => {
        if (!monitor.name || !monitor.url) {
            toast.error(context.counterpart("dashboard.monitor.message.nameAndUrlRequired"));
            return;
        }
        if (is_admin && !monitor.user_id) {
            toast.error(context.counterpart("dashboard.monitor.message.userRequired"));
            return;
        }
    
        setLoadingSubmit(true);

        const monitorData = {
            type: "http",
            name: monitor.name,
            family: monitor.family || null,
            url: monitor.url,
            method: monitor.method || 'GET',
            expected_http_code: monitor.expected_http_code || "20*",
            expected_contain: monitor.expected_contain || null,
            body: monitor.body || null,
            timeout: parseInt(monitor.timeout) || 30,
            username: monitor.username || null,
            password: monitor.password || null,

            headers: headers
                .filter(h => h.name && h.value)
                .map(h => ({
                    name: h.name,
                    value: h.value
                }))
        };

        if (is_admin && monitor.user_id) {
            monitorData.user_id = monitor.user_id
        }
    
        var api_url = is_admin ? `/admin/monitor/${id}` : `/monitor/${id}`;
        axios.put(api_url, monitorData)
            .then(response => {
                setLoadingSubmit(false);
                toast.success(context.counterpart("dashboard.monitor.message.monitorUpdated"));
                navigate(nextPath);
            })
            .catch(error => {
                setLoadingSubmit(false);
                toast.error(error.response?.data?.message || context.counterpart("dashboard.monitor.message.errorUpdatingMonitor"));
            });
    };

    if (loadingFetch) {
        return (
            <Container fluid className="p-4 mt-4">
                <div className="text-center">
                    <Translate content="common.loading" />
                </div>
            </Container>
        );
    }

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
                            <Translate content="dashboard.monitor.monitorOverview" />
                        </h5>
                    </Col>
                </Row>
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
                                    id="method"
                                    name='method'
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
                                    name='name'
                                    label={context.counterpart('dashboard.monitor.inputs.name.placeholder')}
                                    value={monitor.name.split("-")[0]}
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
                                    name='url'
                                    label={context.counterpart('dashboard.monitor.inputs.url.placeholder')}
                                    value={monitor.url}
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
                                    name='family'
                                    label={context.counterpart('dashboard.monitor.inputs.family.placeholder')}
                                    value={monitor.family}
                                    onChange={handleInputChange}
                                    required 
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
                                        value={users.find(u => u.id === monitor.user_id)?.email || ''}
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
                                            id="expected_http_code"
                                            name="expected_http_code"
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
                                            name='expected_contain'
                                            label={context.counterpart('dashboard.monitor.inputs.expectedContain.placeholder')}
                                            value={monitor.expected_contain}
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
                    </AccordionDetails>
                </Accordion>
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
                                            name='username'
                                            label={context.counterpart('dashboard.monitor.inputs.username.placeholder')}
                                            value={monitor.username}
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
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        label={context.counterpart('dashboard.monitor.inputs.password.placeholder')}
                                        value={monitor.password}
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
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">
                        <LoadingButton
                            icon="fa-solid fa-floppy-disk"
                            loading={loadingSubmit}
                            onClick={handleSubmit}
                            style={{ width: "250px", height: "50px" }}
                            variant="outlined"
                        >
                            <Translate content="common.button.update" />
                        </LoadingButton>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MonitorOverview;
