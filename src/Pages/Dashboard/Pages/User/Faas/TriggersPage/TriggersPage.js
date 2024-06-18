import React, { useContext, useState, useEffect } from 'react';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import { Link } from "react-router-dom";
// import classes from "./TriggersPage.module.css";
import '../../../../../../common.css';
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

function TriggersPage(props) {
    const context = useContext(GlobalContext);
    const { counterpart } = React.useContext(GlobalContext);
    const [triggers, setTriggers] = useState([])
    const [filteredTriggers, setFilteredTriggers] = useState([])
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showConfirmTruncateModal, setShowConfirmTruncateModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [selectedTrigger, setSelectedTrigger] = useState(null)
    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.table.id"), width: 330, renderCell: (params) => (params.id) },
        { field: 'function_id', headerName: context.counterpart("dashboard.table.function"), width: 330, renderCell: (params) => (<Link to={`/function/${params.row.content.function_id}`}>{params.row.content.function_id}</Link>) },
        { field: 'kind', headerName: context.counterpart("dashboard.trigger.table.kind"), width: 100, renderCell: (params) => (params.row.content.kind) },
        { field: 'name', headerName: context.counterpart("dashboard.trigger.table.name"), width: 100, renderCell: (params) => (params.row.content.name) },
        { field: 'cron_expr', headerName: context.counterpart("dashboard.trigger.table.cronExpr"), width: 90, renderCell: (params) => (params.row.content.cron_expr ? params.row.content.cron_expr : 'not a cron') },
        { field: 'actions', headerName: context.counterpart("dashboard.table.actions"), width: 70, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    predeleteTriggerHandler(params.id)
                };
                const copyTriggerId = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(params.id)
                    toast.success(counterpart('dashboard.trigger.message.successCopyTriggerId'))
                }
                return (
                    <React.Fragment>
                        <CustomCopyIcon onClick={copyTriggerId} title={context.counterpart('dashboard.trigger.actions.copyTriggerId')} />
                        &nbsp;
                        <CustomDeleteIcon onClick={onClick} />
                    </React.Fragment>
                )
            }
        },
        { field: 'args', headerName: context.counterpart("dashboard.table.args"), width: 350, renderCell: (params) => (<span title={JSON.stringify(params.row.content.args)}>{sliceIfNeeded(JSON.stringify(params.row.content.args), 50)}</span>) },
        { field: 'created_at', headerName: context.counterpart("dashboard.table.createdAt"), width: 230, renderCell: (params) => (params.row.created_at) },
        { field: 'updated_at', headerName: context.counterpart("dashboard.table.updatedAt"), width: 230, renderCell: (params) => (params.row.updated_at) }
    ];
    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/faas/triggers")
            .then(res => {
                setTriggers(res.data.results)
                setFilteredTriggers(res.data.results)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal])

    const predeleteTriggerHandler = (triggerId) => {
        const triggerIndex = triggers.findIndex(e => e.id === triggerId)
        setSelectedTrigger(triggers[triggerIndex])
        setShowConfirmDeleteModal(true)
    }

    const truncateTriggersHandler = () => {
        setLoadingDelete(true)
        axios.delete(`/faas/triggers`)
            .then(res => {
                toast.success(counterpart('dashboard.trigger.message.successTruncate'))
                setTriggers([])
                setFilteredTriggers([])
                setLoadingDelete(false)
                setShowConfirmTruncateModal(false)
            })
            .catch(err => {
                setLoadingDelete(false)
            })
    }
    const preTruncateTriggersHandler = () => {
        setShowConfirmTruncateModal(true)
    }
    const deleteTriggerHandler = (triggerId) => {
        setLoadingDelete(true)
        axios.delete(`/faas/trigger/${selectedTrigger.id}`)
            .then(res => {
                toast.success(counterpart('dashboard.trigger.message.successDelete'))
                setTriggers(filteredListWithoutRemovedElement(triggerId, triggers))
                setFilteredTriggers(filteredListWithoutRemovedElement(triggerId, filteredTriggers))
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
            setFilteredTriggers(triggers)
        } else {
            var filteredTriggers = triggers.filter(trigger => trigger.content.function_id.includes(searchQuery) || trigger.id.includes(searchQuery) || trigger.content.name.includes(searchQuery))
            setFilteredTriggers(filteredTriggers)
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={context.counterpart('dashboard.trigger.title.main')}
        >
            <DeleteModal resourceName={context.counterpart('dashboard.trigger.title.single').toLowerCase()} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={deleteTriggerHandler} name={selectedTrigger?.name} loading={loadingDelete} />
            <DeleteModal resourceName={context.counterpart('dashboard.trigger.allTriggers').toLowerCase()} isOpen={showConfirmTruncateModal} toggle={() => setShowConfirmTruncateModal(!showConfirmTruncateModal)} onDelete={truncateTriggersHandler} loading={loadingDelete} />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className="envCreation">
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
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className="tootltipValue">
                                <Translate content="dashboard.trigger.truncate" />
                            </h5>} placement="bottom">
                                <Fab color="primary" aria-label="delete" onClick={preTruncateTriggersHandler} style={{ transform: 'scale(0.7)' }} >
                                    <DeleteIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                        </div>
                    </div>
                </Col>
            </Row>
            <DataTable
                columns={columns}
                rows={filteredTriggers} />
        </CardComponent>
    )
}

export default TriggersPage
