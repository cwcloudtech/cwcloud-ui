import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { MenuItem, Select } from "@mui/material";
import { Chip, TextField } from "@mui/material";
import Translate from "../Translate/Translate";
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
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

const AddTicketModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [ticket, setTicket] = useState({})
    const [files, setFiles] = useState([]);

    const dropzoneStyle = {
        border: '1px dashed #94a3b8',
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

    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const onFilesSelected = (e) => {
        onDrop(Array.from(e.target.files || []));
        e.target.value = '';
    };

    const dropzoneHandlers = {
        onClick: () => fileInputRef.current?.click(),
        onDragOver: (e) => {
            e.preventDefault();
            setIsDragActive(true);
        },
        onDragLeave: () => setIsDragActive(false),
        onDrop: (e) => {
            e.preventDefault();
            setIsDragActive(false);
            onDrop(Array.from(e.dataTransfer.files || []));
        },
    };

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
                        <MarkdownEditor
                            value={ticket.message || ''}
                            onChange={(message) => setTicket({ ...ticket, message })}
                        />
                    </Col>                    
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <div role="button" tabIndex={0} {...dropzoneHandlers} style={{ ...dropzoneStyle, opacity: isDragActive ? 0.8 : 1 }}>
                            <input ref={fileInputRef} type="file" multiple hidden onChange={onFilesSelected} />
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
                <LoadingButton icon="fa-solid fa-floppy-disk"
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
