import { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import LocalStorage from '../../../utils/localStorageService';
import GlobalContext from '../../../Context/GlobalContext';
import Translate from "../../../Components/Translate/Translate";
import AuthLayout from '../../../Components/AuthLayout/AuthLayout';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


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
        <AuthLayout>
            <h1>
                <Translate content="login.title" />
            </h1>
            <p className="cw-auth-subtitle">
                <Translate content="login.instruction" />
            </p>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    loginHandler();
                }}
            >
                <div className="cw-field">
                    <label className="cw-label" htmlFor="email">
                        <Translate content="login.email" />
                    </label>
                    <input
                        id="email"
                        name="email"
                        className="cw-input"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                    />
                </div>
                <div className="cw-field">
                    <label className="cw-label" htmlFor="password">
                        <Translate content="login.password" />
                    </label>
                    <div className="cw-input-wrapper">
                        <input
                            id="password"
                            name="password"
                            className="cw-input"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="cw-input-eye"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <div className="cw-auth-row">
                    <Link to="/forget-password">
                        <Translate content="login.forgottenpassword" />
                    </Link>
                </div>
                <button className="cw-button" type="submit" disabled={loadingSubmit}>
                    {loadingSubmit ? <Spinner size="sm" /> : <i className="fa-solid fa-right-to-bracket" />}
                    <Translate content="login.button" />
                </button>
            </form>
            <div className="cw-auth-links">
                <Translate content="login.question" />
                <NavLink to="/signup">
                    <Translate content="login.signup" />
                </NavLink>
            </div>
        </AuthLayout>
    )
}

export default LoginForm
