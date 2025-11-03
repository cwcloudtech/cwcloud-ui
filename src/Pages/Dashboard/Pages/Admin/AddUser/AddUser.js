import { useState, useContext, useEffect } from 'react';
import { Col, Row, Container } from "reactstrap"
import classes from "./AddUser.module.css"
import '../../../../../common.css'
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import IOSSwitch from '../../../../../utils/iosswitch';

function AddUser() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [user, setUser] = useState({
        email: '',
        password: '',
        is_admin: false,
        enabled_features: {
            disable_emails: true
        }
    });
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const [showPass, setShowPass] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        context.setIsGlobal(true)  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClickShowPassword = () => {
        setShowPass(!showPass);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleEmailInput = (e) => {
        setUser({ ...user, email: e.target.value })
        if (isBlank(e.target.value)) {
            setEmailError(true)
        }
    }

    const handlePasswordInput = (e) => {
        setUser({ ...user, password: e.target.value })
        if (isBlank(e.target.value)) {
            setPasswordError(true)
        }
    }

    const handleClickButton = () => {
        setLoadingSubmit(true)
        if (isBlank(user.email)) {
            setEmailError(true)
            setLoadingSubmit(false)
        }

        if (isBlank(user.password)) {
            setPasswordError(true)
            setLoadingSubmit(false)
        }

        axios.post(`/admin/user`, user)
            .then(response => {
                setLoadingSubmit(false)
                navigate('/users/overview')
                toast.success(context.counterpart('dashboard.addUser.message.successAdd'))
            }).catch(err => {
                setLoadingSubmit(false)
            })
    }

    return (
        <div>
            <Row>
                <Col>
                    <div className="goBack">
                        <NavLink to='/users/overview' className="link">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.addUser.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }} >
                <Row>
                    <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                        <h5 className="textTitle"><Translate content="dashboard.addUser.mainTitle" style={{color: colors.title[_mode]}} /></h5>
                    </Col>
                </Row>
                <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col md="6" className="formContainer" style={{backgroundColor: colors.formBackground[_mode]}}>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8" className={classes.estwicol}>
                                <TextField
                                    error={emailError}
                                    helperText={emailError ? context.counterpart('dashboard.addUser.errors.missingEmailInput') : ""}
                                    label={context.counterpart('dashboard.addUser.inputs.email.placeholder')+" *"}
                                    variant="standard"
                                    onChange={(e) => handleEmailInput(e) }
                                    fullWidth
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8">
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="standard-adornment-password">
                                        <Translate content="dashboard.addUser.inputs.password.placeholder" />
                                        <span> *</span>
                                    </InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        error={passwordError}
                                        type={showPass ? 'text' : 'password'}
                                        value={user.password}
                                        onChange={(e) => handlePasswordInput(e)}

                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPass ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    { passwordError && <span style={{ fontSize: "12px", color: "#d74b4b", marginTop: "2px" }}>{context.counterpart('dashboard.addUser.errors.missingPasswordInput')}</span> }
                                </FormControl>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8" className={classes.estwicol}>
                                <TextField label={context.counterpart('dashboard.addUser.inputs.companyName.placeholder')} variant="standard" onChange={(e) => setUser({ ...user, company_name: e.target.value })} fullWidth />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8" className={classes.estwicol}>
                                <TextField label={context.counterpart('dashboard.addUser.inputs.registrationNumber.placeholder')} variant="standard" onChange={(e) => setUser({ ...user, registration_number: e.target.value })} fullWidth />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8" className={classes.estwicol}>
                                <TextField label={context.counterpart('dashboard.addUser.inputs.address.placeholder')} variant="standard" onChange={(e) => setUser({ ...user, address: e.target.value })} fullWidth />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8" className={classes.estwicol}>
                                <TextField label={context.counterpart('dashboard.addUser.inputs.contactInformations.placeholder')} variant="standard" onChange={(e) => setUser({ ...user, contact_info: e.target.value })} fullWidth />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "30px", marginBottom: "5px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }} >
                            <Col md="8">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label"><Translate content="dashboard.addUser.inputs.access.title" /></InputLabel>
                                    <Select
                                        labelid="admin"
                                        id="admin"
                                        value={user.is_admin}
                                        label="Is_Admin"
                                        onChange={(e) => setUser({ ...user, is_admin: e.target.value })}
                                    >
                                        <MenuItem value={true}><Translate content="dashboard.addUser.inputs.access.adminAccess" /></MenuItem>
                                        <MenuItem value={false}><Translate content="dashboard.addUser.inputs.access.userAccess" /></MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="2" />
                            <Col md="6" style={{ marginTop: "5px", marginBottom: "90px", marginRight: "0", marginLeft: "0" }}>
                                <FormControlLabel
                                    label={context.counterpart('dashboard.addUser.inputs.disableEmails.title')}
                                    control={<IOSSwitch sx={{ m: 1 }} defaultChecked={user.enabled_features.disable_emails} />}
                                    onChange={(e) => setUser({ ...user,
                                        enabled_features: {
                                            ...user.enabled_features,
                                            disable_emails: !user.enabled_features.disable_emails
                                        }
                                    })}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingButton loading={loadingSubmit} icon={"fa-solid fa-floppy-disk"} onClick={handleClickButton}>
                                    <Translate content="common.button.create" />
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>


            </Container>
        </div >
    )
}
export default AddUser

