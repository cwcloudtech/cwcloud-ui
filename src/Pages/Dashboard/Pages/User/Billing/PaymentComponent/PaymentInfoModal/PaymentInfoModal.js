import React from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import LoadingButton from "../../../../../../../Components/LoadingButton/LoadingButton";
import CardInput from "./CardInput/CardInput";
import Translate from "react-translate-component";
const PaymentInfoModal = (props) => {
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="billing.cardInformations" />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <Row>
                            <CardInput />
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    color="error"
                    loading={props.loading}
                    onClick={props.onSave}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default PaymentInfoModal;
