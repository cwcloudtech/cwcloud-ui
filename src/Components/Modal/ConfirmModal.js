import React, {useState, useEffect} from "react";
import Translate from "react-translate-component";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton";
const ConfirmModal = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [ConfirmationMessage, setConfirmationMessage] = useState("");

    useEffect(() => {
        setConfirmationMessage("")
    }, [props.isOpen])
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="common.confirm" />{' '}
                <Translate content={props.resourceName} />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <Row>
                            <div style={{ marginBottom: "10%", marginTop: "10px" }}>
                                {props.message}
                            </div>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    onClick={(e) => props.onConfirm(e)}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.ok" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default ConfirmModal;
