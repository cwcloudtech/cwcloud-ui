import { useState, useContext, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from '../traveler.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col, Spinner } from "reactstrap";
import BackGroundImage from "../../../assets/images/background.png"
import Translate from "react-translate-component";
import axios from 'axios'
import { toast } from "react-toastify";
import GlobalContext from "../../../Context/GlobalContext";
import logoimage from '../../../utils/logo';
import * as queryString from 'query-string';
import LoadingButton from "../../../Components/LoadingButton/LoadingButton";
import LocalStorageService from "../../../utils/localStorageService";
const apiHost = process.env.REACT_APP_APIURL;
const apiVersion = process.env.REACT_APP_APIVERSION;
const docUrl = process.env.REACT_APP_DOCURL;
function U2fAuthentification() {
    const [errorMessage, setErrorMessage] = useState(null)
    const context = useContext(GlobalContext)
    const [otpCode, setOtpCode] = useState(null)
    const inputRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [allowAuthApp, setAllowAuthApp] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { token } = useParams()

    useEffect(() => {
        setLoading(false)
        const parsedQuery = queryString.parse(location.search);
        if (parsedQuery.app === 'true')
            setAllowAuthApp(true)
    }, [location])

    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus()
        }
    }, [inputRef])
    const inputChangeHandler = (e) => {
        if (e.key === 'Enter') {
            setLoading(true)
            verifyAuthentificationKey()
        }
    }
    const verifyAuthentificationKey = () => {
        axios.post(`${apiHost}/${apiVersion}/mfa/u2f/verify`, { code: otpCode }, {
            headers: {
                'X-User-Token': token
            }
        })
            .then(res => {
                LocalStorageService.setToken(res.data.token)
                window.location.href = "/dashboard"
            })
            .catch(err => {
                if (err.response.status === 400) {
                    setErrorMessage(context.counterpart('multiFactorAuth.error'))
                } else if (err.response.status === 401) {
                    toast.error(context.counterpart('multiFactorAuth.unauthorized'))
                }
            })
    }

    return (
        <Row className={classes.row} >
            <Col md="8" sm="0" className={classes.backgroundLogin}>
                <img className={classes.imageStyle} src={BackGroundImage} alt="background"></img>
            </Col>
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
                                    <Translate content="setup2fa.title" />
                                </h4>
                                <h5 className={classes.headerTitle} style={{ fontSize: '12px' }}>
                                    <span className={classes.subtitleStyle}>
                                        <Translate content="setup2fa.instruction.part1" />
                                        <a className={classes.wikiDoc} href={docUrl + '/docs/subscription/#2fa--mfa-multiple-factor-authentication'} target="_blank" rel="noreferrer">
                                            <Translate content="setup2fa.instruction.part2" />
                                        </a>{" "}
                                        <Translate content="setup2fa.instruction.part3" />
                                    </span>
                                </h5>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <h4 className={classes.emailStyle}>
                                    <Translate content="setup2fa.usbPress" />
                                </h4>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                {loading ?
                                    <Col style={{ padding: "0", display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0px 10px 0px' }}>
                                        <Spinner style={{ height: '50px', width: '50px', borderWidth: '8px', color: "#165EA2"}} />
                                    </Col>
                                    : <Col style={{ padding: "0" }}>
                                        <input ref={inputRef}
                                            style={{ height: '0', width: '0', padding: '0', border: '0', display: 'block' }}
                                            autoFocus={true}
                                            onBlur={() => inputRef.current.focus()}
                                            onKeyDown={inputChangeHandler}
                                            onChange={(e) => { setOtpCode(e.target.value) }} />
                                    </Col>}
                            </Col>
                            {allowAuthApp && <Col style={{ padding: "0" }}>
                                <LoadingButton style={{ width: '100%' }} className={classes.buttonStyle} onClick={() => navigate(`/2fa-authentification/${token}`)}>
                                    <Translate content="setup2fa.withapp" style={{color: 'white'}}/>
                                </LoadingButton>
                            </Col>}
                            {errorMessage && <Col style={{ padding: "0", marginTop: "20px" }}>
                                <h5 className={classes.itemTextError} style={{ color: 'red' }}>
                                    {errorMessage}
                                </h5>
                            </Col>}
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default U2fAuthentification
