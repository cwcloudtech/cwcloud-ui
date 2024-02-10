import { useContext, useState, useEffect } from "react";
import Translate from "react-translate-component";
import GlobalContext from "../../../../../../Context/GlobalContext";
import colors from "../../../../../../Context/Colors";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Input,
} from "reactstrap";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";

const AddVoucherModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [code, setCode] = useState("")

    useEffect(() => {
        if (!props.isOpen)
            setCode("")
    }, [props.isOpen])
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="dashboard.adminVouchersPage.add" />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.smallTitle[_mode] }}>Code</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input onChange={(e) => setCode(e.target.value)} value={code} className="blackableInput" />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    loading={props.loading}
                    onClick={() => props.onSave(code)}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default AddVoucherModal;
