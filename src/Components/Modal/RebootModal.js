import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Input,
} from "reactstrap";
import Translate from "react-translate-component";
import LoadingButton from "../LoadingButton/LoadingButton";

const RebootModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [ConfirmationMessage, setConfirmationMessage] = useState("");

    useEffect(() => {
        setConfirmationMessage("")
    }, [props.isOpen])

    const inputChangeHandler = (e) => {
        if (e.key === 'Enter' && ConfirmationMessage !== props.name)
            props.onReboot()
    }
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}><Translate content="dashboard.modal.rebootModal.title" /></ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <Row>
                            <div style={{ marginBottom: "10%", marginTop: "10px", colors: colors.smallTitle[_mode] }}>
                                <Translate content="dashboard.modal.rebootModal.message" />{" "}
                                <span style={{ fontWeight: "bold" }}>{props.name}</span> ?
                            </div>
                        </Row>
                        <Row>
                            <div style={{ marginBottom: "10%" }}>
                                <Input
                                    value={ConfirmationMessage}
                                    placeholder={`type ${props.name} to confirm`}
                                    onKeyDown={inputChangeHandler}
                                    onChange={(e) => setConfirmationMessage(e.target.value)}
                                    className="blackableInput"
                                />
                            </div>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    color="error"
                    disabled={ConfirmationMessage !== props.name}
                    onClick={props.onReboot}
                    style={{ width: "100%" }}
                >
                    <Translate content="dashboard.modal.rebootModal.button" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default RebootModal;
