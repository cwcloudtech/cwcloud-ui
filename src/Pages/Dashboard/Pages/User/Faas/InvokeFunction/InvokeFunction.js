import React, { useContext, useState, useEffect } from 'react'
import { Spinner, Col, Row, Container } from "reactstrap"
import classes from "./InvokeFunction.module.css"
import axios from "../../../../../../utils/axios";
import { NavLink, useParams, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingSpinner from '../../../../../../Components/LoadingSpinner/LoadingSpinner';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from '../../../../../../Context/Colors';

function InvokeFunction() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const navigate = useNavigate()
    const location = useLocation()
    const [args, setArgs] = useState([])
    const [argsNames, setArgsNames] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const { id } = useParams()
    const [previousPath, setPreviousPath] = useState('/function/overview')
    const [nextPath, setNextPath] = useState('/invocations')

    const getPaths = () => {
        if (location.pathname === `/admin/invoke/${id}`) {
            setPreviousPath('/admin/function/overview')
            setNextPath('/admin/invocations')
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

        axios.post(`/faas/invocation`, {
            content: {
                function_id: id,
                args: args
            }
        }).then(response => {
            setLoadingSubmit(false)
            toast.success(context.counterpart('dashboard.invocation.message.successInvoked'))
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
                                <Translate content="common.button.run" />
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
}

export default InvokeFunction
