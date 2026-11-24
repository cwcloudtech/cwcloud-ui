import React from "react";
import Translate from "../../Translate/Translate";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col
} from "reactstrap";
import LoadingButton from "../../../LoadingButton/LoadingButton";

const ConfirmationModal = (props) => {
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content={props.title} />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <Row>
                            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                                <Translate content={props.message} />
                            </div>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton icon="fa-solid fa-check"
                    style={{ marginRight: "10px" }}
                    onClick={(e) => props.onConfirm(e)}
                >
                    <Translate content="common.confirm" />
                </LoadingButton>
                <LoadingButton icon="fa-solid fa-xmark"
                    color={"error"}
                    onClick={() => props.onCancel()}
                >
                    <Translate content="common.button.cancel" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default ConfirmationModal;
