import { useContext, useEffect, useState } from 'react';
import { Col, Row, Container, Form, FormGroup, Label, Input, FormFeedback } from "reactstrap";
// import classes from "./ObjectType.module.css";
import '../../../../../../common.css';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from '../../../../../../Context/Colors';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FormControlLabel, TextField } from '@mui/material';
import EditorBox from '../../../../../../Components/EditorBox/EditorBox';
import EditorModal from '../../../../../../Components/Modal/EditorModal';
import { saveAs } from 'file-saver';
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import IOSSwitch from '../../../../../../utils/iosswitch';
import TriggersTable from '../../../../../../Components/Table/TriggersTable';
import TriggerModal from '../../../../../../Components/Modal/InputModals/TriggerModal';
import CardComponent from '../../../../../../Components/Cards/CardComponent/CardComponent';
import axios from '../../../../../../utils/axios';
import { toast } from 'react-toastify';
import SuggestionsAutoComplete from '../../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete';
import LoadingSpinner from '../../../../../../Components/LoadingSpinner/LoadingSpinner';
import formateDate from '../../../../../../utils/FormateDate';

function ObjectType() {
    const context = useContext(GlobalContext);
    const navigate = useNavigate()
    const location = useLocation()
    const _mode = context.mode;
    const { id } = useParams()
    const currentPath = location.pathname
    const nextPath = currentPath === `/iot/object-type/${id}` ? `/iot/overview` : `/admin/iot/overview`
    const is_admin = currentPath.includes("admin")
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [loadingExport, setLoadingExport] = useState(false)
    const [withEditor, setWithEditor] = useState(false)
    const [showEditorFullScreen, setShowEditorFullScreen] = useState(false)
    const [showAddNewTriggerModal, setShowAddNewTriggerModal] = useState(false)
    const [showEditTriggerModal, setShowEditTriggerModal] = useState(false)
    const [users, setUsers] = useState([])

    const [selectedTrigger, setSelectedTrigger] = useState("")
    const [triggerIndex, setTriggerIndex] = useState(0)

    const [isPublic, setIsPublic] = useState(false)
    const [name, setName] = useState("")
    const [decodingFunction, setDecodingFunction] = useState("")
    const [triggers, setTriggers] = useState([])
    const [selectedUserEmail, setSelectedUserEmail] = useState("")
    const [selectedUserId, setSelectedUserId] = useState("")
    const [lastUpdate, setLastUpdate] = useState("")
    const [objectType, setObjectType] = useState({
        content: {
            "public": false,
            "name": "",
            "decoding_function": "",
            "triggers": [],
        }
    })

    useEffect(() => {
        if (is_admin) {
            setObjectType(prevState => ({
                ...prevState,
                user_id: context.user.id
            }));
            context.setIsGlobal(true)
            axios.get("/admin/user/all")
                .then(res => {
                    setUsers(res.data.result) 
                })
        }
        setLoading(true)
        axios.get(`/iot/object-type/${id}`)
            .then(res => {
                var result = res.data
                delete result.id
                delete result.created_at
                setLastUpdate(result.updated_at)
                delete result.updated_at
                if (!is_admin) {
                    delete result.user_id
                } 
                setObjectType(result)
                setName(res.data.content.name)
                setDecodingFunction(res.data.content.decoding_function)
                setIsPublic(res.data.content.public)
                setTriggers(res.data.content.triggers)
                setSelectedUserId(res.data.user_id)
                setLoading(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        var user_email = users.find(u => u.id === selectedUserId)?.email
        setSelectedUserEmail(user_email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUserId])


    const handleClickButton = () => {
        setLoadingSubmit(true)
        if (is_admin) {
            handleAddSelectedUser(selectedUserEmail)
        }
        axios.put(`/iot/object-type/${id}`, objectType)
            .then(res => {
                toast.success(context.counterpart("dashboard.iot.message.successUpdateObjectType"))
                setLoadingSubmit(false)
                navigate(nextPath)
            })
            .catch(err => {
                toast.error(context.counterpart("dashboard.iot.message.errorUpdateObjectType"))
                setLoadingSubmit(false)
            })
    }

    const handleAddNewTrigger = () => {
        setTriggers([...triggers, ""])
        setShowAddNewTriggerModal(true)
    }

    const handleEditTrigger = (index) => {
        var selectedTrigger = triggers[index]
        setShowEditTriggerModal(true)
        setSelectedTrigger(selectedTrigger)
        setTriggerIndex(index)
    }

    const handleDeleteTrigger = (index) => {
        const newTriggers = [...triggers]
        newTriggers.splice(index, 1)
        setTriggers(newTriggers)
        setObjectType(prevState => ({
            ...prevState,
            content: {
                ...prevState.content,
                triggers: newTriggers
            }
        }));
    }

    const handleChangeTrigger = (index, value) => {
        const newTriggers = [...triggers]
        newTriggers[index] = value
        setTriggers(newTriggers)
        setObjectType(prevState => ({
            ...prevState,
            content: {
                ...prevState.content,
                triggers: newTriggers
            }
        }));
    }
    
    const handleAddSelectedUser = (email) => {
        const userId = users.find(u => u.email === email).id
        setSelectedUserId(userId)
        setObjectType(prevState => ({
            ...prevState,
            user_id: userId
        }));
    }

    const navigateToNextPath = () => {
        navigate(nextPath)
    }

    const exportObjectTypeHandler = () => {
        setLoadingExport(true)
        axios.get(`/iot/object-type/${id}/export`)
            .then(res => {
                const byteCharacters = atob(res.data.blob.toString('base64'));
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const jsonBlob = new Blob([byteArray], { type: 'application/json' });
                saveAs(jsonBlob, `${id}.json`);
                toast.success(context.counterpart('dashboard.iot.message.successExportObjectType'))
                setLoadingExport(false)
            })
            .catch(err => {
                setLoadingExport(false)
                toast.error(context.counterpart("dashboard.iot.message.errorExportObjectType"))
            })
    }

    if (loading)
        return <LoadingSpinner />
    else
        return (
            <div>
                <TriggerModal title="dashboard.iot.inputs.triggers.addModalTitle" isOpen={showAddNewTriggerModal} toggle={() => setShowAddNewTriggerModal(!showAddNewTriggerModal)} variable={triggers[triggers.length-1]} index={triggers.length-1} onClick={handleChangeTrigger} />
                <TriggerModal title="dashboard.iot.inputs.triggers.editModalTitle" isOpen={showEditTriggerModal} toggle={() => setShowEditTriggerModal(!showEditTriggerModal)} variable={selectedTrigger} index={triggerIndex} onClick={handleChangeTrigger} />
                <Row>
                    <Col>
                        <div onClick={navigateToNextPath} className="goBack">
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
                                <Translate content="dashboard.iot.updateObjectType.mainTitle" />
                            </h5>
                            {
                                is_admin &&
                                <h4 className="createdStyle" style={{color: colors.smallTitle[_mode]}}><Translate content="dashboard.table.updatedAt" /> : {formateDate(lastUpdate)}</h4>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <LoadingButton loading={loadingExport} onClick={exportObjectTypeHandler}>Export</LoadingButton>
                        </Col>
                    </Row>
                    <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", marginTop: "10px" }}>
                        <div style={{width: "fit-content"}}>
                            <div className="toggleContainer" style={{ backgroundColor: colors.secondBackground[_mode], border: "1px solid "+colors.border[_mode], color: colors.mainText[_mode] }}>
                                <div className={!withEditor? "activeToggleItemContainer": "toggleItemContainer"}
                                    onClick={() => setWithEditor(false)}>
                                    <h5 className="toggleItemText">
                                        <Translate content="dashboard.iot.state.graphicMode.title" />
                                    </h5>
                                </div>
                                <div className={withEditor? "activeToggleItemContainer": "toggleItemContainer"}
                                    onClick={() => setWithEditor(true)}>
                                    <h5 className="toggleItemText">
                                        <Translate content="dashboard.iot.state.editorMode.title" />
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </Row>
                    {
                        !withEditor && 
                        <>
                            <Row style={{ margin: "30px 0px" }}>
                                <Col>
                                    <CardComponent
                                        containerStyles=""
                                        customMarginTop={"20px"}>
                                        <Form>
                                            <FormGroup>
                                                <Label style={{ color: colors.title[_mode] }}>
                                                    {context.counterpart('dashboard.iot.inputs.name.title')}
                                                </Label>
                                                <Input className="blackableInput"
                                                    placeholder={context.counterpart('dashboard.iot.inputs.name.placeholder')}
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(e.target.value);
                                                        setObjectType(prevState => ({
                                                            ...prevState,
                                                            content: {
                                                                ...prevState.content,
                                                                name: e.target.value
                                                            }
                                                        }));
                                                    }}
                                                />
                                                <div style={{ paddingBottom: "20px" }}/>
                                                <Label style={{ color: colors.title[_mode] }}>
                                                    {context.counterpart('dashboard.iot.inputs.decodingFunction.title')}
                                                </Label>
                                                <Input className="blackableInput"
                                                    placeholder={context.counterpart('dashboard.iot.inputs.decodingFunction.placeholder')}
                                                    value={decodingFunction}
                                                    onChange={(e) => {
                                                        setDecodingFunction(e.target.value);
                                                        setObjectType(prevState => ({
                                                            ...prevState,
                                                            content: {
                                                                ...prevState.content,
                                                                decoding_function: e.target.value
                                                            }
                                                        }));
                                                    }}
                                                />
                                                <FormFeedback>
                                                    <Translate className="errorText" content="common.message.thisFieldIsRequired" />
                                                </FormFeedback>
                                            </FormGroup>
                                            {
                                                is_admin &&
                                                <Row>
                                                    <Label style={{ color: colors.title[_mode] }}>
                                                        {context.counterpart('dashboard.iot.inputs.ownerEmail.title')}
                                                    </Label>
                                                    <SuggestionsAutoComplete
                                                        id="combo-box-email"
                                                        value={selectedUserEmail}
                                                        onChange={(event, newValue) => {
                                                            setSelectedUserEmail(newValue)
                                                        }}
                                                        options={users.map(u => u.email)}
                                                        renderInput={(params) =>
                                                            <TextField
                                                                onChange={(e) => {
                                                                    setSelectedUserEmail(e.target.value)
                                                                }}
                                                                {...params}
                                                                value={selectedUserEmail}
                                                                placeholder={context.counterpart('dashboard.iot.inputs.ownerEmail.placeholder')}
                                                            />
                                                        }
                                                        feedbackMessage="common.message.thisFieldIsRequired"
                                                    />
                                                </Row>
                                            }
                                            <Row>
                                                <FormControlLabel
                                                    label={context.counterpart("dashboard.iot.inputs.is_public")}
                                                    control={<IOSSwitch sx={{ m: 1 }} defaultChecked={isPublic} />}
                                                    onChange={
                                                        (e) => {
                                                            setIsPublic(e.target.checked);
                                                            setObjectType(prevState => ({
                                                                ...prevState,
                                                                content: {
                                                                    ...prevState.content,
                                                                    public: e.target.checked
                                                                }
                                                            }));
                                                        }
                                                    }
                                                />
                                            </Row>
                                        </Form>
                                    </CardComponent>
                                </Col>
                            </Row>
                            <Row style={{ margin: "30px 0px" }}>
                                <Col md="12">
                                    <TriggersTable
                                        triggers={triggers}
                                        addNewTrigger={handleAddNewTrigger}
                                        editTrigger={handleEditTrigger}
                                        deleteTrigger={handleDeleteTrigger}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                    {
                        withEditor &&
                        <Row style={{ margin: "30px 0px" }}>
                            <Col md="12">
                                <EditorBox
                                    title={context.counterpart('dashboard.iot.addObjectType.mainTitle')}
                                    textToCopy={JSON.stringify(objectType, null, 4)}
                                    handleFullScreen={() => setShowEditorFullScreen(true)}
                                    language="json"
                                    value={JSON.stringify(objectType, null, 4)}
                                    onChange={(value) => {
                                        try {
                                            const parsedValue = JSON.parse(value);
                                            setObjectType(parsedValue);
                                        } catch (error) {
                                            console.error("Invalid JSON:", error);
                                        }
                                    }}
                                />
                                <EditorModal
                                    isOpen={showEditorFullScreen}
                                    toggle={() => setShowEditorFullScreen(!showEditorFullScreen)}
                                    language="json"
                                    value={JSON.stringify(objectType, null, 4)}
                                    onChange={(value) => {
                                        try {
                                            const parsedValue = JSON.parse(value);
                                            setObjectType(parsedValue);
                                        } catch (error) {
                                            console.error("Invalid JSON:", error);
                                        }
                                    }} 
                                />
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "20px" }}>
                            <LoadingButton icon="fa-solid fa-floppy-disk" loading={loadingSubmit} onClick={handleClickButton} style={{ width: "250px", height: "50px" }} variant="outlined">
                                <Translate content="common.button.update" />
                            </LoadingButton>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
}
export default ObjectType
