import { useContext, useState, useEffect, useCallback } from "react";
import { MenuItem, Select } from "@material-ui/core";
import { Chip, TextField } from "@mui/material";
import Translate from "react-translate-component";
import GlobalContext from '../../Context/GlobalContext'; 
import colors from '../../Context/Colors'; 
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Input,
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton";
import SuggestionsAutoComplete from "../SuggestionsAutoComplete/SuggestionsAutoComplete";
import { useDropzone } from 'react-dropzone';

const AddTicketModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [ticket, setTicket] = useState({})
    const [files, setFiles] = useState([]);

    const dropzoneStyle = {
        border: '1px dashed #AAB8C5',
        borderRadius: '5px',
        padding: '20px',
        textAlign: 'center',
        color: '#F0F1F2',
        cursor: 'pointer',
    };

    useEffect(() => {
        if (!props.isOpen)
            setTicket({})
    }, [props.isOpen])

    const onDrop = useCallback(acceptedFiles => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleDeleteFile = (file) => {
        setFiles(prevFiles => prevFiles.filter(f => f !== file));
    }

    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="dashboard.support.addNewTicket" />
            </ModalHeader>
            <ModalBody>
                { props.isAdmin && 
                    <div>
                        <Row style={{ marginTop: '20px' }}>
                            <Col>
                                <h5 style={{ fontSize: '14px', color: colors.title[_mode]}}>
                                    <Translate content="common.fields.userEmail" />
                                </h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <SuggestionsAutoComplete
                                    id="combo-box-email"
                                    length={465}
                                    onChange={(event, newValue) => {
                                        setTicket({ ...ticket, email: newValue });
                                    }}
                                    options={props.users.map(u => u.email)}
                                    renderInput={(params) => <TextField onChange={(e) => setTicket({ ...ticket, email: e.target.value })} {...params} label="Email" />}
                                    feedbackMessage="common.message.thisFieldIsRequired"
                                />
                            </Col>
                        </Row>
                    </div>
                }
                <Row style={{ marginTop: props.isAdmin ? '0px' : '20px' }}>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.title[_mode]}}>
                            <Translate content="dashboard.support.selectedProduct" />
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Select
                            onChange={(e) => setTicket({ ...ticket, product: e.target.value })}
                            value={ticket.product || 'none'}>
                            <MenuItem disabled value={'none'}>
                                <Translate content="dashboard.support.selectProduct" />
                            </MenuItem>
                            {props.envs?.map(env => (
                                <MenuItem value={env.name} key={env.id}>{env.name}</MenuItem>
                            ))}
                            <MenuItem value={'registry'}>Registry</MenuItem>
                            <MenuItem value={'bucket'}>Bucket</MenuItem>
                            <MenuItem value={'emailapi'}>Email API</MenuItem>
                            <MenuItem value={'faasapi'}>FaaS API</MenuItem>
                            <MenuItem value={'k8sapi'}>Kubernetes</MenuItem>
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.title[_mode]}}>
                            <Translate content="dashboard.support.severityText" />
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Select
                            onChange={(e) => setTicket({ ...ticket, severity: e.target.value })}
                            value={ticket.severity || 'none'}>
                            <MenuItem disabled value={'none'}>
                                <Translate content="dashboard.support.selectSeverity" />
                            </MenuItem>
                            <MenuItem value={'low'}>
                                <Translate content="dashboard.support.severity.low" />
                            </MenuItem>
                            <MenuItem value={'medium'}>
                                <Translate content="dashboard.support.severity.medium" />
                            </MenuItem>
                            <MenuItem value={'high'}>
                                <Translate content="dashboard.support.severity.high" />

                            </MenuItem>
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px', color: colors.title[_mode]}}>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.title[_mode]}}>
                            <Translate content="dashboard.support.table.subject" />
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input value={ticket.subject || ''} onChange={(e) => setTicket({ ...ticket, subject: e.target.value })} className="blackableInput" />
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.title[_mode]}}>
                            <Translate content="dashboard.support.description" />
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <textarea
                            style={{ width: '100%', backgroundColor: colors.secondBackground[_mode], color: colors.menuText[_mode], border: "1px solid "+ colors.textAreaBorder[_mode], borderRadius: "5px", padding: '10px' }}
                            value={ticket.message || ''}
                            onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                        />
                    </Col>                    
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <div {...getRootProps({ style: dropzoneStyle })}>
                            <input {...getInputProps()} />
                            <p>
                                <Translate content="dashboard.support.dragAndDrop" />
                            </p>
                        </div>
                        <Row className="pt-1">
                            {files.map((file, index) => (
                                <Col className="pt-1" md="12" key={index}>
                                    <Chip color="primary" label={file.name} onDelete={() => handleDeleteFile(file)} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    loading={props.loading}
                    onClick={() => props.onSave(ticket, files)}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default AddTicketModal;
