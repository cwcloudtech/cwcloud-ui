import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from '../public.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col, Input, Form, FormGroup, Label } from "reactstrap";
import BackGroundImage from "../../../assets/images/background.png"
import Translate from "react-translate-component";
import LoadingButton from "../../../Components/LoadingButton/LoadingButton";
import QRCode from 'qrcode.react';
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import axios from "../../../utils/axios";
import GlobalContext from "../../../Context/GlobalContext";
import logoimage from '../../../utils/logo';
const docUrl = process.env.REACT_APP_DOCURL;
function SetMultiFactor() {
    const [errorMessage, setErrorMessage] = useState(null)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const context = useContext(GlobalContext)
    const [verificationCode, setVerificationCode] = useState('')
    const [otpCode, setOtpCode] = useState(null)
    const [otpUri, setOtpUri] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/mfa/register/2fa')
            .then(res => {
                setOtpUri(res.data.auth_uri)
                setOtpCode(res.data.otp_code)
                setLoading(false)

            })
    }, [])
    const enabledMultiFactorHandler = () => {
        setLoadingSubmit(true)
        axios.patch('/mfa/register/2fa', { code: verificationCode, otp_code: otpCode })
            .then(res => {
                setLoadingSubmit(false)
                context.setUserAuthMethods([...context.UserAuthMethods, res.data.method])
                toast.success(context.counterpart('setup2fa.success'))

                navigate('/dashboard')

            })
            .catch(err => {
                setLoadingSubmit(false)
                if (err.response.status === 400)
                    setErrorMessage(context.counterpart('setup2fa.error'))
            })
    }

    const getOtpCodeFormatted = () => {
        let formattedOtpCode = ""
        for (let i = 0; i < 32; i += 4) {
            formattedOtpCode += otpCode.substring(i, i + 4) + ' '
        }
        return formattedOtpCode
    }

    return (
        <Row className={classes.row} >
            <Col md="8" sm="0" className={classes.backgroundLogin}>
                <img className={classes.imageStyle} src={BackGroundImage} alt="background"></img>
            </Col>
            {!loading ? <Col md="4" sm="12" className={classes.mainContainer}>
                <Row style={{ width: "100%" }}>
                    <Col className={classes.logoContainer}>
                        <img src={logoimage()} className={classes.cwcloudLogo} alt="logo" />
                    </Col>
                </Row>
                <Row style={{ width: "100%" }}>
                    <Col className="formContainer">
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
                                    <Translate content="setup2fa.scan" />
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <QRCode size={200} value={`${otpUri}`} renderAs="canvas" />
                                </div>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <h4 className={classes.emailStyle}>
                                    <Translate content="setup2fa.cantScan" />
                                </h4>
                                <h4 className={classes.emailStyle} style={{ color: 'black', fontSize: '13px' }}>
                                    <Translate content="setup2fa.addManualDescription" />
                                </h4>
                                <h4 className={classes.emailStyle} style={{ color: 'black', fontSize: '13px' }}>
                                    <Translate content="setup2fa.account" />: CWCloud:{context.user.email}
                                </h4>
                                <h4 className={classes.emailStyle} style={{ color: 'black', fontSize: '13px' }}>
                                    <Translate content="setup2fa.key" />: {getOtpCodeFormatted()}
                                </h4>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <Form>
                                    <FormGroup floating>
                                        <Input
                                            id="verification"
                                            placeholder={context.counterpart('setup2fa.verificationCodePlacehold')}
                                            value={verificationCode}
                                            onFocus={() => { setErrorMessage(null) }}
                                            onChange={(e) => { setVerificationCode(e.target.value) }}
                                        />
                                        <Label for="verification">
                                            <Translate content="setup2fa.verificationCodePlacehold" />
                                        </Label>
                                    </FormGroup>
                                </Form>
                            </Col>
                            {errorMessage && <Col style={{ padding: "0", marginTop: "20px" }}>
                                <h5 className={classes.itemTextError} style={{ color: 'red' }}>
                                    {errorMessage}
                                </h5>
                            </Col>}
                            <Col style={{ padding: "0" }}>
                                <LoadingButton loading={loadingSubmit} icon="fa-solid fa-right-to-bracket" className={classes.buttonStyle} onClick={enabledMultiFactorHandler}>
                                    <Translate content="common.button.verifyCode" style={{ color: "white" }} />
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col> :
                <Col>
                    <LoadingSpinner />
                </Col>}
        </Row>
    )
}

export default SetMultiFactor
