import { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import classes from "./UpdateUser.module.css"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import LoadingButton from '../../../../../../../Components/LoadingButton/LoadingButton';
import { Button, Switch } from '@material-ui/core';
import GlobalContext from '../../../../../../../Context/GlobalContext';
import colors from '../../../../../../../Context/Colors';
import Translate from 'react-translate-component';
import axios from '../../../../../../../utils/axios';

function Drawer(props) {
    const _mode = useContext(GlobalContext).mode;
    const [showPassNew, setShowPassNew] = useState(false)
    const [showPassConfirm, setShowPassConfirm] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [NotConfirmedPassword, setNotConfirmedPassword] = useState(props.user.password !== confirmPassword)
    const [userMFAMethods, setUserMFAMethods] = useState([])

    const handleClickShowNewPassword = () => {
        setShowPassNew(!showPassNew);
    };
    const handleClickShowConfirmPassword = () => {
        setShowPassConfirm(!showPassConfirm)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const ClickResetPasswordHandler = () => {
        if (confirmPassword === props.user.password) {
            setNotConfirmedPassword(false)
            props.onEditPassword()
        } else {
            setNotConfirmedPassword(true)
        }
    }

    const ClickDelete2faHandler = () => {
        props.onDelete2fa()
    }

    useEffect(() => {
        axios.get(`/admin/mfa/user/${props.user.id}`)
            .then(res => {
                setUserMFAMethods(res.data.methods)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <SwipeableDrawer
                anchor="right"
                open={props.isOpen}
                onClose={props.toggle}
                onOpen={() => { }}
            >
                <div className={classes.list}>
                    <Box className={classes.box} p={2}>
                        <h5 className={classes.textTitle} style={{color: colors.title[_mode]}}>Edit User</h5>
                        <i className="whiteIcon fa-solid fa-xmark" style={{ cursor: "pointer", fontSize: "25px" }} onClick={props.toggle}></i>
                    </Box>
                    <Divider style={{marginBottom: "10px", border: '0.1px solid' + colors.textAreaBorder[_mode]}} variant="middle" />
                    {!props.user.confirmed ?
                        <div>
                            <ListItem>
                                <Alert severity="info" style={{ width: "100%" }} variant="standard">
                                    <AlertTitle>Info</AlertTitle>
                                        <Translate content="dashboard.usersPage.message.userIsNotConfirmedYet" />
                                </Alert>
                            </ListItem> 
                           <ListItem style={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    className={classes.buttonStyle}
                                    onClick={() => props.onConfirm()}>
                                    <i style={{ marginRight: "5px" }} className="fa-solid fa-check"></i>
                                    Confirm
                                </Button>
                           </ListItem>
                        </div>
                        :
                        <ListItem>
                            <Alert severity="success" style={{ marginBottom: "10px", width: "100%" }}>
                                <AlertTitle>Info</AlertTitle>
                                <Translate content="dashboard.usersPage.message.userIsAlreadyConfirmed" />
                            </Alert>
                        </ListItem>
                    }
                    <Divider style={{border: '0.1px solid' + colors.textAreaBorder[_mode]}} variant="middle" />
                    <ListItem style={{ display: "flex", flexDirection: "column" }}>
                        <FormLabel className={classes.formLabelStyle} id="controle user privileges" style={{color: colors.mainText[_mode]}}>Access level</FormLabel>
                        <RadioGroup
                            aria-labelledby="controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={props.user.is_admin}
                            onChange={(e) => props.setUser({ ...props.user, is_admin: e.target.value === 'true' ? true : false })}
                        >
                            <FormControlLabel value="false" control={<Radio />} label="Regular" ></FormControlLabel>
                            <FormHelperText style={{ marginLeft: "30px", marginTop: "0px" }}>Regular users have access to their instances and projects.</FormHelperText>
                            <FormControlLabel value="true" control={<Radio />} label="Administrator" />
                            <FormHelperText style={{ marginLeft: "30px", display: "flex", flexWrap: "nowrap", marginTop: "0px" }}>the user has unlimited access to all instances,projects,users,and features</FormHelperText>
                        </RadioGroup>
                    </ListItem>
                    <ListItem style={{ display: "flex", justifyContent: "center" }}>
                        <LoadingButton loading={props.loadingRole} className={classes.buttonStyle} icon="fa-solid fa-floppy-disk" onClick={props.onUpdateRole}>
                            <Translate content="common.button.save" />
                        </LoadingButton>
                    </ListItem>
                    <Divider className={classes.Divider} style={{border: '0.1px solid' + colors.textAreaBorder[_mode]}} variant="middle" />
                    <List>
                        <ListItem style={{ display: "block" }}>
                            <TextField
                                className={classes.TextFieldFirst}
                                id="email"
                                label="Email"
                                onChange={(e) => props.setUser({ ...props.user, email: e.target.value })}
                                value={props.user.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                        </ListItem>
                        {
                            props.user.enabled_features &&
                            <>
                            <ListItem>
                                <FormControlLabel
                                    label={"Email API"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.emailapi}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            emailapi: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            <ListItem>
                                <FormControlLabel
                                    label={"FaaS API"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.faasapi}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            faasapi: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            <ListItem >
                                <FormControlLabel
                                    label={"Without VAT"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.without_vat}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            without_vat: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            <ListItem >
                                <FormControlLabel
                                    label={"Auto pay"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.auto_pay}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            auto_pay: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            <ListItem >
                                <FormControlLabel
                                    label={"Disable emails"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.disable_emails}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            disable_emails: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            <ListItem >
                                <FormControlLabel
                                    label={"Kubernetes API"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.k8sapi}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            k8sapi: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            <ListItem >
                                <FormControlLabel
                                    label={"IoT API"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.iotapi}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            iotapi: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            <ListItem >
                                <FormControlLabel
                                    label={"DaaS API"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.daasapi}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            daasapi: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            <ListItem >
                                <FormControlLabel
                                    label={"Monitor API"}
                                    control={<Switch sx={{ m: 1 }} checked={props.user.enabled_features.monitorapi}
                                    />}
                                    onChange={(e) => props.setUser({
                                        ...props.user,
                                        enabled_features: {
                                            ...props.user.enabled_features,
                                            monitorapi: e.target.checked
                                        }
                                    })}
                                />
                            </ListItem>
                            </>
                        }
                        <ListItem style={{ display: "block" }}>
                            <TextField
                                className={classes.TextFieldFirst}
                                id="email"
                                label="Company name"
                                onChange={(e) => props.setUser({ ...props.user, company_name: e.target.value })}
                                value={props.user.company_name}
                                variant="standard"
                            />
                        </ListItem>
                        <ListItem style={{ display: "block" }}>
                            <TextField
                                className={classes.TextFieldFirst}
                                id="email"
                                label="Address"
                                onChange={(e) => props.setUser({ ...props.user, address: e.target.value })}
                                value={props.user.address}
                                variant="standard"
                            />
                        </ListItem>
                        <ListItem style={{ display: "block" }}>
                            <TextField
                                className={classes.TextFieldFirst}
                                id="email"
                                label="Registration number"
                                onChange={(e) => props.setUser({ ...props.user, registration_number: e.target.value })}
                                value={props.user.registration_number}
                                variant="standard"
                            />
                        </ListItem>
                        <ListItem style={{ display: "block" }}>
                            <TextField
                                className={classes.TextFieldFirst}
                                id="email"
                                label="Contact informations"
                                onChange={(e) => props.setUser({ ...props.user, contact_info: e.target.value })}
                                value={props.user.contact_info}
                                variant="standard"
                            />
                        </ListItem>
                        <ListItem style={{ display: "flex", justifyContent: "center" }}>
                            <LoadingButton loading={props.loadingEmail} icon="fa-solid fa-floppy-disk" className={classes.buttonStyle} outline onClick={props.onEditInfo} variant="outlined">
                                <Translate content="common.button.save" />
                            </LoadingButton>
                        </ListItem>
                        <Divider className={classes.Divider} style={{border: '0.1px solid' + colors.textAreaBorder[_mode]}} variant="middle" />
                        <ListItem className={classes.passwordListItem}>
                            <TextField
                                className={classes.TextFieldFirst}
                                id="newpass"
                                label="new password"
                                onChange={(e) => props.setUser({ ...props.user, password: e.target.value })}
                                placeholder="put new password"
                                value={props.user.password}
                                type={showPassNew ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <></>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowNewPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassNew ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                            <TextField
                                className={classes.passwordTextField}
                                id="confirmpass"
                                label="confirm password"
                                placeholder="confirm your password"
                                type={showPassConfirm ? 'text' : 'password'}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={NotConfirmedPassword}
                                InputProps={{
                                    startAdornment: (
                                        <></>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassConfirm ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                        </ListItem>
                        <ListItem style={{ display: "flex", justifyContent: "center" }}>
                            <LoadingButton loading={props.loadingPassword} icon="fa-solid fa-floppy-disk" className={classes.buttonStyle} onClick={() => ClickResetPasswordHandler()}>
                                {!props.user.password ? "Reset Password" : "Save"}
                            </LoadingButton>
                        </ListItem>
                        {userMFAMethods && userMFAMethods.length > 0 &&
                            <ListItem style={{ display: "flex", justifyContent: "center" }}>
                                <LoadingButton loading={props.loadingDelete2fa} icon="fa-solid fa-trash" className={classes.buttonStyle} onClick={() => ClickDelete2faHandler()}>
                                    <Translate content="common.button.delete2Fa" />
                                </LoadingButton>
                            </ListItem>
                        }
                    </List>
                </div>
            </SwipeableDrawer>
        </div >
    )
}

export default Drawer