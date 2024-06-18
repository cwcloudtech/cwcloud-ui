import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../../utils/axios";
import classes from '../public.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col, Input, Form, FormGroup, Label, FormFeedback } from "reactstrap";
import BackGroundImage from "../../../assets/images/background.png"
import GlobalContext from '../../../Context/GlobalContext';
import Translate from "react-translate-component";
import LoadingButton from "../../../Components/LoadingButton/LoadingButton";
import logoimage from "../../../utils/logo";
import { toast } from "react-toastify";

function ForgetPassword() {
    const [message, setMessage] = useState(null)
    // eslint-disable-next-line
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const context = useContext(GlobalContext)

    const sendEmailHandler = () => {
        setLoading(true)
        axios.post('/user/forget-password', { email })
            .then(res => {
                setLoading(false)
                setIsError(false)
                toast.success(context.counterpart('password.forgotten.successMessage'))
            })
            .catch(err => {
                setLoading(false)
                if (err.response.status === 404) {
                    toast.error(context.counterpart('password.forgotten.notfound'))
                }
                setIsError(true)
            })
    }

    const inputChangeHandler = (e) => {
        if (e.key === 'Enter') {
            sendEmailHandler()
        }
    }

    return (
        <Row className={classes.row} >
            <Col md="4" sm="12" className={classes.mainContainer}>
                <Row style={{ width: "100%" }}>
                    <Col className={classes.logoContainer}>
                        <img src={logoimage()} className={classes.comWorkLogo} alt="logo" />
                    </Col>
                </Row>
                <Row style={{ width: "100%" }}>
                <Col className="formContainer">
                        <Row className={classes.form}>
                            <Col style={{ padding: "0" }}>
                                <h4 className={classes.headerTitle}>
                                    <Translate content="login.forgottenpassword" />
                                </h4>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <Form>
                                    <FormGroup floating>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={context.counterpart('signup.email')}
                                            value={email}
                                            onKeyDown={inputChangeHandler}
                                            onFocus={() => { setMessage(null) }}
                                            onChange={(e) => { setEmail(e.target.value) }}
                                        />
                                        <Label for="email">
                                            <Translate content="login.email" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormFeedback>{message}</FormFeedback>
                                </Form>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <LoadingButton loading={loading} icon="fa-solid fa-right-to-bracket" className={classes.buttonStyle} onClick={sendEmailHandler}>
                                    <Translate content="common.button.send" style={{color: "white"}}/>
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={classes.centerRow}>
                    <Col style={{ marginTop: '10px' }}>
                        <Row>
                            <Col style={{ display: 'flex', justifyContent: "center", alignItems: "end" }}>
                                <h4 style={{ color: "rgb(130,130,130)", fontSize: '14px', textAlign: "center" }}>
                                    <NavLink to="/" style={{ textDecoration: "none" }}>
                                        <Translate content="login.goBackToLogin" style={{color: '#0861AF'}}/>
                                    </NavLink>
                                </h4>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col md="8" sm="0" className={classes.backgroundLogin}>
                <img className={classes.imageStyle} src={BackGroundImage} alt="background"></img>
            </Col>
        </Row>
    )
}
export default ForgetPassword
