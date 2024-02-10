import { useContext, useState } from "react";
import Translate from "react-translate-component";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";
import GlobalContext from "../../../../../../Context/GlobalContext";
import colors from "../../../../../../Context/Colors";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";

const GeneratedApiKeyModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [clickedCopyAccessKey, setClickedCopyAccessKey] = useState(false)
    const [clickedCopySecretKey, setClickedCopySecretKey] = useState(false)
    const copyAccessKeyHandler = () => {
        setClickedCopySecretKey(false)
        setClickedCopyAccessKey(true)
        setTimeout(() => {
            setClickedCopyAccessKey(false)
        }, 3000)
        navigator.clipboard.writeText(props.apiKey.access_key)
    }
    const copySecretKeyHandler = () => {
        setClickedCopyAccessKey(false)
        setClickedCopySecretKey(true)
        setTimeout(() => {
            setClickedCopySecretKey(false)
        }, 3000)
        navigator.clipboard.writeText(props.apiKey.secret_key)
    }
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="iam.apikey.generated" />
            </ModalHeader>
            <ModalBody>
                <Row style={{ marginTop: '10px', marginBottom: '20px' }}>
                    <Col xs="1">
                        <i className="fa-solid fa-triangle-exclamation" style={{ color: 'red', fontSize: '30px' }}></i>
                    </Col>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: 'red', whiteSpace: 'pre-line' }}>
                            <Translate content="iam.apikey.warning.part1" />{'\n'}
                            <Translate content="iam.apikey.warning.part2" />
                        </h5>
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <Col>
                        <Row>
                            <Col>
                                <h5 style={{ fontSize: '14px', color: colors.smallTitle[_mode] }}>Access Key:</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ display: 'flex' }}>
                                <div style={{ marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', borderRadius: '5px', border: '1px solid rgb(212, 218, 231)', padding: '10px 15px 10px 15px' }}>
                                    <h5 style={{ fontSize: '14px', fontWeight: '400', margin: '0', color: colors.mainText[_mode] }}>
                                        {props.apiKey.access_key}
                                    </h5>
                                </div>
                                <div onClick={copyAccessKeyHandler} style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', borderRadius: '5px', backgroundColor: _mode === 'dark' ? colors.darkButton : 'rgb(212, 218, 231)', padding: '10px 15px 10px 15px' }}>
                                    <i className="fa-regular fa-clone"></i>
                                    <h5 style={{ fontSize: '14px', fontWeight: '400', margin: '0px 0px 0px 10px', color: colors.mainText[_mode] }}>
                                        {clickedCopyAccessKey ?
                                            <Translate content="common.message.copied" />
                                            :
                                            <Translate content="common.button.copy" />
                                        }
                                    </h5>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <Col>
                        <Row>
                            <Col>
                                <h5 style={{ fontSize: '14px', color: colors.smallTitle[_mode] }}>Secret Key:</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ display: 'flex' }}>
                                <div style={{ marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', borderRadius: '5px', border: '1px solid rgb(212, 218, 231)', padding: '10px 15px 10px 15px' }}>
                                    <h5 style={{ fontSize: '14px', fontWeight: '400', margin: '0', color: colors.mainText[_mode] }}>
                                        {props.apiKey.secret_key}
                                    </h5>
                                </div>
                                <div onClick={copySecretKeyHandler} style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', borderRadius: '5px', backgroundColor: _mode === 'dark' ? colors.darkButton : 'rgb(212, 218, 231)', padding: '10px 15px 10px 15px' }}>
                                    <i className="fa-regular fa-clone"></i>
                                    <h5 style={{ fontSize: '14px', fontWeight: '400', margin: '0px 0px 0px 10px', color: colors.mainText[_mode] }}>
                                        {clickedCopySecretKey ?
                                            <Translate content="common.message.copied" />
                                            :
                                            <Translate content="common.button.copy" />
                                        }
                                    </h5>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    onClick={props.toggle}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.ok" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default GeneratedApiKeyModal;
