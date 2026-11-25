import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import { isBlank } from "../../../utils/common";
import { toast } from "react-toastify";
import GlobalContext from "../../../Context/GlobalContext";
import { Spinner } from "reactstrap";
import Translate from "../../../Components/Translate/Translate";
import AuthLayout from "../../../Components/AuthLayout/AuthLayout";
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
        const passwordsMismatch = userData.password !== ConfirmPass;
        setShowPasswordMatchError(passwordsMismatch);
        if (!acceptTerms) {
            return toast.error(context.counterpart('signup.error.acceptTerms'))

        }
        if (isBlank(userData.password)|| isBlank(ConfirmPass)) {
            return toast.error(context.counterpart('signup.error.passwordsNotFound'))
        }

        if (passwordsMismatch) {
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


  const eye = (
    <button
      type="button"
      className="cw-input-eye"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  );

  return (
    <AuthLayout>
      <h1>
        <Translate content="signup.title" />
      </h1>
      <>
          <p className="cw-auth-subtitle">
            <Translate content="signup.instruction.part1" />{" "}
            <a href={docUrl + "/docs/subscription"} target="_blank" rel="noreferrer">
              <Translate content="signup.instruction.part2" />
            </a>{" "}
            <Translate content="signup.instruction.part3" />
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signupHandler();
            }}
          >
          <div className="cw-field">
            <label className="cw-label" htmlFor="email">
              <Translate content="signup.email" />
            </label>
            <input
              id="email"
              className="cw-input"
              type="email"
              autoComplete="email"
              value={userData.email || ""}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </div>
          <div className="cw-field">
            <label className="cw-label" htmlFor="company-name">
              <Translate content="signup.company" />
            </label>
            <input
              id="company-name"
              className="cw-input"
              type="text"
              autoComplete="organization"
              value={userData.company_name || ""}
              onChange={(e) => setUserData({ ...userData, company_name: e.target.value })}
            />
          </div>
          <div className="cw-field">
            <label className="cw-label" htmlFor="registration-number">
              <Translate content="signup.registrationNumber" />
            </label>
            <input
              id="registration-number"
              className="cw-input"
              type="text"
              autoComplete="off"
              value={userData.registration_number || ""}
              onChange={(e) => setUserData({ ...userData, registration_number: e.target.value })}
            />
          </div>
          <div className="cw-field">
            <label className="cw-label" htmlFor="address">
              <Translate content="signup.address" />
            </label>
            <input
              id="address"
              className="cw-input"
              type="text"
              autoComplete="street-address"
              value={userData.address || ""}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
          </div>
          <div className="cw-field">
            <label className="cw-label" htmlFor="contact-information">
              <Translate content="signup.contactInformations" />
            </label>
            <input
              id="contact-information"
              className="cw-input"
              type="text"
              autoComplete="tel"
              value={userData.contact_info || ""}
              onChange={(e) => setUserData({ ...userData, contact_info: e.target.value })}
            />
          </div>
          <div className="cw-field">
            <label className="cw-label" htmlFor="password">
              <Translate content="signup.password" />
            </label>
            <div className="cw-input-wrapper">
              <input
                id="password"
                className="cw-input"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required
              />
              {eye}
            </div>
          </div>
          <div className="cw-field">
            <label className="cw-label" htmlFor="verify-password">
              <Translate content="signup.passwordConfirmation" />
            </label>
            <div className="cw-input-wrapper">
              <input
                id="verify-password"
                className={`cw-input ${showPasswordMatchError ? "cw-input-invalid" : ""}`}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={ConfirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
              {eye}
            </div>
            {showPasswordMatchError && (
              <div className="cw-input-hint">
                <Translate content="signup.error.passwordsNotMatch" />
              </div>
            )}
          </div>
          <label className="cw-auth-terms">
            <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
            <span>
              <Translate content="signup.acceptTerms" />{" "}
              <a href={`${process.env.REACT_APP_DOCURL}/docs/terms/`} target="_blank" rel="noreferrer">
                <Translate content="signup.terms" />
              </a>
              .
            </span>
          </label>
          <button className="cw-button" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : <i className="fa-solid fa-user-plus" />}
            <Translate content="signup.button" />
          </button>
          </form>
      </>
      <div className="cw-auth-links">
        <Translate content="signup.question" />
        <NavLink to="/">
          <Translate content="signup.login" />
        </NavLink>
      </div>
    </AuthLayout>
  );
}

export default SignUpForm;