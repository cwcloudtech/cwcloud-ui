import React, { useContext} from "react";
import Translate from "react-translate-component";
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton";

const WarningModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
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
                        <Row>
                            <div style={{ marginBottom: "10%", marginTop: "10px", color: colors.smallTitle[_mode] }}>
                                {props.message}
                            </div>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter style={{ display: "flex", justifyContent: "center" }}>
                <LoadingButton
                    loading={props.loading}
                    icon="fa-solid fa-floppy-disk"
                    onClick={() => props.onClick()}
                >
                    <Translate content={props.buttonTitle} />
                </LoadingButton>
                <span style={{ width: "5%" }} />
                <LoadingButton
                    loading={props.loading}
                    icon="fa-solid fa-x"
                    onClick={() => props.toggle()}
                >
                    <Translate content={props.cancelbuttonTitle} />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default WarningModal;
