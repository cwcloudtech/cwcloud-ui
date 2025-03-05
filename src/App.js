import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import LoginForm from "./Pages/Public/Login/LoginForm";
import SignUpForm from "./Pages/Public/SignUp/SignUpForm";
import Dashboard from "./Pages/Dashboard/Dashboard"
import AppContext from "./Context/AppContext";
import LocalStorageService from "./utils/localStorageService";
import ResetPassword from "./Pages/Public/ResetPassword/ResetPassword"
import ForgetPassword from "./Pages/Public/ForgetPassword/ForgetPassword"
import Confirm from "./Pages/Public/Confirm/Confirm";
import Confirmation from "./Pages/Public/Confirmation/Confirmation";
import DeviceConfirmation from "./Pages/Public/Confirmation/DeviceConfirmation";
import { ToastContainer } from "react-toastify";
import MultiFactorAuth from "./Pages/Public/MultiFactorAuth/MultiFactorAuth";
import SetMultiFactor from "./Pages/Public/SetMultiFactor/SetMultiFactor";
import SetSecurityKey from "./Pages/Public/SetSecurityKey/SetSecurityKey";
import U2fAuthentification from "./Pages/Public/U2fAuthentification/U2fAuthentification";
import Contact from "./Pages/Public/Contact/Contact";
import React, { useState, useEffect } from 'react';
import SearchModal from './Components/SearchModal/SearchModal';

function App() {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const handleKeyDown = (event) => {
        if (event.ctrlKey && (event.key === 's' || event.key === '/') && 
            !isSearchModalOpen && 
            !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            event.preventDefault();
            setIsSearchModalOpen(true);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearchModalOpen]);

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
                        <Route exact path="/device-confirmation/:token" element={<DeviceConfirmation />} />
                        <Route exact path="/confirm" element={<Confirm />} />
                        <Route exact path="/2fa-authentification/:token" element={<MultiFactorAuth />} />
                        <Route exact path="/u2f-authentification/:token" element={<U2fAuthentification />} />
                        <Route exact path="/setup-2fa" element={<SetMultiFactor />} />
                        <Route exact path="/setup-security-key" element={<SetSecurityKey />} />
                        <Route path="/*" element={LocalStorageService.getAccessToken() ? <Dashboard /> : <Navigate to="/" />} />
                    </Routes>
                    {LocalStorageService.getAccessToken() && (
                        <SearchModal
                            isOpen={isSearchModalOpen}
                            onClose={() => setIsSearchModalOpen(false)}
                        />
                    )}
                </BrowserRouter>
            </div>
        </AppContext>
    );
}

export default App;
