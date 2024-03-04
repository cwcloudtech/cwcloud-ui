import { useContext, useState } from "react";
import { MenuItem, Select } from "@material-ui/core";
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

const AddFunctionModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [selectedFunction, setSelectedFunction] = useState(null)

    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="dashboard.function.call" />
            </ModalHeader>
            <ModalBody>
                <div>
                    <Row style={{ marginTop: '20px' }}>
                        <Col>
                            <h5 style={{ fontSize: '14px', color: colors.title[_mode]}}>
                                <Translate content="dashboard.function.inputs.callFunction.placeholder" />
                            </h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Select
                                style={{ width: '100%' }}
                                onChange={(e) => {
                                    var selectedFunction = props.functions.find(f => f.id === e.target.value)
                                    setSelectedFunction(selectedFunction)
                                }}
                                >
                                <MenuItem disabled value={'none'}>
                                    <Translate content="dashboard.function.title.main" />
                                </MenuItem>
                                {props.functions?.map(func => (

                                    <MenuItem value={func.id} key={func.id}> {func.content.name}</MenuItem>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </div>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    onClick={() => props.onSave(selectedFunction)}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default AddFunctionModal;
