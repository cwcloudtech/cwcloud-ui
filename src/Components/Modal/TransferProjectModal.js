import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import LoadingButton from "../LoadingButton/LoadingButton"
import Translate from 'react-translate-component';

const TransferProjectModal = (props) => {
    const [userEmail, setUserEmail] = useState("")
    useEffect(() => {
        if (!props.isOpen)
            setUserEmail("")
    }, [props.isOpen])
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="dashboard.projectOverview.fields.transferTitle" />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <h5 style={{ fontSize: '14px' }}>
                            <Translate content="common.fields.userEmail" />
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Autocomplete
                            disablePortal
                            id="combo-box-email"
                            onChange={(event, newValue) => {
                                setUserEmail(newValue);
                            }}
                            freeSolo
                            options={props.users.map(u => u.email)}
                            sx={{ width: "100%" }}
                            renderInput={(params) =>
                                <TextField onChange={(e) => setUserEmail(e.target.value)} {...params} label="Email" />}
                        />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    loading={props.loading}
                    onClick={() => props.onSave(userEmail)}
                    style={{ width: "100%" }}
                >
                    Save
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default TransferProjectModal;
