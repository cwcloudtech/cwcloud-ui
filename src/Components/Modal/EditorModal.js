import React from "react";
import Editor from "@monaco-editor/react";
import {
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Col,
} from "reactstrap";

const EditorModal = (props) => {
    const modalStyle = {
        maxWidth: "980px", // Default maxWidth for small screens
        width: "100%",
    };

    // Media query for large screens (LG)
    const mediaQueryLarge = window.matchMedia("(min-width: 1200px)");

    // Check if the screen size is large and set maxWidth and height accordingly
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
                        <Editor
                            height={modalStyle.height || "600px"} // Set the height based on screen size
                            theme="vs-dark"
                            language={props.language}
                            value={props.value}
                            onChange={props.onChange}
                        />
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
};

export default EditorModal;
