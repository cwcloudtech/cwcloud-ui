import React, { useContext , useState, useEffect } from 'react';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import { Link } from "react-router-dom";
import classes from "./InvocationsPage.module.css";
import { Row, Col } from "reactstrap";
import { TextField } from "@mui/material";
import axios from "../../../../../../utils/axios"
import GlobalContext from '../../../../../../Context/GlobalContext';
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import DataTable from '../../../../../../Components/Table/DataTable';
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteModal from "../../../../../../Components/Modal/DeleteModal";
import filteredListWithoutRemovedElement from "../../../../../../utils/filter";
import sliceIfNeeded from "../../../../../../utils/stringSlice";
import CustomCopyIcon from '../../../../../../Components/CustomIcon/CustomCopyIcon';
import CustomRerunIcon from '../../../../../../Components/CustomIcon/CustomRerunIcon';
import { FaHourglassEnd } from "react-icons/fa";

function InvocationsPage(props) {
    const context = useContext(GlobalContext);
    const { counterpart } = React.useContext(GlobalContext);
    const [invocations, setInvocations] = useState([])
    const [filteredInvocations, setFilteredInvocations] = useState([])
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showConfirmTruncateModal, setShowConfirmTruncateModal] = useState(false)
    const [gotInvocated, setGotInvocated] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [selectedInvocation, setSelectedInvocation] = useState(null)
    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.table.id"), width: 330, renderCell: (params) => (params.id) },
        { field: 'function_id', headerName: context.counterpart("dashboard.table.function"), width: 330, renderCell: (params) => (<Link to={`/function/${params.row.content.function_id}`}>{params.row.content.function_id}</Link>) },
        { field: 'state', headerName: context.counterpart("dashboard.invocation.table.state"), width: 110, renderCell: (params) => (params.row.content.state) },
        { field: 'result', headerName: context.counterpart("dashboard.invocation.table.result"), width: 325, renderCell: (params) => (<span title={params.row.content.result ? params.row.content.result : 'not known'}>{params.row.content.result ? sliceIfNeeded(params.row.content.result, 50) : 'not known'}</span>) },
        { field: 'actions', headerName: context.counterpart("dashboard.table.actions"), width: 100, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    preDeleteInvocationHandler(params.id)
                };
                const copyResult = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(params.row.content.result)
                    toast.success(counterpart('dashboard.invocation.message.successResultCopy'))
                };
                const reRunInvocation = () => {
                    setGotInvocated(true)
                    axios.post('/faas/invocation', {
                        content: {
                            function_id: params.row.content.function_id,
                            args: params.row.content.args
                        }
                    }).then(response => {
                        toast.success(counterpart('dashboard.invocation.message.successInvoked'))
                        setGotInvocated(false)
                    }).catch(err => {
                        toast.error(counterpart('dashboard.invocation.message.errorInvoked'))
                    })
                }
                return (
                    <React.Fragment>
                        <CustomCopyIcon onClick={copyResult} title={counterpart('dashboard.invocation.actions.copyResult')} />
                        <span style={{ width: '10px' }}></span>
                        <CustomRerunIcon onClick={reRunInvocation} title={counterpart('dashboard.invocation.actions.rerunInvocation')} />
                        <span style={{ width: '10px' }}></span>
                        <CustomDeleteIcon onClick={onClick} />
                    </React.Fragment>
                )
            }
        },
        { field: 'args', headerName: context.counterpart("dashboard.table.args"), width: 250, renderCell: (params) => (<span title={JSON.stringify(params.row.content.args)}>{sliceIfNeeded(JSON.stringify(params.row.content.args), 50)}</span>) },
        { field: 'created_at', headerName: context.counterpart("dashboard.table.createdAt"), width: 230, renderCell: (params) => (params.row.created_at) },
        { field: 'updated_at', headerName: context.counterpart("dashboard.table.updatedAt"), width: 230, renderCell: (params) => (params.row.updated_at) },
        { field: 'time', headerName: context.counterpart("dashboard.invocation.table.time"), width: 130, renderCell: (params) => (<span className='mx-auto' style={{ color: "#ff9800" }}>{calculateInvocationTime(params.row)}</span>) },
    ];

    useEffect(() => {
        const getInvocations = async () => {
            try {
                const res = await axios.get("/faas/invocations");
                setInvocations(res.data.results);
                setFilteredInvocations(res.data.results);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getInvocations();
        // Polling every 10
        const pollInterval = setInterval(() => {
            getInvocations();
        }, 10000);
        // Cleanup the interval on component unmount
        return () => clearInterval(pollInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal, gotInvocated]);

    const preDeleteInvocationHandler = (invocationId) => {
        const invocationsIndex = invocations.findIndex(e => e.id === invocationId)
        setSelectedInvocation(invocations[invocationsIndex])
        setShowConfirmDeleteModal(true)
    }

    const preTruncateInvocationsHandler = () => {
        setShowConfirmTruncateModal(true)
    }

    const truncateInvocationsHandler = () => {
        setLoadingDelete(true)
        axios.delete('/faas/invocations')
            .then(res => {
                toast.success(counterpart('dashboard.invocation.message.successTruncate'))
                setInvocations([])
                setFilteredInvocations([])
                setLoadingDelete(false)
                setShowConfirmTruncateModal(false)
            })
            .catch(err => {
                setLoadingDelete(false)
            })
    }

    const deleteInvocationHandler = (invocationId) => {
        setLoadingDelete(true)
        axios.delete(`/faas/invocation/${selectedInvocation.id}`)
            .then(res => {
                toast.success(counterpart('dashboard.invocation.message.successDelete'))
                setInvocations(filteredListWithoutRemovedElement(invocationId, invocations))
                setFilteredInvocations(filteredListWithoutRemovedElement(invocationId, filteredInvocations))
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
            })
            .catch(err => {
                setLoadingDelete(false)
            })
    }

    const filterInvocations = (f) => {
        const searchQuery = f.target.value.trim() 
        if (searchQuery === "" ) {
            setFilteredInvocations(invocations)
        } else {
            var filteredInvocations = invocations.filter(invocation => invocation.content.function_id.includes(searchQuery) || invocation.id.includes(searchQuery))
            setFilteredInvocations(filteredInvocations)
        }
    }

    const calculateInvocationTime = (invocation) => {
        if (invocation.content.state !== "in_progress") {
            const time = new Date(invocation.updated_at) - new Date(invocation.created_at)
            return `${time} ms`
        } else {
            return <Tooltip title={context.counterpart('dashboard.invocation.message.inProgress')} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}> <FaHourglassEnd /></Tooltip>
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={context.counterpart('dashboard.invocation.title.main')}
        >
            <DeleteModal resourceName={context.counterpart('dashboard.invocation.title.single').toLowerCase()} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={deleteInvocationHandler} name={selectedInvocation?.name} loading={loadingDelete} />
            <DeleteModal resourceName={context.counterpart('dashboard.invocation.allInvocations').toLowerCase()} isOpen={showConfirmTruncateModal} toggle={() => setShowConfirmTruncateModal(!showConfirmTruncateModal)} onDelete={truncateInvocationsHandler} loading={loadingDelete} />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className={classes.envCreation}>
                        <TextField
                            style={{ marginRight: "5px" }}
                            onChange={(f) => filterInvocations(f) }
                            label={context.counterpart('dashboard.table.filter')}
                            InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchOutlinedIcon />
                                  </InputAdornment>
                                ),
                            }}
                            size="small"
                            fullWidth
                        />
                        <div style={{ display: 'flex' }}>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.invocation.truncate" />
                            </h5>} placement="bottom">
                                <Fab color="primary" aria-label="delete" onClick={preTruncateInvocationsHandler} style={{ transform: 'scale(0.7)' }} >
                                    <DeleteIcon className="whiteIcon" />
                                </Fab>                      
                            </Tooltip>
                        </div>
                    </div>
                </Col>
            </Row>
            <DataTable
                columns={columns}
                rows={filteredInvocations} />
        </CardComponent>
    )
}

export default InvocationsPage