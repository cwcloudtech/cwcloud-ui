import { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Row, Col } from 'reactstrap';
import axios from "../../../../../utils/axios";
import classes from "./UserOverview.module.css";
import '../../../../../common.css';
import { Container } from 'reactstrap';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Spinner, Button } from 'reactstrap';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { toast } from "react-toastify";
import { NavLink } from 'react-router-dom'
import Card from '@mui/material/Card';
import MemoryIcon from '@mui/icons-material/Memory';
import { AiFillGitlab } from "react-icons/ai";
import GlobalContext from '../../../../../Context/GlobalContext';
import { Table } from 'reactstrap';
import InstanceItem from './InstanceItem/InstanceItem';
import formateDate from '../../../../../utils/FormateDate';
import LoadingSpinner from '../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import colors from '../../../../../Context/Colors';
import InfoCard from '../../../../../Components/Cards/InfoCard/InfoCard';
import Identicon from 'react-identicons';

function UserOverview() {
    const { userId } = useParams()
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState([])
    const [showPassNew, setShowPassNew] = useState(false)
    const [showPassConfirm, setShowPassConfirm] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [NotConfirmedPassword, setNotConfirmedPassword] = useState(userData.password !== confirmPassword)
    const [editPasswordLoading, setEditPasswordLoading] = useState(false)
    const [editEmailLoading, seteditEmailLoading] = useState(false)
    const [instances, setInstances] = useState([])
    const [projects, setProjects] = useState([])
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [userMethods, setUserMethods] = useState([])

    useEffect(() => {
        context.setIsGlobal(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const responseUser = await axios.get(`/admin/user/${userId}`)
                setUserData(responseUser.data.result)
                const responseMethods = await axios.get(`/admin/mfa/user/${userId}`)
                setUserMethods(responseMethods.data.methods)
                const responseInstances = await axios.get(`/admin/instance/${context.selectedProvider.name}/${context.region.name}/${userId}`)
                setInstances(responseInstances.data)
                const responseProjects = await axios.get(`/admin/project/user/${userId}`)
                setProjects(responseProjects.data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
        fetchUserData()
    }, [context.region, userId, context.selectedProvider])

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
        if (confirmPassword === userData.password) {
            setNotConfirmedPassword(false)
            onUpdateUserPasswordInfoHandler()
        } else {
            setNotConfirmedPassword(true)
        }
    }
    const onUpdateUserEmailInfoHandler = () => {
        seteditEmailLoading(true)
        axios.put(`/admin/user/${userData.id}`, userData).then(response => {
            toast.success(context.counterpart('dashboard.userOverview.message.successUpdate'))
            seteditEmailLoading(false)
        }).catch(err => {
            seteditEmailLoading(false)
        })
    }

    const onUpdateUserPasswordInfoHandler = () => {
        setEditPasswordLoading(true)
        axios.patch(`/admin/user/reset-password`, userData).then(response => {
            toast.success(context.counterpart('dashboard.userOverview.message.successUpdate'))
            setEditPasswordLoading(false)
        }).catch(err => {
            setEditPasswordLoading(false)
        })
    }

    const delete2FaHandler = (type) => {
        const methodIndex = userMethods.findIndex(m => m.type === type)
        const methodId = userMethods[methodIndex].id
        axios.delete(`/admin/mfa/${methodId}`)
            .then(res => {
                const _userAuthMethods = [...userMethods]
                _userAuthMethods.splice(methodIndex, 1)
                setUserMethods(_userAuthMethods)
                toast.success("2Factor authentification successfully deleted")
            })
    }

    return (
        loading ? <LoadingSpinner /> :
            <Container style={{ padding: "0" }}>
                <div className="goBack">
                    <NavLink to='/users/overview' className="link" style={{color: colors.blue[_mode]}}>
                        <i className="fa-solid fa-arrow-left iconStyle" style={{color: colors.blue[_mode]}}></i>
                        <Translate content="dashboard.userOverview.back" />
                    </NavLink>
                </div >
                <Row className={classes.row} >
                    <Col md="6">
                        <div style={{ display: "flex" }}>
                            <div className={classes.colavatar}>
                                <Identicon string={userData.email ? userData.email : "None"} size="100" className={classes.avatar} style={{ border: "1px solid "+colors.avatarBorder[_mode]}} />
                            </div>
                            <div >
                                <h6 style={{ fontWeight: '500', color: colors.mainText[_mode] }}><strong><Translate content="dashboard.userOverview.fields.id" />: </strong>{userData.id}</h6>
                                <h6 style={{ fontWeight: '500', color: colors.mainText[_mode] }} ><strong><Translate content="dashboard.userOverview.fields.email" />: </strong>{userData.email}</h6>
                                <h6 style={{ fontWeight: '500', color: colors.mainText[_mode] }} ><strong><Translate content="dashboard.userOverview.fields.createdAt" />: </strong>
                                    {formateDate(userData.created_at)}
                                </h6>
                            </div>
                        </div>
                        <Row style={{ marginLeft: "50px", marginRight: "50px", display: "flex", flexDirection: "column" }} className={classes.row} >
                            <TextField
                                className={classes.TextFieldFirst}
                                id="email"
                                label={context.counterpart('dashboard.userOverview.inputs.email')}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                value={userData.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                            <LoadingButton className={classes.buttonStyle} icon="fa-solid fa-floppy-disk" loading={editEmailLoading} outline onClick={onUpdateUserEmailInfoHandler}>
                                <Translate content="common.button.save" />
                            </LoadingButton>
                        </Row>
                        <Row style={{ marginLeft: "50px", marginRight: "50px", display: "flex", flexDirection: "column" }} className={classes.row} >
                            <h5 style={{color: colors.mainText[_mode]}}>
                                {`Two Factor authentification methods:`}
                            </h5>
                            {userMethods.map(m => m.type).includes('auth_app') &&
                                <LoadingButton
                                    color="error"
                                    icon="fa-solid fa-trash-can"
                                    onClick={() => delete2FaHandler('auth_app')}
                                    style={{ width: '100%' }}>
                                    <Translate content="common.button.delete2Fa" />
                                </LoadingButton>
                            }
                        </Row>
                        <Row style={{ marginLeft: "50px", marginRight: "50px", display: "flex", flexDirection: "column" }} className={classes.row} >
                            {userMethods.map(m => m.type).includes('security_key') &&
                                <LoadingButton
                                    color="error"
                                    icon="fa-solid fa-trash-can"
                                    onClick={() => delete2FaHandler('security_key')}
                                    style={{ width: '100%' }}>
                                    <Translate content="common.button.deleteU2f" />
                                </LoadingButton>
                            }
                        </Row>
                        <Row className={classes.row} style={{ marginLeft: "50px", marginRight: "50px", display: "flex", flexDirection: "column" }}>
                            <TextField
                                className={classes.TextFieldFirst}
                                id="newpass"
                                label={context.counterpart('dashboard.userOverview.inputs.newPassword.title')}
                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                placeholder={context.counterpart('dashboard.userOverview.inputs.newPassword.placeholder')}
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
                                label={context.counterpart('dashboard.userOverview.inputs.confirmPassword.title')}
                                placeholder={context.counterpart('dashboard.userOverview.inputs.confirmPassword.placeholder')}
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
                            <Button className={classes.buttonStyle + " orangeBtn"} onClick={ClickResetPasswordHandler} >
                                {editPasswordLoading ? <Spinner className="spinner" size="sm" />
                                    : <i className="fa-solid fa-floppy-disk icon"></i>}
                                {!confirmPassword ? "Reset Password" : "Save"}
                            </Button>
                        </Row>
                    </Col>
                    <Col md="6">
                        <Row >
                            <Col style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
                                <Card variant="outlined" style={{ backgroundColor: colors.userCard[_mode], width: "250px", borderRadius: "10px", position: "relative" }}>
                                    <InfoCard 
                                        title="dashboard.userOverview.info.instances.title"
                                        length={instances.length}
                                        unitInfo="dashboard.userOverview.info.instances.unit"
                                    />
                                    <MemoryIcon className="blueIcon" style={{ fontSize: "80px", position: "absolute", top: "0", right: "0", color: colors.blue[_mode] }} />
                                </Card>
                            </Col>
                            <Col style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
                                <Card variant="outlined" style={{ backgroundColor:colors.userCard[_mode], width: "250px", borderRadius: "10px", position: "relative" }}>
                                    <InfoCard
                                        title={"dashboard.userOverview.info.projects.title"}
                                        length={projects.length}
                                        unitInfo={"dashboard.userOverview.info.projects.unit"}
                                    />
                                    <AiFillGitlab style={{ fontSize: "80px", position: "absolute", top: "0", right: "0", color: colors.blue[_mode] }} />
                                </Card>
                            </Col>

                        </Row>
                        <Row>
                            <Table dark={ _mode === "dark" } style={{ overflow: "none", margin: "50px"}}>
                                <thead>
                                    <tr>
                                        <th style={{color: colors.secondText[_mode]}}><Translate content="dashboard.userOverview.table.name" /></th>
                                        <th style={{color: colors.secondText[_mode]}}><Translate content="dashboard.userOverview.table.size" /></th>
                                        <th style={{color: colors.secondText[_mode]}}><Translate content="dashboard.userOverview.table.status" /></th>
                                        <th style={{color: colors.secondText[_mode]}}><Translate content="dashboard.userOverview.table.created" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...instances].map((instance, index) => (
                                        <InstanceItem
                                            index={index}
                                            item={instance}
                                            key={index}
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        </Row>
                    </Col>
                </Row>
            </Container>
    )
}

export default UserOverview