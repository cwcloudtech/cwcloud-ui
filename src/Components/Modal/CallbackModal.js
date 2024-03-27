import React, { useContext, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Translate from "react-translate-component";
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";
import TextField from '@mui/material/TextField';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Collapse
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton";
import { FormControl, MenuItem, Select } from "@mui/material";
import { isEmpty } from "../../utils/common";

const CallbackModal = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [advancedOptions, setAdvancedOptions] = useState(false);
    const [callback, setCallback] = useState(props.callback);
    const [type, setType] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [token, setToken] = useState("");
    const [client_id, setClient_id] = useState("");
    const [user_data, setUserData] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [port, setPort] = useState("");
    const [subscription, setSubscription] = useState("");
    const [topic, setTopic] = useState("");
    const [qos, setQos] = useState(0);
    const [certificatesAreRequired, setCertificatesAreRequired] = useState(false);
    const [certificates, setCertificates] = useState({
        iot_hub_certificate: "",
        device_certificate: "",
        device_key_certificate: "",
    });

    const types = ["http", "websocket", "mqtt"];

    const modalStyle = {
        maxWidth: "900px",
        width: "auto",
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleFileUpload = (e, certificateType) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
            const newCertificates = {
                ...certificates,
                [certificateType]: reader.result
            };
            setCertificates(newCertificates);
        };
    
        if (file) {
            reader.readAsText(file);
        }
    };
    
    const handleSaveCallback = (index) => {
        callback.certificates_are_required = certificatesAreRequired;
        callback.certificates = certificates;
        props.onClick(index, callback)
        props.toggle()
    }

    useEffect(() => {
        if (props.isOpen) {
            setCallback(props.callback)
            setType(props.callback.type)
            setEndpoint(props.callback.endpoint)
            setToken(props.callback.token)
            setClient_id(props.callback.client_id)
            setUserData(props.callback.user_data)
            setUsername(props.callback.username)
            setPassword(props.callback.password)
            setPort(props.callback.port)
            setSubscription(props.callback.subscription)
            setTopic(props.callback.topic)
            setQos(props.callback.qos)
            setCertificatesAreRequired(props.callback.certificates_are_required)
            if (isEmpty(props.callback.certificates)) {
                setCertificates({
                    iot_hub_certificate: "",
                    device_certificate: "",
                    device_key_certificate: "",
                })
            } else {
                setCertificates(props.callback.certificates)
            }
        }
    } ,[props.isOpen, props.callback]);

    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle} style={modalStyle}>
            <ModalHeader toggle={props.toggle}>
                <div style={{ color: colors.title[_mode] }}>
                    <Translate content={props.title} />
                </div>
            </ModalHeader>
            <ModalBody>
                <Row style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                    <Col md="12">
                        <FormControl fullWidth>
                            <Select
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value)
                                    setCallback({ ...callback, type: e.target.value })
                                }}
                            >
                                {types.map((type, index) => {
                                    return (
                                        <MenuItem key={index} value={type}>{type.toUpperCase()}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Col>
                    <Col md={type === "mqtt" || type === "websocket" ? "6" : "12"}>
                        <TextField
                            style={{ marginTop: '15px' }}
                            value={endpoint}
                            onChange={(e) => {
                                setEndpoint(e.target.value)
                                setCallback({ ...callback, endpoint: e.target.value })
                            }}
                            label={context.counterpart('dashboard.function.inputs.callbacks.callbackEndpoint')+"*"}
                            fullWidth
                        />
                    </Col>
                    {
                        type === "http" &&
                        <Col md="12">
                            <TextField
                                style={{ marginTop: '15px' }}
                                value={token}
                                onChange={(e) => {
                                    setToken(e.target.value)
                                    setCallback({ ...callback, token: e.target.value })
                                }}
                                label={context.counterpart('dashboard.function.inputs.callbacks.callbackToken')}
                                fullWidth
                            />
                        </Col>
                    }
                    {
                        (type === "mqtt" || type === "websocket") &&
                        <>
                            <Col md="3">
                                <TextField
                                    style={{ marginTop: '15px' }}
                                    value={port}
                                    type="number"
                                    onChange={(e) => {
                                        setPort(e.target.value)
                                        setCallback({ ...callback, port: e.target.value })
                                    }}
                                    label={context.counterpart('dashboard.function.inputs.callbacks.callbackPort')}
                                    placeholder="e.g. 8883"
                                    fullWidth
                                />
                            </Col>
                            <Col md="3">
                                <TextField
                                    style={{ marginTop: '15px' }}
                                    type="number"
                                    inputProps={{ min: 0, max: 2 }}
                                    value={qos}
                                    onChange={(e) => {
                                        setQos(e.target.value)
                                        setCallback({ ...callback, qos: e.target.value })
                                    }}
                                    label={context.counterpart('dashboard.function.inputs.callbacks.callbackQos')}
                                    placeholder="min: 0, max: 2"
                                    fullWidth
                                />
                            </Col>
                            <Col md="6">
                                <TextField
                                    style={{ marginTop: '15px' }}
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        setCallback({ ...callback, username: e.target.value })
                                    }}
                                    label={context.counterpart('dashboard.function.inputs.callbacks.callbackUsername')+"*"}
                                    fullWidth
                                />
                            </Col>
                            <Col md="6">
                                <TextField
                                    style={{ marginTop: '15px' }}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setCallback({ ...callback, password: e.target.value })
                                    }}
                                    label={context.counterpart('dashboard.function.inputs.callbacks.callbackPassword')}
                                    fullWidth
                                />
                            </Col>
                            <Col md="6">
                                <TextField
                                    style={{ marginTop: '15px' }}
                                    value={subscription}
                                    onChange={(e) => {
                                        setSubscription(e.target.value)
                                        setCallback({ ...callback, subscription: e.target.value })
                                    }}
                                    label={context.counterpart('dashboard.function.inputs.callbacks.callbackSubscription')}
                                    placeholder="e.g. faas/#"
                                    fullWidth
                                />
                            </Col>
                            <Col md="6">
                                <TextField
                                    style={{ marginTop: '15px' }}
                                    value={topic}
                                    onChange={(e) => {
                                        setTopic(e.target.value)
                                        setCallback({ ...callback, topic: e.target.value })
                                    }}
                                    label={context.counterpart('dashboard.function.inputs.callbacks.callbackTopic')}
                                    placeholder="e.g. faas/test"
                                    fullWidth
                                />
                            </Col>
                            {
                                type === "mqtt" &&
                                <>
                                    <Col md="12" style={{ marginTop: "15px"}}>
                                        <LoadingButton
                                            variant="contained"
                                            icon={advancedOptions ? "fa-solid fa-minus" : "fa-solid fa-plus"}
                                            style={{ textTransform: 'none', width: "100%" }}
                                            onClick={() => setAdvancedOptions(!advancedOptions)}>
                                                <Translate content="common.button.advancedConfigurations" />
                                        </LoadingButton>
                                    </Col>
                                    <Collapse isOpen={advancedOptions} toggle={() => setAdvancedOptions(!advancedOptions)}>
                                        <Row>
                                            <Col md="6">
                                                <TextField
                                                    style={{ marginTop: '15px' }}
                                                    value={client_id}
                                                    onChange={(e) => {
                                                        setClient_id(e.target.value)
                                                        setCallback({ ...callback, client_id: e.target.value })
                                                    }}
                                                    label={context.counterpart('dashboard.function.inputs.callbacks.callbackClientId')}
                                                    fullWidth
                                                />
                                            </Col>
                                            <Col md="6">
                                                <TextField
                                                    style={{ marginTop: '15px' }}
                                                    value={user_data}
                                                    onChange={(e) => {
                                                        setUserData(e.target.value)
                                                        setCallback({ ...callback, user_data: e.target.value })
                                                    }}
                                                    label={context.counterpart('dashboard.function.inputs.callbacks.callbackUserData')}
                                                    fullWidth
                                                />
                                            </Col>
                                            <Col style={{ marginTop: "15px"}}>
                                                <LoadingButton
                                                    icon={certificatesAreRequired ? "fa-solid fa-minus" : "fa-solid fa-plus"}
                                                    style={{ textTransform: 'none', width: "100%"}}
                                                    onClick={() => setCertificatesAreRequired(!certificatesAreRequired) }>
                                                        <Translate content="dashboard.function.inputs.callbacks.certificatesRequiredQuestion" />
                                                </LoadingButton>
                                            </Col>
                                            <Collapse isOpen={certificatesAreRequired} toggle={() => setCertificatesAreRequired(!certificatesAreRequired)}>
                                                <Row>
                                                    <Col md="4" style={{ marginTop: "25px"}}>
                                                        <LoadingButton
                                                            variant="contained"
                                                            component="label"
                                                            color="secondary"
                                                            icon={isEmpty(certificates.iot_hub_certificate) ? "fa-solid fa-file-upload" : "fa-solid fa-check"}
                                                            style={{width: "100%"}}>
                                                            {
                                                                isEmpty(certificates.iot_hub_certificate) 
                                                                ? <Translate content="dashboard.function.inputs.callbacks.callbackIotHubCertificate" />
                                                                : <Translate content="common.state.uploaded" />
                                                            }
                                                            <VisuallyHiddenInput type="file" onChange={(e) => handleFileUpload(e, 'iot_hub_certificate')}/>
                                                        </LoadingButton>
                                                    </Col>
                                                    <Col md="4" style={{ marginTop: "25px"}}>
                                                        <LoadingButton
                                                            variant="contained"
                                                            component="label"
                                                            color="secondary"
                                                            icon={isEmpty(certificates.device_certificate) ? "fa-solid fa-file-upload" : "fa-solid fa-check"}
                                                            style={{width: "100%"}}>
                                                            {
                                                                isEmpty(certificates.device_certificate)
                                                                ? <Translate content="dashboard.function.inputs.callbacks.callbackDeviceCertificate" />
                                                                : <Translate content="common.state.uploaded" />
                                                            }
                                                            <VisuallyHiddenInput type="file" onChange={(e) => handleFileUpload(e, 'device_certificate')}/>
                                                        </LoadingButton>
                                                    </Col>
                                                    <Col md="4" style={{ marginTop: "25px"}}>
                                                        <LoadingButton
                                                            variant="contained"
                                                            component="label"
                                                            color="secondary"
                                                            icon={isEmpty(certificates.device_key_certificate) ? "fa-solid fa-file-upload" : "fa-solid fa-check"}
                                                            style={{width: "100%"}}>
                                                            {
                                                                isEmpty(certificates.device_key_certificate) 
                                                                ? <Translate content="dashboard.function.inputs.callbacks.callbackDeviceKeyCertificate" />
                                                                : <Translate content="common.state.uploaded" />
                                                            }
                                                            <VisuallyHiddenInput type="file" onChange={(e) => handleFileUpload(e, 'device_key_certificate')}/>
                                                        </LoadingButton>
                                                    </Col>
                                                </Row>
                                            </Collapse>
                                        </Row>
                                    </Collapse>
                                </>
                            }
                        </>
                    }
                </Row>
            </ModalBody>
            <ModalFooter style={{ display: "flex", justifyContent: "center" }}>
                <LoadingButton
                    loading={props.loading}
                    icon="fa-solid fa-floppy-disk"
                    onClick={() => { handleSaveCallback(props.index)}}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default CallbackModal;
