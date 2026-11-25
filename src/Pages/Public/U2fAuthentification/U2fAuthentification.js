import { useState, useContext, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "reactstrap";
import axios from 'axios'
import { toast } from "react-toastify";
import { FaUsb } from "react-icons/fa";
import Translate from "../../../Components/Translate/Translate";
import AuthLayout from "../../../Components/AuthLayout/AuthLayout";
import GlobalContext from "../../../Context/GlobalContext";
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
        const parsedQuery = Object.fromEntries(new URLSearchParams(location.search));
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
                setLoading(false)
                if (err.response?.status === 400) {
                    setErrorMessage(context.counterpart('multiFactorAuth.error'))
                } else if (err.response?.status === 401) {
                    toast.error(context.counterpart('multiFactorAuth.unauthorized'))
                }
            })
    }

    return (
        <AuthLayout>
            <h1>
                <Translate content="setup2fa.title" />
            </h1>
            <p className="cw-auth-subtitle">
                <Translate content="setup2fa.instruction.part1" />
                <a href={docUrl + '/docs/subscription/#2fa--mfa-multiple-factor-authentication'} target="_blank" rel="noreferrer">
                    <Translate content="setup2fa.instruction.part2" />
                </a>{" "}
                <Translate content="setup2fa.instruction.part3" />
            </p>
            <div className="cw-mfa-key">
                {loading
                    ? <Spinner className="cw-mfa-key-spinner" />
                    : <FaUsb className="cw-mfa-key-icon" aria-hidden="true" />}
                <span className="cw-mfa-key-label">
                    <Translate content="setup2fa.usbPress" />
                </span>
                {!loading && <input ref={inputRef}
                    className="cw-mfa-key-input"
                    aria-label="security key"
                    autoFocus={true}
                    onBlur={() => inputRef.current && inputRef.current.focus()}
                    onKeyDown={inputChangeHandler}
                    onChange={(e) => { setErrorMessage(null); setOtpCode(e.target.value) }} />}
            </div>
            {errorMessage && <div className="cw-input-hint cw-mfa-error">{errorMessage}</div>}
            {allowAuthApp && <>
                <div className="cw-divider" />
                <button type="button" className="cw-oidc-button" onClick={() => navigate(`/2fa-authentification/${token}`)}>
                    <i className="fa-solid fa-mobile-screen" />
                    <Translate content="setup2fa.withapp" />
                </button>
            </>}
        </AuthLayout>
    )
}

export default U2fAuthentification
