import React from "react";
import BlocklyWorkspace from "../BlocklyWorkspace/BlocklyWorkspace";
import {
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Col,
} from "reactstrap";

const BlocklyModal = (props) => {
    const modalStyle = {
        maxWidth: "980px",
        width: "100%",
    };
    const mediaQueryLarge = window.matchMedia("(min-width: 1200px)");

    if (mediaQueryLarge.matches) {
        modalStyle.maxWidth = "1800px";
        modalStyle.height = "800px";
    } else {
        modalStyle.height = "600px";
    }
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle} style={modalStyle}>
            <ModalHeader toggle={props.toggle}></ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <BlocklyWorkspace
                            workspaceHeight={modalStyle.height || "600px"}
                            showBlocklyFullScreen={props.isOpen}
                            code={props.code}
                            state={props.state}
                            _mode={props._mode}
                            onWorkspaceChange={props.onWorkspaceChange}
                        />
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
};

export default BlocklyModal;
