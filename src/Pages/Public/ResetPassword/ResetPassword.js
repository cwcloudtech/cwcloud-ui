import { useContext, useState, useEffect } from 'react';
import classes from '../public.module.css';
import { Col, Row, Input, Form, FormGroup, Label } from 'reactstrap';
import LocalStorageService from '../../../utils/localStorageService'
import axios from '../../../utils/axios'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner'
import Translate from 'react-translate-component'
import { toast } from 'react-toastify'
import LoadingButton from '../../../Components/LoadingButton/LoadingButton'
import BackGroundImage from "../../../assets/images/background.png"
import logoimage from '../../../utils/logo'
import GlobalContext from '../../../Context/GlobalContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = (props) => {
    const { token } = useParams()
    const [loading, setLoading] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [userEmail, setUserEmail] = useState(null)
    const [userNewCredentials, setUserNewCredentials] = useState({})
    const [loadingRequest, setLoadingRequest] = useState(false)
    const navigate = useNavigate();
    const context = useContext(GlobalContext)

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [])

    useEffect(() => {
        LocalStorageService.clearToken()
        if (token !== 'reset')
            axios.get(`/user/verify/${token}`)
                .then(res => {
                    setLoading(false)
                    setUserEmail(res.data.email)
                    navigate('/reset-password/reset')
                })
                .catch(err => {
                    if (err.response.status === 400)
                        navigate('/forget-password')
                    setLoading(false)
                })
        else {
            if (!userEmail) {
                navigate('/forget-password')
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, token])

    const resetPasswordHandler = () => {
        const { password, repassword } = userNewCredentials
        if (password === repassword) {
            setLoadingRequest(true)
            axios.post('/user/reset-password', { email: userEmail, password })
                .then(res => {
                    setLoadingRequest(false)
                    toast.success(context.counterpart('password.reset.successMessage'))
                    navigate('/login')
                })
                .catch(err => {
                    setLoadingRequest(false)
                    if (err.response.status === 400) {
                        toast.error(context.counterpart('password.reset.errorMessage'))
                    }
                })
        }
        else {
            toast.error(context.counterpart('password.reset.notsame'))
        }
    }

    const inputChangeHandler = (e) => {
        if (e.key === 'Enter') {
            resetPasswordHandler()
        }
    }

    if (loading)
        return <LoadingSpinner />

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
                                    Reset password
                                </h4>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <Form>
                                    <FormGroup floating>
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder={context.counterpart('password.reset.input')}
                                            onChange={(e) => { setUserNewCredentials({ ...userNewCredentials, password: e.target.value }) }}
                                            onKeyDown={inputChangeHandler}
                                        />
                                        <Label for="password">
                                            <Translate content="password.reset.input" />
                                        </Label>
                                        <div className={classes.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash  /> : <FaEye />}
                                        </div>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup floating>
                                        <Input
                                            id="repassword"
                                            name="repassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder={context.counterpart('password.reset.confirm')}
                                            onChange={(e) => { setUserNewCredentials({ ...userNewCredentials, repassword: e.target.value }) }}
                                            onKeyDown={inputChangeHandler}
                                        />
                                        <Label for="repassword">
                                            <Translate content="password.reset.confirm" />
                                        </Label>
                                        <div className={classes.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash  /> : <FaEye />}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <LoadingButton loading={loadingRequest} icon="fa-solid fa-right-to-bracket" className={classes.buttonStyle} onClick={resetPasswordHandler}>
                                    <Translate content="common.button.save" style={{color: 'white'}}/>
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ display: "flex", alignSelf: "center" }}>
                    <Col style={{ display: 'flex', justifyContent: "center", alignItems: "end", paddingTop: "7px" }}>
                        <h4 style={{ color: "rgb(130,130,130)", fontSize: '14px', textAlign: "center" }}>
                            <Translate content="password.reset.backToLoginQuestion" /> {"     "}
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

export default ResetPassword
