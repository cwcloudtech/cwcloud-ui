import { useContext, useState, useEffect } from 'react';
import axios from '../../../../../utils/axios';
import GlobalContext from '../../../../../Context/GlobalContext';
import { Col, Container, Row } from 'reactstrap';
import classes from './Settings.module.css';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import { toast } from 'react-toastify';
import DeleteModal from '../../../../../Components/Modal/DeleteModal';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Translate from 'react-translate-component';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import colors from '../../../../../Context/Colors';

function Settings(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode
    const [editedUserInfo, setEditedUserInfo] = useState({})
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [NotConfirmedPassword, setNotConfirmedPassword] = useState(editedUserInfo.newPassword !== editedUserInfo.rePassword)
    const [loadingSubmitUserInfo, setLoadingSubmitUserInfo] = useState(false)
    const [loadingSubmitUserPassword, setLoadingSubmitUserPassword] = useState(false)
    const [loadingDelete2Fa, setLoadingDelete2Fa] = useState(false)
    const [selectedAuthType, setSelectedAuthType] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        setEditedUserInfo({ ...context.user })
    }, [props.isOpen, context.user])

    const ClickResetPasswordHandler = () => {
        if (editedUserInfo.rePassword === editedUserInfo.newPassword) {
            setNotConfirmedPassword(false)
            resetPasswordHandler()
        } else {
            setNotConfirmedPassword(true)
        }
    }

    const resetPasswordHandler = () => {
        setLoadingSubmitUserPassword(true)
        axios.patch('/user/password', { old_password: editedUserInfo.oldPassword, new_password: editedUserInfo.newPassword })
            .then(res => {
                setLoadingSubmitUserPassword(false)
                toast.success(context.counterpart(`error_codes.${res.data.i18n_code}`))
            })
            .catch(err => {
                setLoadingSubmitUserPassword(false)
            })
    }

    const updateUserInfoHandler = () => {
        setLoadingSubmitUserInfo(true)
        axios.put('/user', editedUserInfo)
            .then(res => {
                setLoadingSubmitUserInfo(false)
                context.setUser(editedUserInfo)
                toast.success(context.counterpart(`error_codes.${res.data.i18n_code}`))
            })
            .catch(err => {
                setLoadingSubmitUserInfo(false)
            })
    }

    const preDelete2FaHandler = (type) => {
        setSelectedAuthType(type)
        setShowConfirmDeleteModal(true)
    }

    const delete2FaHandler = () => {
        setLoadingDelete2Fa(true)
        const methodIndex = context.UserAuthMethods.findIndex(m => m.type === selectedAuthType)
        const methodId = context.UserAuthMethods[methodIndex].id
        axios.delete(`/mfa/${methodId}`)
            .then(res => {
                setLoadingDelete2Fa(false)
                toast.success(context.counterpart("dashboard.settings.messages.successDelete2Fa"))
                const _userAuthMethods = [...context.UserAuthMethods]
                _userAuthMethods.splice(methodIndex, 1)
                context.setUserAuthMethods(_userAuthMethods)
                setShowConfirmDeleteModal(false)
            })
    }

    return (
        <Container fluid style={{ padding: "0px 20px 20px 20px", }} >
            <DeleteModal resourceName="2Factor authentification" isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={delete2FaHandler} name={'delete'} loading={loadingDelete2Fa} />
            <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Col>
                    <div className={classes.titleWithDivider}>
                        <h1 className="mainTitleText" style={{ color: colors.mainText[_mode] }}>
                            <Translate content="dashboard.settings.userInformations" />
                        </h1>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Col xs="12" md="6">
                    <TextField
                        className={classes.TextFieldFirst}
                        label={context.counterpart("dashboard.settings.input.email")}
                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, email: e.target.value })}
                        value={editedUserInfo.email || ''}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Col xs="12" md="6">
                    <TextField
                        className={classes.TextFieldFirst}
                        label={context.counterpart("dashboard.settings.input.companyName")}
                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, company_name: e.target.value })}
                        value={editedUserInfo.company_name || ''}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Col xs="12" md="6">
                    <TextField
                        className={classes.TextFieldFirst}
                        label={context.counterpart("dashboard.settings.input.address")}
                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, address: e.target.value })}
                        value={editedUserInfo.address || ''}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Col xs="12" md="6">
                    <TextField
                        className={classes.TextFieldFirst}
                        id="email"
                        label={context.counterpart("dashboard.settings.input.registrationNumber")}
                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, registration_number: e.target.value })}
                        value={editedUserInfo.registration_number || ''}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Col xs="12" md="6">
                    <TextField
                        className={classes.TextFieldFirst}
                        id="email"
                        label={context.counterpart("dashboard.settings.input.contactInformations")}
                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, contact_info: e.target.value })}
                        value={editedUserInfo.contact_info || ''}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: '10px'}}>
                <Col md="7" />
                <Col xs="4" md="2">
                    <LoadingButton loading={loadingSubmitUserInfo} icon="fa-solid fa-floppy-disk" className={classes.buttonStyle} outline onClick={updateUserInfoHandler} variant="outlined">
                        <Translate content="common.button.save" />
                    </LoadingButton>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Col>
                    <div className={classes.titleWithDivider}>
                        <h1 className="mainTitleText" style={{ color: colors.mainText[_mode] }}>
                            <Translate content="dashboard.settings.passwordManagement" />
                        </h1>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Col>
                    <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Col xs="12" md="6">
                            <TextField
                                className={classes.TextFieldFirst}
                                label={context.counterpart("dashboard.settings.input.oldPassword")}
                                onChange={(e) => setEditedUserInfo({ ...editedUserInfo, oldPassword: e.target.value })}
                                value={editedUserInfo.oldPassword || ''}
                                type={showOldPassword ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <></>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                            >
                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Col xs="12" md="6">
                            <TextField
                                className={classes.TextFieldFirst}
                                label={context.counterpart("dashboard.settings.input.newPassword")}
                                onChange={(e) => setEditedUserInfo({ ...editedUserInfo, newPassword: e.target.value })}
                                value={editedUserInfo.newPassword || ''}
                                type={showNewPassword ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <></>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Col xs="12" md="6">
                            <TextField
                                className={classes.passwordTextField}
                                label={context.counterpart("dashboard.settings.input.confirmPassword")}
                                type={showConfirmPassword ? 'text' : 'password'}
                                onChange={(e) => setEditedUserInfo({ ...editedUserInfo, rePassword: e.target.value })}
                                value={editedUserInfo.rePassword || ''}
                                error={NotConfirmedPassword}
                                InputProps={{
                                    startAdornment: (
                                        <></>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px'}}>
                <Col md="7" />
                <Col xs="4" md="2">
                    <LoadingButton loading={loadingSubmitUserPassword} icon="fa-solid fa-floppy-disk" className={classes.buttonStyle} onClick={ClickResetPasswordHandler}>
                        <Translate content="common.button.save" />
                    </LoadingButton>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Col>
                    <div className={classes.titleWithDivider}>
                        <h1 className="mainTitleText" style={{ color: colors.mainText[_mode] }}>
                            <Translate content="dashboard.settings.security" />
                        </h1>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Col xs="6" md="3">
                    {context.UserAuthMethods.map(m => m.type).includes('auth_app') ?
                        <LoadingButton
                            color="error"
                            icon="fa-solid fa-trash-can"
                            onClick={() => preDelete2FaHandler('auth_app')}
                            style={{ width: '100%' }}>
                            <Translate content="common.button.delete2Fa" />
                        </LoadingButton>
                        :
                        <LoadingButton onClick={() => navigate('/setup-2fa')} style={{ width: '100%' }}>
                            <Translate content="common.button.activate2Fa" />
                        </LoadingButton>
                    }
                </Col>
                <Col xs="6" md="3">
                    {context.UserAuthMethods.map(m => m.type).includes('security_key') ?
                        <LoadingButton
                            color="error"
                            icon="fa-solid fa-trash-can"
                            onClick={() => preDelete2FaHandler('security_key')}
                            style={{ width: '100%' }}>
                            <Translate content="common.button.deleteU2f" />
                        </LoadingButton>
                        :
                        <LoadingButton onClick={() => navigate('/setup-security-key')} style={{ width: '100%' }}>
                            <Translate content="common.button.activateU2f" />
                        </LoadingButton>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default Settings;