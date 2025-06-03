import { useContext, useState } from "react";
import { Col, Form, FormGroup, FormText, Input, Row } from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Translate from 'react-translate-component';
import { Container } from 'reactstrap';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";
import colors from "../../../../../../Context/Colors";
import GlobalContext from "../../../../../../Context/GlobalContext";
import '../../../../../../common.css';
import axios from "../../../../../../utils/axios";
import EditorBox from "../../../../../../Components/EditorBox/EditorBox";
import EditorModal from "../../../../../../Components/Modal/EditorModal";

function AddKV(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [kv, setKv] = useState({ key: "", payload: {}, ttl: null });
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payloadIsValid, setPayloadIsValid] = useState(true);
    const [payloadJsonString, setPayloadJsonString] = useState("{}");
    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false);
    const navigate = useNavigate();

    const handlePayloadChange = (value) => {
        setPayloadJsonString(value);
        try {
            const parsed = JSON.parse(value);
            setKv({ ...kv, payload: parsed });
            setPayloadIsValid(true);
        } catch (e) {
            setPayloadIsValid(false);
        }
    };

    const addKVHandler = () => {
        if (!kv.key) {
            setDisabled(true);
            return;
        }

        if (!payloadIsValid) {
            toast.error(context.counterpart('dashboard.kv.message.invalidJson'));
            return;
        }

        try {
            const payload = JSON.parse(payloadJsonString);
            setKv(prev => ({ ...prev, payload }));
        } catch (e) {
            toast.error(context.counterpart('dashboard.kv.message.invalidJson'));
            return;
        }

        setLoading(true);
        const api_url = "/storage/kv";

        const payload = {
            key: kv.key,
            payload: kv.payload
        };

        if (kv.ttl) {
            payload.ttl = parseInt(kv.ttl);
        }

        axios.post(api_url, payload)
            .then(response => {
                setLoading(false);
                toast.success(context.counterpart('dashboard.kv.message.successAdd'))
                navigate("/kv");
            }).catch(err => {
                setLoading(false);
                console.error(err.response?.data?.error);
            });
    };

    return (
        <Container style={{ padding: "0" }}>
            <Row>
                <Col>
                    <div className="goBack">
                        <NavLink to="/kv" className="link fs-6">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.kv.addKV.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
                <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                    <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                        <Translate content="dashboard.kv.addKV.mainTitle" />
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.kv.addKV.inputs.key.title') + " *"} >
                        <Form>
                            <FormGroup>
                                <Input 
                                    className="blackableInput" 
                                    placeholder={context.counterpart('dashboard.kv.addKV.inputs.key.placeholder')} 
                                    onChange={(e) => setKv({ ...kv, key: e.target.value })} 
                                    invalid={disabled} 
                                />
                                <FormText>
                                    <Translate content="dashboard.kv.addKV.inputs.key.subtitle" />
                                </FormText>
                            </FormGroup>
                        </Form>
                    </CardComponent>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.kv.addKV.inputs.payload.title')} >
                        <Form>
                            <FormGroup>
                                <EditorBox
                                    title={context.counterpart('dashboard.kv.addKV.inputs.payload.title')}
                                    textToCopy={payloadJsonString}
                                    handleFullScreen={() => setShowEditorFullScreen(true)}
                                    language="json"
                                    value={payloadJsonString}
                                    height="200px"
                                    onChange={handlePayloadChange}
                                />
                                <EditorModal
                                    isOpen={showEditorFullScreen}
                                    toggle={() => setShowEditorFullScreen(!showEditorFullScreen)}
                                    language="json"
                                    value={payloadJsonString}
                                    onChange={handlePayloadChange}
                                />
                                <FormText className="mt-2">
                                    <Translate content="dashboard.kv.addKV.inputs.payload.subtitle" />
                                </FormText>
                            </FormGroup>
                        </Form>
                    </CardComponent>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.kv.addKV.inputs.ttl.title')} >
                        <Form>
                            <FormGroup>
                                <Input 
                                    className="blackableInput" 
                                    type="number" 
                                    placeholder={context.counterpart('dashboard.kv.addKV.inputs.ttl.placeholder')} 
                                    onChange={(e) => setKv({ ...kv, ttl: e.target.value })} 
                                />
                                <FormText>
                                    <Translate content="dashboard.kv.addKV.inputs.ttl.subtitle" />
                                </FormText>
                            </FormGroup>
                        </Form>
                    </CardComponent>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px" }}>
                <Col className="text-center">
                    <LoadingButton
                        loading={loading}
                        onClick={addKVHandler}
                    >
                        <Translate content="common.button.create" />
                    </LoadingButton>
                </Col>
            </Row>
        </Container>
    );
}

export default AddKV;
