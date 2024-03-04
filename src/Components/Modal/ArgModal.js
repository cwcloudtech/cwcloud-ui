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

const ArgModal = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [arg, setArg] = useState('');

    const handleSaveArgument = (index, arg) => {
        props.onClick(index, arg);
        props.toggle();
    }

    useEffect(() => {
        if (props.isOpen) {
            setArg(props.variable);
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
                            value={arg}
                            onChange={(e) => setArg( e.target.value)}
                            label={context.counterpart('dashboard.function.inputs.args.placeholder')}
                            fullWidth />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter style={{ display: "flex", justifyContent: "center" }}>
                <LoadingButton
                    icon="fa-solid fa-floppy-disk"
                    onClick={() => { handleSaveArgument(props.index, arg) }}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default ArgModal;
