import { useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "reactstrap";
import axios from 'axios'
import { toast } from "react-toastify";
import LocalStorage from '../../../utils/localStorageService';
import counterpart from '../../../utils/counterpart';
import Translate from "../../../Components/Translate/Translate";
import AuthLayout from "../../../Components/AuthLayout/AuthLayout";
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
                if (err.response?.status === 400) {
                    setErrorMessage(counterpart('multiFactorAuth.error'))
                } else if (err.response?.status === 401) {
                    toast.error(counterpart('multiFactorAuth.unauthorized'))
                }
            })
    }

    return (
        <AuthLayout>
            <h1>
                <Translate content="multiFactorAuth.title" />
            </h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    enabledMultiFactorHandler();
                }}
            >
                <div className="cw-field">
                    <label className="cw-label" htmlFor="verify">
                        <Translate content="multiFactorAuth.verificationCodePlacehold" />
                    </label>
                    <input
                        id="verify"
                        name="verify"
                        className={`cw-input ${errorMessage ? "cw-input-invalid" : ""}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus
                        value={verificationCode}
                        onFocus={() => setErrorMessage(null)}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                    {errorMessage && <div className="cw-input-hint">{errorMessage}</div>}
                </div>
                <button className="cw-button" type="submit" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : <i className="fa-solid fa-right-to-bracket" />}
                    <Translate content="common.button.verifyCode" />
                </button>
            </form>
        </AuthLayout>
    )
}
export default MultiFactorAuth
