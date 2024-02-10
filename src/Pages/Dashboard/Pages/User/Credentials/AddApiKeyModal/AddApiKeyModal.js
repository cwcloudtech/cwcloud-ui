import { useContext, useState, useEffect } from "react";
import Translate from "react-translate-component";
import colors from "../../../../../../Context/Colors";
import GlobalContext from "../../../../../../Context/GlobalContext";
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

const AddApiKeyModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [apiKeyName, setApiKeyName] = useState("")
    useEffect(() => {
        if (!props.isOpen)
            setApiKeyName("")
    }, [props.isOpen])
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="iam.apikey.generate" />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.smallTitle[_mode] }}>Name</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input onChange={(e) => setApiKeyName(e.target.value)} value={apiKeyName} className="blackableInput" />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    loading={props.loading}
                    onClick={() => props.onSave(apiKeyName)}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default AddApiKeyModal;
