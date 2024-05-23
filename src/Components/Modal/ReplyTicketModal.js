import { useContext, useState, useEffect } from "react";
import Translate from "react-translate-component";
import GlobalContext from '../../Context/GlobalContext'; 
import colors from '../../Context/Colors'; 
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton";

const ReplyTicketModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
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
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.title[_mode]}}>
                            <Translate content="dashboard.support.reply" />
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <textarea
                            style={{ width: '100%', backgroundColor: colors.secondBackground[_mode], color: colors.menuText[_mode], border: "1px solid "+ colors.textAreaBorder[_mode], borderRadius: "5px", padding: '10px' }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Col>                    
                </Row>
            </ModalBody>
            <ModalFooter style={{ display: "flex", justifyContent: "center" }}>
                <LoadingButton
                    loading={props.loading}
                    onClick={() => props.onUpdate(message)}
                    style={{ width: "45%", marginRight: "10px" }}
                >
                    <Translate content="common.button.edit" />
                </LoadingButton>
                <LoadingButton
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
