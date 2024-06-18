import { useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import { Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import CardComponent from '../../../../../../Components/Cards/CardComponent/CardComponent';
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import colors from '../../../../../../Context/Colors';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from '../../../../../../utils/axios';
import '../../../../../../common.css';

function Device() {
    const context = useContext(GlobalContext);
    const navigate = useNavigate()
    const location = useLocation()
    const _mode = context.mode
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const is_admin = context.user.is_admin
    const currentPath = location.pathname
    const selectedTypeObjectId = location.state?.typeObjectId
    const nextPath = currentPath === `/iot/add/device` ? `/iot/overview` : `/admin/iot/overview`
    const [typeObjectId, setTypeObjectId] = useState(selectedTypeObjectId || "")
    const [username, setUsername] = useState("")
    const [device, setDevice] = useState({
        "typeobject_id": typeObjectId,
        "username": "",
    })

    const handleClickButton = () => {
        setLoadingSubmit(true)
        axios.post("/iot/device", device)
            .then(response => {
                setLoadingSubmit(false)
                toast.success(context.counterpart("dashboard.iot.message.successAddDevice"))
                if (!is_admin) {
                    toast.success(context.counterpart("dashboard.iot.message.confirmationEmailSent"))
                }
                navigate(nextPath)
            })
    }

    return (
        <div>
            <Row>
                <Col>
                    <div onClick={() => navigate(nextPath)} className="goBack">
                        <NavLink className="link fs-6">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.iot.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                <Row>
                    <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                        <h5 className='textTitle' style={{color: colors.title[_mode]}}>
                            <Translate content="dashboard.iot.addDevice.mainTitle" />
                        </h5>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <CardComponent
                            containerStyles=""
                            customMarginTop={"20px"}>
                            <Form>
                                <FormGroup>
                                    <Label style={{ color: colors.title[_mode] }}>
                                        {context.counterpart('dashboard.iot.inputs.objectTypeId.title')}
                                    </Label>
                                    <Input className="blackableInput"
                                        placeholder={context.counterpart('dashboard.iot.inputs.objectTypeId.placeholder')}
                                        value={typeObjectId}
                                        onChange={(e) => {
                                            setTypeObjectId(e.target.value);
                                            setDevice(prevState => ({
                                                ...prevState,
                                                typeobject_id: e.target.value
                                            }));
                                        }}
                                    />
                                    <FormFeedback>
                                        <Translate className="errorText" content="common.message.thisFieldIsRequired" />
                                    </FormFeedback>
                                    <div style={{ paddingBottom: "20px" }}/>
                                    <Label style={{ color: colors.title[_mode] }}>
                                        {context.counterpart('dashboard.iot.inputs.username.title')}
                                    </Label>
                                    <Input className="blackableInput"
                                        placeholder={context.counterpart('dashboard.iot.inputs.username.placeholder')}
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setDevice(prevState => ({
                                                ...prevState,
                                                username: e.target.value
                                            }));
                                        }}
                                    />
                                    <FormFeedback>
                                        <Translate className="errorText" content="common.message.thisFieldIsRequired" />
                                    </FormFeedback>
                                </FormGroup>
                            </Form>
                        </CardComponent>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "20px" }}>
                        <LoadingButton icon="fa-solid fa-floppy-disk" loading={loadingSubmit} onClick={handleClickButton} style={{ width: "250px", height: "50px" }} variant="outlined">
                            <Translate content="common.button.create" />
                        </LoadingButton>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}
export default Device
