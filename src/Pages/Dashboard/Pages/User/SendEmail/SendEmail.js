import { useContext, useState, useEffect } from 'react';
import { Col, Row, Container } from "reactstrap";
import classes from "./SendEmail.module.css";
import '../../../../../common.css';
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import IOSSwitch from '../../../../../utils/iosswitch';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation } from 'react-router-dom';

function SendEmail() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [email, setEmail] = useState({
        from: "",
        to:"",
        subject: ""
    })
    const [recepientInputError, setRecepientInputError] = useState(false)
    const [subjectInputError, setSubjectInputError] = useState(false)
    const location = useLocation()
    const currentPath = location.pathname
    const is_admin = currentPath.includes('admin')

    useEffect(() => {
        context.setIsGlobal(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClickButton = () => {
        setLoadingSubmit(true)
        if (isBlank(email.to)) {
            setRecepientInputError(true)
            setLoadingSubmit(false)
        }

        if (isBlank(email.subject)) {
            setSubjectInputError(true)
            setLoadingSubmit(false)
        }
        var api_url = is_admin ? '/admin/email' : '/email'
        axios.post(api_url, email)
            .then(response => {
                setLoadingSubmit(false)
                toast.success(context.counterpart('dashboard.sendEmail.success'))
                setEmail({
                    from: "",
                    to: "",
                    subject: "",
                    content: ""  // assuming content is a field you want to clear
                });
            }).catch(err => {
                setLoadingSubmit(false)
            })
    }

    const quillConfig = {
        toolbar: {
            container: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
            ]
        }
    };

    return (
        <div>
            <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                <Row>
                    <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                        <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                            <Translate content="dashboard.sendEmail.mainTitle" />
                        </h5>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.sendEmail.from.title" />
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField id="from" label={context.counterpart('dashboard.sendEmail.from.placeholder')} onChange={(e) => setEmail({ ...email, from: e.target.value })} fullWidth />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.sendEmail.to.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField
                                id="to"
                                error={recepientInputError}
                                helperText={recepientInputError ? context.counterpart("common.message.thisFieldIsRequired"): ""}
                                label={context.counterpart('dashboard.sendEmail.to.placeholder')}
                                onChange={(e) => setEmail({ ...email, to: e.target.value })}
                                required
                                fullWidth
                            />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.sendEmail.subject.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField
                                    id="subject"
                                    error={subjectInputError}
                                    helperText={subjectInputError ? context.counterpart("common.message.thisFieldIsRequired") : ""}
                                    label={context.counterpart('dashboard.sendEmail.subject.placeholder')}
                                    onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                                    required
                                    fullWidth
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    is_admin &&
                    <Row style={{ marginTop: "30px", marginBottom: "90px", marginLeft: "0", marginRight: "0" }}>
                        <Col>
                            <FormControlLabel
                                label={context.counterpart('dashboard.sendEmail.templated')}
                                control={<IOSSwitch sx={{ m: 1 }} defaultChecked={email.templated} />}
                                onChange={(e) => setEmail({ ...email, templated: !email.templated })}
                            />
                        </Col>
                    </Row>
                }
                <Row className={classes.rowContainer} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '20px' }}>
                    <Col md="12">
                        <ReactQuill
                            style={{
                                width: "100%",
                                height: "500px",
                                color: _mode === 'dark' ? '#fff' : '#000',
                                backgroundColor: _mode === 'dark' ? '#31373D' : '#fff'
                              }}
                            value={email.content || ''}
                            modules={quillConfig}
                            onChange={v => setEmail({ ...email, content: v })}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "40px" }}>
                        <LoadingButton icon="fa-solid fa-paper-plane" loading={loadingSubmit} onClick={handleClickButton} style={{ width: "250px", height: "50px" }} variant="outlined">
                            <Translate content="dashboard.sendEmail.send" />
                        </LoadingButton>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}
export default SendEmail
