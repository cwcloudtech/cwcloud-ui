import { useState, useEffect } from "react";
import Translate from "../Translate/Translate";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";

const ReplyTicketModal = (props) => {
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (props.isOpen)
            setMessage(props.message)
    }, [props.isOpen, props.message])


    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="dashboard.support.editTicketReply" />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <MarkdownEditor
                             value={message}
                             onChange={setMessage}
                        />
                    </Col>                    
                </Row>
            </ModalBody>
            <ModalFooter style={{ display: "flex", justifyContent: "center" }}>
                <LoadingButton icon="fa-solid fa-pen"
                    loading={props.loading}
                    onClick={() => props.onUpdate(message)}
                    style={{ width: "45%", marginRight: "10px" }}
                >
                    <Translate content="common.button.edit" />
                </LoadingButton>
                <LoadingButton icon="fa-solid fa-trash"
                    color="error"
                    loading={props.loading}
                    onClick={() => props.onDelete()}
                    style={{ width: "45%" }}
                >
                    <Translate content="common.button.delete" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default ReplyTicketModal;
