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
} from "reactstrap";
import Translate from "react-translate-component";
import LoadingButton from "../LoadingButton/LoadingButton";

const PowerModal = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [updatedStatus, setUpdatedStatus] = useState("")
    
    useEffect(() => {
        if (context.language === "en")
            switch (props.status) {
                case "active":
                    setUpdatedStatus("power off")
                    break;
                default:
                    setUpdatedStatus("power on")
                    break;
            }
        else {
            switch (props.status) {
                case "active":
                    setUpdatedStatus("arrêter")
                    break;
                default:
                    setUpdatedStatus("redémarrer")
                    break;
            }
        }
    }, [context.language, props.status])
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}> <Translate content="dashboard.modal.powerModal.title" with={{ status: updatedStatus }} /></ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <Row>
                            <div style={{ marginBottom: "10%", marginTop: "10px", colors: colors.smallTitle[_mode] }}>
                                <Translate content="dashboard.modal.powerModal.message" with={{ status: updatedStatus }} />{" "}
                                <span style={{ fontWeight: "bold" }}>{props.name}</span> ?
                            </div>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    color="error"
                    loading={props.loading}
                    onClick={props.onPower}
                    style={{ width: "100%" }}
                >
                    <Translate content="dashboard.modal.powerModal.button" with={{ status: updatedStatus }} />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default PowerModal;
