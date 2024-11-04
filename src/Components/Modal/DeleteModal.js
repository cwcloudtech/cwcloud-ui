import React, { useContext, useState, useEffect } from "react";
import Translate from "react-translate-component";
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Input,
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton";
const DeleteModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [ConfirmationMessage, setConfirmationMessage] = useState("");
    useEffect(() => {
        setConfirmationMessage("")
    }, [props.isOpen])
    const inputChangeHandler = (e) => {
        if (e.key === 'Enter') {
            if (!checkDisabledButton()) {
                if (props.multi) {
                    props.onMultiDelete()
                } else {
                    props.onDelete()
                }
            }
        }
    }
    const checkDisabledButton = () => {
        if (props.multi || !props.name)
            return ConfirmationMessage !== 'delete'
        return ConfirmationMessage !== props.name
    }
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            {props.multi ?
                <ModalHeader toggle={props.toggle}>Delete selected {props.resourceName}s</ModalHeader>
                :
                <ModalHeader toggle={props.toggle}>Delete {props.resourceName}</ModalHeader>
            }
            <ModalBody>
                <Row>
                    <Col>
                        <Row>
                            {!props.multi ? <div style={{ marginBottom: "10%", marginTop: "10px" }}>
                                <Translate content="dashboard.modal.delete.resource" />{' '}
                                {props.resourceName}{" "}
                                <span style={{ fontWeight: "bold", color: colors.smallTitle[_mode]}}>{props.name}</span> ?
                            </div> :
                                <div style={{ marginBottom: "10%", marginTop: "10px", color: colors.smallTitle[_mode] }}>
                                    <Translate content="dashboard.modal.delete.all" />
                                </div>
                            }
                        </Row>
                        {!props.multi ?
                            <Row>
                                <div style={{ marginBottom: "10%" }}>
                                    <Input className="blackableInput"
                                        value={ConfirmationMessage}
                                        placeholder={`type ${props.name || 'delete'} to confirm`}
                                        onChange={(e) => setConfirmationMessage(e.target.value)}
                                        onKeyDown={inputChangeHandler}
                                    />
                                </div>
                            </Row>
                            :
                            <Row>
                                <div style={{ marginBottom: "10%" }}>
                                    <Input className="blackableInput"
                                        value={ConfirmationMessage}
                                        placeholder={`type delete to confirm`}
                                        onChange={(e) => setConfirmationMessage(e.target.value)}
                                        onKeyDown={inputChangeHandler}
                                    />
                                </div>
                            </Row>
                        }
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    loading={props.loading}
                    color="error"
                    icon="fa-solid fa-trash-can"
                    disabled={checkDisabledButton()}
                    onClick={(e) => props.multi ? props.onMultiDelete(e) : props.onDelete(e)}
                    style={{ width: "100%" }}
                >
                    {props.multi ?
                        `Delete selected resources`
                        :
                        `Delete this ${props.resourceName}`
                    }
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteModal;
