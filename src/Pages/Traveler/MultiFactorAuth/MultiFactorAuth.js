import { useState } from "react";
import { useParams } from "react-router-dom";
import classes from '../traveler.module.css';
import 'react-toastify/dist/ReactToastify.css';
import comWorkLogo from '../../../assets/images/logocomwork.png'
import { Row, Col, Input, Form, FormGroup, Label } from "reactstrap";
import BackGroundImage from "../../../assets/images/background.png"
import LoadingButton from "../../../Components/LoadingButton/LoadingButton";
import LocalStorage from '../../../utils/localStorageService';
import axios from 'axios'
import { toast } from "react-toastify";
import counterpart from '../../../utils/counterpart';
import Translate from "react-translate-component";
const apiHost = process.env.REACT_APP_APIURL;
const apiVersion = process.env.REACT_APP_APIVERSION;
function MultiFactorAuth() {
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')
    const { token } = useParams()

    const enabledMultiFactorHandler = () => {
        setLoading(true)
        axios.post(`${apiHost}/${apiVersion}/mfa/2fa/verify`, { code: verificationCode }, {
            headers: {
                'X-User-Token': token
            }
        })
            .then(res => {
                setLoading(false)
                LocalStorage.setToken(res.data.token)
                window.location.href = "/dashboard"
            })
            .catch(err => {
                setLoading(false)
                if (err.response.status === 400)
                    setErrorMessage(counterpart('multiFactorAuth.error'))
                else if (err.response.status === 401)
                    toast.error(counterpart('multiFactorAuth.unauthorized'))
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
                        <img src={comWorkLogo} className={classes.comWorkLogo} alt="logo" />
                    </Col>
                </Row>
                <Row style={{ width: "100%" }}>
                    <Col className={classes.formContainer}>
                        <Row className={classes.form}>
                            <Col style={{ padding: "0" }}>
                                <h4 className={classes.headerTitle}>
                                    <Translate content="multiFactorAuth.title" />
                                </h4>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <Form>
                                    <FormGroup floating>
                                        <Input
                                            id="verify"
                                            placeholder={counterpart('multiFactorAuth.verificationCodePlacehold')}
                                            value={verificationCode}
                                            onFocus={() => { setErrorMessage(null) }}
                                            onChange={(e) => { setVerificationCode(e.target.value) }}
                                        />
                                        <Label for="verify">
                                            <Translate content="multiFactorAuth.verificationCodePlacehold" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                </Form>
                            </Col>
                            {errorMessage && <Col style={{ padding: "0", marginTop: "20px" }}>
                                <h5 className={classes.itemTextError} style={{ color: 'red' }}>
                                    {errorMessage}
                                </h5>
                            </Col>}
                            <Col style={{ padding: "0" }}>
                                <LoadingButton className={classes.buttonStyle} loading={loading} icon="fa-solid fa-right-to-bracket" onClick={enabledMultiFactorHandler}>
                                    <Translate content="common.button.verifyCode" style={{color: 'white'}}/>
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default MultiFactorAuth