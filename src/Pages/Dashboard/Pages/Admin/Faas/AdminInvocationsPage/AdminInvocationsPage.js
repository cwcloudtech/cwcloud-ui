import React, { useContext, useState, useEffect } from 'react';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import { Link } from "react-router-dom";
import classes from "./AdminInvocationsPage.module.css";
import { Row, Col } from "reactstrap";
import { TextField, Tooltip, Fade } from "@mui/material";
import axios from "../../../../../../utils/axios"
import GlobalContext from '../../../../../../Context/GlobalContext';
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import CustomCopyIcon from '../../../../../../Components/CustomIcon/CustomCopyIcon';
import CustomRerunIcon from '../../../../../../Components/CustomIcon/CustomRerunIcon'
import DataTable from '../../../../../../Components/Table/DataTable';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteModal from "../../../../../../Components/Modal/DeleteModal";
import filteredListWithoutRemovedElement from "../../../../../../utils/filter";
import sliceIfNeeded from "../../../../../../utils/stringSlice";
import { FaHourglassEnd } from "react-icons/fa";

function AdminInvocationsPage(props) {
    const context = useContext(GlobalContext);
    const { counterpart } = React.useContext(GlobalContext);
    const [invocations, setInvocations] = useState([])
    const [filteredInvocations, setFilteredInvocations] = useState([])
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [gotInvocated, setGotInvocated] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [selectedInvocation, setSelectedInvocation] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
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
                    axios.post(`/faas/invocation`, {
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
        { field: 'invoker', headerName: context.counterpart("dashboard.invocation.table.invoker"), width: 200, renderCell: (params) => (params.row.invoker.username ? params.row.invoker.username : "not known") },
        { field: 'args', headerName: context.counterpart("dashboard.table.args"), width: 250, renderCell: (params) => (<span title={JSON.stringify(params.row.content.args)}>{sliceIfNeeded(JSON.stringify(params.row.content.args), 50)}</span>) },
        { field: 'created_at', headerName: context.counterpart("dashboard.table.createdAt"), width: 230, renderCell: (params) => (params.row.created_at) },
        { field: 'updated_at', headerName: context.counterpart("dashboard.table.updatedAt"), width: 230, renderCell: (params) => (params.row.updated_at) },
        { field: 'time', headerName: context.counterpart("dashboard.invocation.table.time"), width: 130, renderCell: (params) => (calculateInvocationTime(params.row)) },
    ];

    useEffect(() => {
        const getInvocations = async () => {
            try {
                const res = await axios.get("/admin/faas/invocations");
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

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const deleteSelectedInvocationsHandler = async () => {
        setLoadingDelete(true)
        new Promise((resolve, reject) => {
            const deletedInvocations = []
            selectedDeletionItems.forEach((invocationId, index) => {
                axios.delete(`/faas/invocation/${invocationId}`)
                    .then(() => {
                        deletedInvocations.push(invocationId)
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedInvocations)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            reject(deletedInvocations)
                        }
                    })
            })
        })
            .then((deleted_invocations) => {
                setInvocations([...invocations.filter(invocation => !deleted_invocations.includes(invocation.id))])
                if (deleted_invocations.length > 0) {
                    toast.success(counterpart('dashboard.invocation.message.successDelete'))
                }
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
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
            <DeleteModal
                resourceName={context.counterpart('dashboard.invocation.title.single').toLowerCase()} 
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteSelectedInvocationsHandler}
                onDelete={deleteInvocationHandler}
                name={selectedInvocation?.name} 
                loading={loadingDelete} 
            />
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
                    </div>
                </Col>
            </Row>
            <DataTable
                columns={columns}
                rows={filteredInvocations}
                emptyMessage={context.counterpart('dashboard.invocation.message.noInvocations')}
                checkboxSelection
                setMultiSelection={setMultiSelection}
                onDeleteSelection={preDeleteSelectionHandler}
            />
        </CardComponent>
    )
}

export default AdminInvocationsPage
