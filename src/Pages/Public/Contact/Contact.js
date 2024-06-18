import { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Input, Form, FormGroup, Label } from "reactstrap";
import classes from '../public.module.css';
import axios from "../../../utils/axios";
import { isBlank } from "../../../utils/common";
import { toast } from "react-toastify";
import GlobalContext from '../../../Context/GlobalContext';
import BackGroundImage from "../../../assets/images/background.png"
import Translate from "react-translate-component";
import LoadingButton from '../../../Components/LoadingButton/LoadingButton';
import logoimage from '../../../utils/logo';
import resetField from '../../../utils/resetField';
const docUrl = process.env.REACT_APP_DOCURL;

function Contact() {
    const [loadingSend, setLoadingSend] = useState(false)
    const [contactInfo, setContactInfo] = useState({})
    const [loading, setLoading] = useState(true)

    const context = useContext(GlobalContext)
    const navigate = useNavigate()

    const state = useLocation()

    useEffect(() => {
        state && toast.success(state.state)
    }, [state])
    useEffect(() => {
        if (context.user)
            navigate("/dashboard")
        else
            setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const sendContactEmail = () => {
        if (isBlank(contactInfo.email)) {
            return toast.error(context.counterpart("dashboard.contact.message.missingEmail"))
        }

        if (isBlank(contactInfo.subject)) {
            return toast.error(context.counterpart("dashboard.contact.message.missingSubject"))
        }

        if (isBlank(contactInfo.message)) {
            return toast.error(context.counterpart("dashboard.contact.message.missingMessage"))
        }

        setLoadingSend(true)
        axios.post("/contact", contactInfo)
            .then(res => {
                toast.success(context.counterpart("dashboard.contact.message.success"))
                setContactInfo({})
                setLoadingSend(false)
            })
            .catch(err => {
                setLoadingSend(false)
            })
        
        resetField("email")
        resetField("subject")
        resetField("message")          
    }
    
    if (loading) {
        return null;
    }
    
    return (
        <Row className={classes.row}>
            <Col md="4" sm="12" className={classes.mainContainer}>
                <Row style={{ width: "100%" }}>
                    <Col className={classes.logoContainer}>
                        <img src={logoimage()} className={classes.comWorkLogo} alt="logo" />
                        <div className="wiki-subtitle">
                            <Translate content="intro.presentation" />
                            <br />
                            <Translate content="intro.wiki.part1" />{" "}
                            <a href={docUrl} target="_blank" rel="noreferrer">
                                <Translate content="intro.wiki.part2" />
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row style={{ width: "100%" }}>
                    <Col className="formContainer">
                        <Row className={classes.form}>
                            <Col style={{ padding: "0" }}>
                                <h4 className={classes.headerTitle}>
                                    <Translate content="dashboard.contact.title" />
                                </h4>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <Form>
                                    <FormGroup floating>
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder={context.counterpart('dashboard.contact.inputs.email')}
                                            type="email"
                                            onChange={e => {
                                                setContactInfo({ ...contactInfo, email: e.target.value })
                                            }}
                                        />
                                        <Label for="email">
                                            <Translate content="dashboard.contact.inputs.email" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            placeholder={context.counterpart('dashboard.contact.inputs.subject')}
                                            onChange={e => {
                                                setContactInfo({ ...contactInfo, subject: e.target.value })
                                            }}
                                        />
                                        <Label for="subject">
                                            <Translate content="dashboard.contact.inputs.subject" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="message"
                                            name="message"
                                            placeholder={context.counterpart('dashboard.contact.inputs.message')}
                                            type = "textarea"
                                            style={{height: "130px"}}
                                            onChange={(e) => setContactInfo({ ...contactInfo, message: e.target.value })} 
                                        />
                                        <Label for="message">
                                            <Translate content="dashboard.contact.inputs.message" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                </Form>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <LoadingButton loading={loadingSend} icon="fa-solid fa-right-to-bracket" className={classes.buttonStyle} onClick={sendContactEmail}>
                                    <Translate content="common.button.send" style={{color: 'white'}}/>
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={classes.centerRow}>
                    <Col style={{ display: 'flex', justifyContent: "center", alignItems: "end" }}>
                        <h4 style={{ color: "rgb(130,130,130)", fontSize: '14px', textAlign: "center" }}>
                            <Translate content="login.question" /> {"     "}
                            <NavLink to="/signup" style={{ textDecoration: "none" }}>
                                <Translate content="login.signup" style={{color: '#0861AF'}}/>
                            </NavLink>
                        </h4>
                    </Col>
                </Row>
            </Col>
            <Col md="8" sm="0" className={classes.backgroundLogin}>
                <img className={classes.imageStyle} src={BackGroundImage} alt="background"></img>
            </Col>
        </Row >
    )
}

export default Contact
