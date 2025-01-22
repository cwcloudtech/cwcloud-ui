import { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Input, Form, FormGroup, Label } from "reactstrap";
import classes from '../public.module.css';
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import LocalStorage from '../../../utils/localStorageService';
import GlobalContext from '../../../Context/GlobalContext';
import BackGroundImage from "../../../assets/images/background.png";
import Translate from "react-translate-component";
import LoadingButton from '../../../Components/LoadingButton/LoadingButton';
import logoimage from '../../../utils/logo';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const docUrl = process.env.REACT_APP_DOCURL;

function LoginForm() {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showPassword, setShowPassword] = useState(false);

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

    const inputChangeHandler = (e) => {
        if (e.key === 'Enter')
            loginHandler()
    }

    const loginHandler = () => {
        setLoadingSubmit(true)
        axios.post('/auth/login', { email: email, password: password })
            .then(response => {
                setLoadingSubmit(false)
                if (response.data.confirmed === true) {
                    if (response.data.methods.length > 0) {
                        if (response.data.methods.map(m => m.type).includes('security_key'))
                            if (response.data.methods.map(m => m.type).includes('auth_app'))
                                navigate(`/u2f-authentification/${response.data.token}?app=true`)
                            else
                                navigate(`/u2f-authentification/${response.data.token}`)

                        else
                            navigate(`/2fa-authentification/${response.data.token}`)
                    } else {
                        // navigate(`/setup-2fa/${response.data.token}`)
                        LocalStorage.setAccessToken(response.data.token)
                        window.location.href = '/dashboard'
                    }
                }
                else {
                    toast.error(context.counterpart('login.error.accountNotActivated') + ' ' + process.env.REACT_APP_EMAIL)
                }
            })
            .catch(error => {
                setLoadingSubmit(false)
            })
    }
    if (loading)
        return null
    return (
        <Row className={classes.row}>
            <Col md="4" sm="12" className={classes.mainContainer}>
                <Row style={{ width: "100%" }}>
                    <Col className={classes.logoContainer} >
                        <img src={logoimage()} className={classes.cwcloudLogo} alt="logo" />
                        <div className="wiki-subtitle">
                            <Translate content="intro.presentation" />
                            <br />
                            <Translate content="intro.wiki.part1" />{" "}
                            <a  href={docUrl} target="_blank" rel="noreferrer">
                                <Translate content="intro.wiki.part2" />
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row style={{ width: "100%" }}>
                    <Col className="formContainer">
                        <Row className={classes.form}>
                            <Col style={{ padding: "0" }}>
                                <h4 className={classes.headerTitle}><Translate content="login.title" /></h4>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <Form>
                                    <FormGroup floating>
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder={context.counterpart('login.email')}
                                            type="email"
                                            onChange={e => {
                                                setemail(e.target.value)
                                            }}
                                            onKeyDown={inputChangeHandler}
                                        />
                                        <Label for="email">
                                            <Translate content="login.email" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="password"
                                            name="password"
                                            placeholder={context.counterpart('login.password')}
                                            type={showPassword ? "text" : "password"}
                                            onChange={e => {
                                                setpassword(e.target.value)
                                            }}
                                            onKeyDown={inputChangeHandler}
                                        />
                                        <Label for="password">
                                            <Translate content="login.password" />
                                        </Label>
                                        <div className={classes.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash  /> : <FaEye />}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </Col>
                            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '15px'}}>
                                <Link to="/forget-password" >
                                    <Translate content="login.forgottenpassword" style={{color: '#0861AF'}}/>
                                </Link>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <LoadingButton loading={loadingSubmit} icon="fa-solid fa-right-to-bracket" className={classes.buttonStyle} onClick={() => loginHandler()}>
                                    <Translate content="login.button" style={{color: "white" }} />
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
                                    <Translate content="login.question" /> {"     "}
                                    <NavLink  to="/signup" style={{ textDecoration: "none" }}>
                                        <Translate content="login.signup" style={{color: '#0861AF'}}/>
                                    </NavLink>
                                    {" | "}
                                    <NavLink  to="/contact" style={{ textDecoration: "none" }}>
                                        <Translate content="login.contact" style={{color: '#0861AF'}}/>
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
        </Row >
    )
}

export default LoginForm
