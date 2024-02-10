import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import LoginForm from "./Pages/Traveler/Login/LoginForm";
import SignUpForm from "./Pages/Traveler/SignUp/SignUpForm";
import Dashboard from "./Pages/Dashboard/Dashboard"
import AppContext from "./Context/AppContext";
import LocalStorageService from "./utils/localStorageService";
import ResetPassword from "./Pages/Traveler/ResetPassword/ResetPassword"
import ForgetPassword from "./Pages/Traveler/ForgetPassword/ForgetPassword"
import Confirm from "./Pages/Traveler/Confirm/Confirm";
import Confirmation from "./Pages/Traveler/Confirmation/Confirmation";
import { ToastContainer } from "react-toastify";
import MultiFactorAuth from "./Pages/Traveler/MultiFactorAuth/MultiFactorAuth";
import SetMultiFactor from "./Pages/Traveler/SetMultiFactor/SetMultiFactor";
import SetSecurityKey from "./Pages/Traveler/SetSecurityKey/SetSecurityKey";
import U2fAuthentification from "./Pages/Traveler/U2fAuthentification/U2fAuthentification";
import Contact from "./Pages/Traveler/Contact/Contact";
function App() {
    return (
        <AppContext>
            <ToastContainer />
            <div style={{ position: 'relative', minHeight: '100vh' }}>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<LoginForm />} />
                        <Route exact path="/signup" element={<SignUpForm />} />
                        <Route exact path="/contact" element={<Contact />} />
                        <Route exact path="/forget-password" element={<ForgetPassword />} />
                        <Route exact path="/reset-password/:token" element={<ResetPassword />} />
                        <Route exact path="/confirmation/:token" element={<Confirmation />} />
                        <Route exact path="/confirm" element={<Confirm />} />
                        <Route exact path="/2fa-authentification/:token" element={<MultiFactorAuth />} />
                        <Route exact path="/u2f-authentification/:token" element={<U2fAuthentification />} />
                        <Route exact path="/setup-2fa" element={<SetMultiFactor />} />
                        <Route exact path="/setup-security-key" element={<SetSecurityKey />} />
                        <Route path="/*" element={LocalStorageService.getAccessToken() ? <Dashboard /> : <Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </AppContext>
    );
}

export default App;
