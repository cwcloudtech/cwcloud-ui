import { useContext, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import { Col, Container, Row } from "reactstrap";
import EditorBox from '../../../../../../Components/EditorBox/EditorBox';
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import EditorModal from '../../../../../../Components/Modal/EditorModal';
import colors from '../../../../../../Context/Colors';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from '../../../../../../utils/axios';
import '../../../../../../common.css';

function AddData() {
    const context = useContext(GlobalContext);
    const navigate = useNavigate()
    const location = useLocation()
    const _mode = context.mode;
    const currentPath = location.pathname 
    const nextPath = currentPath === '/iot/add/data' ? '/iot/overview': '/admin/iot/overview'
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false)
    const [data, setData] = useState({
        device_id: "",
        content: "{}"
    })

    const handleClickButton = () => {
        setLoadingSubmit(true)
        axios.post("/iot/data", data)
            .then(response => {
                setLoadingSubmit(false)
                toast.success(context.counterpart("dashboard.iot.message.successAddData"))
                navigate(nextPath)
            })
            .catch(error => {
                setLoadingSubmit(false)
            })
    }

    const navigateToNextPath = () => {
        navigate(nextPath)
    }

    return (
        <div>
            <Row>
                <Col>
                    <div onClick={navigateToNextPath} className='goBack'>
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
                            <Translate content="dashboard.iot.addData.mainTitle" />
                        </h5>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col md="12">
                        <EditorBox
                            title={context.counterpart('dashboard.iot.addData.mainTitle')}
                            textToCopy={JSON.stringify(data, null, 4)}
                            handleFullScreen={() => setShowEditorFullScreen(true)}
                            language="json"
                            value={JSON.stringify(data, null, 4)}
                            onChange={(value) => {
                                try {
                                    const parsedValue = JSON.parse(value);
                                    setData(parsedValue);
                                } catch (error) {
                                    console.error("Invalid JSON:", error);
                                }
                            }}
                        />
                        <EditorModal
                            isOpen={showEditorFullScreen}
                            toggle={() => setShowEditorFullScreen(!showEditorFullScreen)}
                            language="json"
                            value={JSON.stringify(data, null, 4)}
                            onChange={(value) => {
                                try {
                                    const parsedValue = JSON.parse(value);
                                    setData(parsedValue);
                                } catch (error) {
                                    console.error("Invalid JSON:", error);
                                }
                            }} 
                        />
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
export default AddData
