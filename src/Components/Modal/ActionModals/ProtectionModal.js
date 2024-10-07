import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";

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
import LoadingButton from "../../LoadingButton/LoadingButton";

const ProtectionModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [ConfirmationMessage, setConfirmationMessage] = useState("");

    useEffect(() => {
        setConfirmationMessage("")
    }, [props.isOpen])

    const inputChangeHandler = (e) => {
        if (e.key === 'Enter' && ConfirmationMessage !== props.name)
            props.onUpdateInstanceProtection()
    }
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}><Translate content="dashboard.modal.protectionModal.title" /></ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <Row>
                            <div style={{ marginBottom: "10%", marginTop: "10px", colors: colors.smallTitle[_mode] }}>
                                <Translate content={ props.action === "protect" ? "dashboard.modal.protectionModal.protectMessage" : "dashboard.modal.protectionModal.unprotectMessage" } />{" "}
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
                    disabled={ConfirmationMessage !== props.name}
                    onClick={props.onUpdateInstanceProtection}
                    style={{ width: "100%" }}
                >
                    <Translate content={props.action === "protect" ? "dashboard.modal.protectionModal.buttons.protect" : "dashboard.modal.protectionModal.buttons.unprotect"} />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default ProtectionModal;