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

const TriggerModal = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [trigger, setTrigger] = useState('');

    const handleSaveTrigger = (index, trigger) => {
        props.onClick(index, trigger);
        props.toggle();
    }

    useEffect(() => {
        if (props.isOpen) {
            setTrigger(props.variable);
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
                        <TextField
                            style={{ marginTop: '10px' }}
                            value={trigger}
                            onChange={(e) => setTrigger( e.target.value)}
                            label={context.counterpart('dashboard.iot.inputs.triggers.triggerId.placeholder')}
                            fullWidth />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter style={{ display: "flex", justifyContent: "center" }}>
                <LoadingButton
                    icon="fa-solid fa-floppy-disk"
                    onClick={() => { handleSaveTrigger(props.index, trigger) }}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default TriggerModal;
