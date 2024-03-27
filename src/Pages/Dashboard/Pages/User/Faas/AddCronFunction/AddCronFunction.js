import React, { useContext, useState, useEffect } from 'react'
import { Spinner, Col, Row, Container, Badge } from "reactstrap"
import classes from "./AddCronFunction.module.css"
import axios from "../../../../../../utils/axios";
import { NavLink, useParams, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingSpinner from '../../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from '../../../../../../Context/Colors';
import { OutlinedInput, Select, MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';

function AddCronFunction() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const navigate = useNavigate()
    const location = useLocation()
    const [args, setArgs] = useState([])
    const [argsNames, setArgsNames] = useState([])
    const [trigger, setTrigger] = useState({})
    const triggerKinds = ["cron", "schedule"]
    const [selectedTriggerKind, setSelectedTriggerKind] = useState(triggerKinds[0]) 
    const [executionTime, setExecutionTime] = useState(new Date().toISOString())
    const [executionTimeFormatIsValid, setExecutionTimeFormatIsValid] = useState(true)
    const [cronExprs, setCronExprs] = useState([
        {
            name: "dashboard.trigger.cronExpr.everyMinute",
            value: "* * * * *",
            selected: false
        },
        {
            name: "dashboard.trigger.cronExpr.everyHour",
            value: "0 * * * *",
            selected: false
        },
        {
            name: "dashboard.trigger.cronExpr.everyDay",
            value: "0 0 * * *",
            selected: false
        },
        {
            name: "dashboard.trigger.cronExpr.everyWeek",
            value: "0 0 * * 0",
            selected: false
        },
        {
            name: "dashboard.trigger.cronExpr.everyMonth",
            value: "0 0 1 * *",
            selected: false
        }
    ]) 
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const { id } = useParams()
    const [previousPath, setPreviousPath] = useState('/function/overview')
    const [nextPath, setNextPath] = useState('/triggers')

    const getPaths = () => {
        if (location.pathname === `/admin/schedule/${id}`) {
            setPreviousPath('/admin/function/overview')
            setNextPath('/admin/triggers')
        }
    }

    useEffect(() => {
        getPaths()
        context.setIsGlobal(true)
        setLoading(true)
        axios.get(`/faas/function/${id}`)
            .then(res => {
                setArgsNames(res.data.content.args)
                setArgs(res.data.content.args.map(key => ({
                    "key": key,
                    "value": ""
                })))
                setLoading(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClickButton = () => {
        setLoadingSubmit(true)
        var content = {
            function_id: id,
            args: args,
            name: trigger.name, 
        }
        if (selectedTriggerKind === "cron") {
            content["cron_expr"] = trigger.cronExpr
        } else if (selectedTriggerKind === "schedule") {
            content["execution_time"] = executionTime
            var time =  new Date(executionTime)
            if (!executionTimeFormatIsValid) {
                setLoadingSubmit(false)
                return toast.error(context.counterpart('dashboard.trigger.message.invalidExecutionTime'))
            }
            if (time < new Date()) {
                setLoadingSubmit(false)
                return toast.error(context.counterpart('dashboard.trigger.message.executionTimeInThePast'))
            }
        }
        axios.post(`/faas/trigger`, {
            kind: selectedTriggerKind,
            content: content
        }).then(response => {
            setLoadingSubmit(false)
            toast.success(context.counterpart('dashboard.trigger.message.successCreation'))
            navigate(nextPath)
        }).catch(err => {
            setLoadingSubmit(false)
        })
    }

    const updateArgHandler = (index, key, value) => {
        args[index] = {
            "key": key,
            "value": value
        }
        setArgs(args)
    }

    if (loading)
        return <LoadingSpinner />
    else
        return (
            <div>
                <Row>
                    <Col>
                        <div className={classes.goBack}>
                            <NavLink to={previousPath} className={classes.link}>
                                <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                                <Translate content="dashboard.function.back" />
                            </NavLink>
                        </div>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.trigger.inputs.triggerKind.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                </h5>
                            </Col>
                            <Col md="6">
                                <Select
                                    id="trigger_kind"
                                    value={selectedTriggerKind}
                                    onChange={(e) => {
                                        setSelectedTriggerKind(e.target.value)
                                    }}
                                    input={<OutlinedInput label="Trigger kind" />}
                                    required 
                                    fullWidth
                                >
                                    {triggerKinds.map(kind => (
                                        <MenuItem
                                            key={kind}
                                            value={kind}
                                        >
                                            {kind}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.trigger.inputs.name.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                            </Col>
                            <Col md="6">
                                <TextField id="trigger_name" label={context.counterpart('dashboard.trigger.inputs.name.placeholder')} onChange={(e) => setTrigger({ ...trigger, name: e.target.value })} required fullWidth />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    selectedTriggerKind === "cron" &&
                        <Row style={{ margin: "30px 0px" }}>
                            <Col>
                                <Row style={{ display: "flex", alignItems: "center" }}>
                                    <Col md="4">
                                        <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                            <Translate content="dashboard.trigger.inputs.cronExpr.title" />
                                            <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                        </h5>
                                    </Col>
                                    <Col md="6">
                                        <TextField id="trigger_cron_expr" label={context.counterpart('dashboard.trigger.inputs.cronExpr.placeholder')} value={trigger.cronExpr} onChange={(e) => setTrigger({ ...trigger, cronExpr: e.target.value })} InputLabelProps={{shrink: !!trigger.cronExpr}} required fullWidth />
                                        {
                                            cronExprs.map((cron, index) => (
                                                <Badge
                                                    color={ cron.selected ? "primary" : "secondary" }
                                                    key={index}
                                                    onClick={() => {
                                                        setTrigger({ ...trigger, cronExpr: cron.value });
                                                        setCronExprs(cronExprs.map((cron, i) => {
                                                            if (i === index) {
                                                                cron.selected = true;
                                                            } else {
                                                                cron.selected = false;
                                                            }
                                                            return cron;
                                                        }))
                                                    } }
                                                    style={{ cursor: "pointer", margin: "10px", color: colors.title[_mode] }} pill>
                                                    <Translate content={cron.name} />
                                                </Badge>
                                            ))
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                }
                {
                    selectedTriggerKind === "schedule" &&
                        <Row style={{ margin: "30px 0px" }}>
                            <Col>
                                <Row style={{ display: "flex", alignItems: "center" }}>
                                    <Col md="4">
                                        <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                            <Translate content="dashboard.trigger.inputs.executionTime.title" />
                                            <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                        </h5>
                                    </Col>
                                    <Col md="6">
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            value={new Date(executionTime)}
                                            onChange={(newValue) => {
                                                const date = new Date(newValue);
                                                if (!isNaN(date)) {
                                                    setExecutionTime(date.toISOString());
                                                    setExecutionTimeFormatIsValid(true);
                                                } else {
                                                    setExecutionTimeFormatIsValid(false);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} helperText={params?.inputProps?.placeholder} sx={{ width: '100%' }} />
                                            )}
                                        />
                                    </LocalizationProvider>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                }
                <Container className={classes.container} fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                    {argsNames?.map((argName, index) => (
                        <Row key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <Col md="4">
                                <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                    {argName}
                                </h5>
                            </Col>
                            <Col md="4">
                                <TextField
                                    style={{ marginTop: '10px' }}
                                    onChange={(e) => updateArgHandler(index, argName, e.target.value)}
                                    label={context.counterpart('dashboard.invocation.args.placeholder')}
                                    fullWidth />
                            </Col>
                        </Row>
                    ))}
                    <Row>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "20px" }}>
                            <Button onClick={handleClickButton} style={{ width: "250px", height: "50px" }} variant="outlined"
                                size="large">
                                {loadingSubmit ? <Spinner size="sm" style={{ marginRight: "8px" }} />
                                    : <i className="fa-solid fa-paper-plane" style={{ marginRight: "8px" }}></i>}
                                <Translate content="common.button.create" />
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
}

export default AddCronFunction
