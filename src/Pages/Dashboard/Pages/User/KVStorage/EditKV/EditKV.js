import { useContext, useState, useEffect } from "react";
import { Col, Form, FormGroup, FormText, Input, Row } from "reactstrap";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
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

function EditKV(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const location = useLocation();
    const { key } = useParams();
    const currentPath = location.pathname;
    const is_admin = currentPath.includes("admin");
    const nextPath = is_admin ? "/admin/kv" : "/kv";
    const [kv, setKv] = useState({ key: "", payload: {}, ttl: null });
    const [loading, setLoading] = useState(false);
    const [payloadIsValid, setPayloadIsValid] = useState(true);
    const [payloadJsonString, setPayloadJsonString] = useState("{}");
    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state && location.state.kvEntry) {
            const { key, payload, ttl } = location.state.kvEntry;
            setKv({ key, payload, ttl });
            setPayloadJsonString(JSON.stringify(payload, null, 2));
        } else {
            // Fetch KV entry if not passed in state
            fetchKVEntry();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchKVEntry = () => {
        const api_url = is_admin 
            ? `/admin/storage/kv/key/${key}`
            : `/storage/kv/${key}`;
            
        axios.get(api_url)
            .then(response => {
                const { key, payload, ttl } = response.data;
                setKv({ key, payload, ttl });
                setPayloadJsonString(JSON.stringify(payload, null, 2));
            })
            .catch(err => {
                toast.error(context.counterpart('dashboard.kv.message.errorFetchEntry'));
                console.error(err.response?.data?.error);
                navigate(nextPath);
            });
    };

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

    const updateKVHandler = () => {
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
        const api_url = is_admin 
            ? `/admin/storage/kv/user/${location.state?.kvEntry?.user_id}/storage/${kv.key}`
            : `/storage/kv/${kv.key}`;

        const payload = {
            payload: kv.payload
        };

        if (kv.ttl) {
            payload.ttl = parseInt(kv.ttl);
        }

        axios.put(api_url, payload)
            .then(response => {
                setLoading(false);
                toast.success(context.counterpart('dashboard.kv.message.successUpdate'))
                navigate(nextPath);
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
                        <NavLink to={nextPath} className="link fs-6">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.kv.editKV.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
                <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                    <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                        <Translate content="dashboard.kv.editKV.mainTitle" />: "{kv.key}"
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        title={context.counterpart('dashboard.kv.editKV.inputs.payload.title')} >
                        <Form>
                            <FormGroup>
                                <EditorBox
                                    title={context.counterpart('dashboard.kv.editKV.inputs.payload.title')}
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
                                    <Translate content="dashboard.kv.editKV.inputs.payload.subtitle" />
                                </FormText>
                            </FormGroup>
                        </Form>
                    </CardComponent>
                </Col>
            </Row>
            {
                kv.ttl !== null && (
                    <Row>
                        <Col>
                            <CardComponent
                                containerStyles={props.containerStyles}
                                title={context.counterpart('dashboard.kv.editKV.inputs.ttl.title')} >
                                <Form>
                                    <FormGroup>
                                        <Input 
                                            className="blackableInput" 
                                            type="number" 
                                            placeholder={context.counterpart('dashboard.kv.editKV.inputs.ttl.placeholder')} 
                                            value={kv.ttl || ''}
                                            onChange={(e) => setKv({ ...kv, ttl: e.target.value })} 
                                        />
                                        <FormText>
                                            <Translate content="dashboard.kv.editKV.inputs.ttl.subtitle" />
                                        </FormText>
                                    </FormGroup>
                                </Form>
                            </CardComponent>
                        </Col>
                    </Row>
                )
            }
            <Row style={{ marginTop: "20px" }}>
                <Col className="text-center">
                    <LoadingButton
                        loading={loading}
                        onClick={updateKVHandler}
                    >
                        <Translate content="common.button.update" />
                    </LoadingButton>
                </Col>
            </Row>
        </Container>
    );
}

export default EditKV;
