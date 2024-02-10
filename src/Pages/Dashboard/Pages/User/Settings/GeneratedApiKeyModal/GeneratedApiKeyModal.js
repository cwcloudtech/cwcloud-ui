import { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import Translate from "react-translate-component";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";
const GeneratedApiKeyModal = (props) => {
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
                                <h5 style={{ fontSize: '14px' }}>Access Key:</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ display: 'flex' }}>
                                <div style={{ marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', borderRadius: '5px', border: '1px solid rgb(212, 218, 231)', padding: '10px 15px 10px 15px' }}>
                                    <h5 style={{ fontSize: '14px', fontWeight: '400', margin: '0' }}>
                                        {props.apiKey.access_key}
                                    </h5>
                                </div>
                                <div onClick={copyAccessKeyHandler} style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', borderRadius: '5px', backgroundColor: 'rgb(212, 218, 231)', padding: '10px 15px 10px 15px' }}>
                                    <i className="fa-regular fa-clone"></i>
                                    <h5 style={{ fontSize: '14px', fontWeight: '400', margin: '0px 0px 0px 10px' }}>
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
                                <h5 style={{ fontSize: '14px' }}>Secret Key:</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ display: 'flex' }}>
                                <div style={{ marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', borderRadius: '5px', border: '1px solid rgb(212, 218, 231)', padding: '10px 15px 10px 15px' }}>
                                    <h5 style={{ fontSize: '14px', fontWeight: '400', margin: '0' }}>
                                        {props.apiKey.secret_key}
                                    </h5>
                                </div>
                                <div onClick={copySecretKeyHandler} style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', borderRadius: '5px', backgroundColor: 'rgb(212, 218, 231)', padding: '10px 15px 10px 15px' }}>
                                    <i className="fa-regular fa-clone"></i>
                                    <h5 style={{ fontSize: '14px', fontWeight: '400', margin: '0px 0px 0px 10px' }}>
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
