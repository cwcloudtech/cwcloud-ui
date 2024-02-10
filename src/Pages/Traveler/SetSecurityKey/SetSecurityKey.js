import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from '../traveler.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col, Spinner } from "reactstrap";
import BackGroundImage from "../../../assets/images/background.png"
import Translate from "react-translate-component";
import { toast } from "react-toastify";
import axios from "../../../utils/axios";
import GlobalContext from "../../../Context/GlobalContext";
import logoimage from '../../../utils/logo';
const docUrl = process.env.REACT_APP_DOCURL;
function SetSecurityKey() {
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const context = useContext(GlobalContext)
    const [otpCode, setOtpCode] = useState(null)
    const inputRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (inputRef && inputRef.current) {

            inputRef.current.focus()
        }
    }, [inputRef])
    const inputChangeHandler = (e) => {
        if (e.key === 'Enter') {
            setLoading(true)
            enabledMultiFactorHandler()
        }
    }
    const enabledMultiFactorHandler = () => {
        axios.post('/mfa/register/u2f', { code: otpCode })
            .then(res => {
                setLoading(false)
                context.setUserAuthMethods([...context.UserAuthMethods, res.data.method])
                toast.success(context.counterpart('setup2fa.success'))
                navigate('/dashboard')
            })
            .catch(err => {
                setLoading(false)
                if (err.response.status === 400)
                    setErrorMessage(context.counterpart('setup2fa.error'))
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
                            {loading ?
                                <Col style={{ padding: "0", display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0px 10px 0px' }}>
                                    <Spinner style={{ height: '50px', width: '50px', color: '#0861AF', borderWidth: '8px' }} />
                                </Col>
                                : <Col style={{ padding: "0" }}>
                                    <input ref={inputRef}
                                        style={{ height: '0', width: '0', padding: '0', border: '0', display: 'block' }}
                                        autoFocus={true}
                                        onBlur={() => inputRef.current.focus()}
                                        onKeyDown={inputChangeHandler}
                                        onChange={(e) => { setOtpCode(e.target.value) }} />
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

export default SetSecurityKey
