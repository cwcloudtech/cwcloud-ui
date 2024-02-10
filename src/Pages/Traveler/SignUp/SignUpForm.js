import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import classes from '../traveler.module.css';
import axios from "../../../utils/axios";
import { isBlank } from "../../../utils/common";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import GlobalContext from "../../../Context/GlobalContext";
import { Row, Col, Input, Form, FormGroup, Label} from "reactstrap";
import Alert from '@mui/material/Alert';
import BackGroundImage from "../../../assets/images/background.png"
import Translate from "react-translate-component";
import LoadingButton from "../../../Components/LoadingButton/LoadingButton";
import logoimage from "../../../utils/logo";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignUpForm() {
    const docUrl = process.env.REACT_APP_DOCURL;
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        is_admin: false
    })
    const [ConfirmPass, setConfirmPass] = useState("")
    const [loading, setLoading] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [showPasswordMatchError, setShowPasswordMatchError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const context = useContext(GlobalContext)
    const navigate = useNavigate()
    const signupHandler = () => {
        setShowPasswordMatchError(userData.password !== ConfirmPass);
        if (!acceptTerms) {
            return toast.error(context.counterpart('signup.error.acceptTerms'))

        }
        if (isBlank(userData.password)|| isBlank(ConfirmPass)) {
            return toast.error(context.counterpart('signup.error.passwordsNotFound'))
        }

        if (showPasswordMatchError) {
            return toast.error(context.counterpart('signup.error.passwordsNotMatch'))
        }

        if (isBlank(userData.email)) {
            return toast.error(context.counterpart('signup.error.emailNotFound'))
        }

        setLoading(true)
        axios.post("/user", userData).then(response => {
            setLoading(false)
            navigate('/', { state: response.data.message })
        }).catch(error => {
            setLoading(false)
        })
    }

    useEffect(() => {
        context.user ? navigate("/dashboard") : navigate('/signup') 
    }, [navigate, context.user])


    const inputChangeHandler = (e) => {
        if (e.key === 'Enter')
            signupHandler()
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
                    <Col className={classes.formContainer}>
                        <Row className={classes.form}>
                            <Col style={{ padding: "0" }}>
                                <h4 className={classes.headerTitle}>
                                    <Translate content="signup.title" />
                                </h4>
                            </Col>
                            <Col style={{ padding: "0", marginBottom: "20px" }}>
                                <span className={classes.subtitleStyle}>
                                    <Translate content="signup.instruction.part1" />
                                    <a className={classes.wikiDoc} href={docUrl + '/docs/subscription'} target="_blank" rel="noreferrer">
                                        <Translate content="signup.instruction.part2" />
                                    </a>{" "}
                                    <Translate content="signup.instruction.part3" />
                                </span>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <Form>
                                    <FormGroup floating>
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder={context.counterpart('signup.email')}
                                            type="email"
                                            onKeyDown={inputChangeHandler}
                                            onChange={e => {
                                                setUserData({ ...userData, email: e.target.value })
                                            }}
                                        />
                                        <Label for="email">
                                            <Translate content="signup.email" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="company-name"
                                            name="company-name"
                                            placeholder={context.counterpart('signup.company')}
                                            onKeyDown={inputChangeHandler}
                                            onChange={e => {
                                                setUserData({ ...userData, company_name: e.target.value })
                                            }}
                                        />
                                        <Label for="company-name">
                                            <Translate content="signup.company" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="registration-number"
                                            name="registration-number"
                                            placeholder={context.counterpart('signup.registrationNumber')}
                                            onKeyDown={inputChangeHandler}
                                            onChange={e => {
                                                setUserData({ ...userData, registration_number: e.target.value })
                                            }}
                                        />
                                        <Label for="registration-number">
                                            <Translate content="signup.registrationNumber" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="adress"
                                            name="adress"
                                            placeholder={context.counterpart('signup.address')}
                                            onKeyDown={inputChangeHandler}
                                            onChange={e => {
                                                setUserData({ ...userData, address: e.target.value })
                                            }}
                                        />
                                        <Label for="adress">
                                            <Translate content="signup.address" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="contact-information"
                                            name="contact-information"
                                            placeholder={context.counterpart('signup.contactInformations')}
                                            onKeyDown={inputChangeHandler}
                                            onChange={e => {
                                                setUserData({ ...userData, contact_info: e.target.value })
                                            }}
                                        />
                                        <Label for="contact-information">
                                            <Translate content="signup.contactInformations" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="password"
                                            name="password"
                                            placeholder={context.counterpart('signup.password')}
                                            type={showPassword ? "text" : "password"}
                                            value={userData.password}
                                            onKeyDown={inputChangeHandler}
                                            onChange={e => {
                                                setUserData({ ...userData, password: e.target.value })
                                            }}
                                        />
                                        <Label for="password">
                                            <Translate content="signup.password" />
                                        </Label>
                                        <div className={classes.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </div>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="verify-password"
                                            name="verify-password"
                                            placeholder={context.counterpart('signup.passwordConfirmation')}
                                            type={showPassword ? "text" : "password"}
                                            value={ConfirmPass}
                                            onKeyDown={inputChangeHandler}
                                            onChange={(e) => { setConfirmPass(e.target.value) }}
                                            invalid={showPasswordMatchError}
                                        />
                                        <Label for="verify-password">
                                            <Translate content="signup.passwordConfirmation" />
                                        </Label>
                                        <div className={classes.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </div>
                                    </FormGroup>
                                    {' '}
                                    <Col style={{ padding: "0", marginTop: "20px" }}>
                                        {showPasswordMatchError ? <Alert severity="info">Passwords did not match </Alert> : ''}
                                    </Col>
                                    {' '}
                                </Form>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                                    <Form check>
                                        <FormGroup
                                            check
                                            onChange={e => setAcceptTerms(e.target.checked)}
                                            inline
                                        >
                                            <Input checked={acceptTerms} type="checkbox" />
                                            <Label check>
                                            <h5 onClick={() => setAcceptTerms(!acceptTerms)} style={{ fontSize: '13px', fontWeight: '500', margin: '0' }}>
                                                <Translate content="signup.acceptTerms" />{' '}
                                                <a href={`${process.env.REACT_APP_DOCURL}/docs/terms/`}>
                                                    <Translate content="signup.terms" style={{color: '#0861AF'}}/>
                                                </a>.
                                            </h5>
                                            </Label>
                                        </FormGroup>
                                    </Form>
                                </div>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <LoadingButton loading={loading} icon="fa-solid fa-right-to-bracket" className={classes.buttonStyle} onClick={signupHandler}>
                                    <Translate content="signup.button" style={{color: 'white'}}/>
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={classes.centerRow}>
                    <Col style={{ display: 'flex', justifyContent: "center", alignItems: "end", paddingTop: "7px" }}>
                        <h4 style={{ color: "rgb(130,130,130)", fontSize: '14px', textAlign: "center" }}>
                            <Translate content="signup.question" /> {"     "}
                            <NavLink to="/" style={{ textDecoration: "none" }}>
                                <Translate content="signup.login" style={{color: '#0861AF'}}/>
                            </NavLink>
                        </h4>
                    </Col>
                </Row>
            </Col>
            <Col md="8" sm="0" className={classes.backgroundLogin}>
                <img className={classes.imageStyle} src={BackGroundImage} alt="background"></img>
            </Col>
        </Row>
    )
}
export default SignUpForm