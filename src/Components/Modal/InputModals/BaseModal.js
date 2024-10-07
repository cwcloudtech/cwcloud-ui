import React, { useContext, useEffect, useState } from "react";
import Translate from "react-translate-component";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import TextField from '@mui/material/TextField';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col
} from "reactstrap";
import LoadingButton from "../../LoadingButton/LoadingButton";

const BaseModal = ({
    isOpen,
    toggle,
    title,
    onSave,
    inputs,
    loading,
    index,
    variable
}) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [values, setValues] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (typeof variable === 'object') {
                setValues(variable);
            } else {
                setValues({ value: variable });
            }
        }
    }, [isOpen, variable]);

    const handleInputChange = (key, value) => {
        setValues(prevValues => ({ ...prevValues, [key]: value }));
    };

    const handleSave = () => {
        onSave(index, ...Object.values(values));
        toggle();
    };

    return (
        <Modal centered isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                <div style={{ color: colors.title[_mode] }}>
                    <Translate content={title} />
                </div>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        {inputs.map((input, idx) => (
                            <TextField
                                key={idx}
                                style={{ marginTop: '10px' }}
                                value={values[input.key] || ''}
                                onChange={(e) => handleInputChange(input.key, e.target.value)}
                                label={context.counterpart(input.label)}
                                fullWidth
                            />
                        ))}
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter style={{ display: "flex", justifyContent: "center" }}>
                <LoadingButton
                    loading={loading}
                    icon="fa-solid fa-floppy-disk"
                    onClick={handleSave}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default BaseModal;
