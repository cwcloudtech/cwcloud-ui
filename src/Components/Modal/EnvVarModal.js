import React, { useContext, useEffect, useState } from "react";
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
    Col
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton";

const EnvModal = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    const handleSaveEnvVar = (index, key, value) => {
        props.onClick(index, key, value)
        props.toggle()
    }

    useEffect(() => {
        if (props.isOpen) {
            setKey(props.variable.name);
            setValue(props.variable.value);
        }
    } ,[props.isOpen, props.variable]);

    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <div style={{ color: colors.title[_mode] }}>
                    <Translate content={props.title} />
                </div>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <Row style={{ display: 'flex', alignItems: 'center' }}>
                            <Col>
                                <TextField
                                    style={{ marginTop: '10px' }}
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    label={context.counterpart('dashboard.function.inputs.env_vars.envVarName')}
                                    fullWidth />
                            </Col>
                            <Col>
                                <TextField
                                    style={{ marginTop: '10px' }}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    label={context.counterpart('dashboard.function.inputs.env_vars.envVarValue')}
                                    fullWidth />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter style={{ display: "flex", justifyContent: "center" }}>
                <LoadingButton
                    loading={props.loading}
                    icon="fa-solid fa-floppy-disk"
                    onClick={() => { handleSaveEnvVar(props.index, key, value)}}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default EnvModal;
