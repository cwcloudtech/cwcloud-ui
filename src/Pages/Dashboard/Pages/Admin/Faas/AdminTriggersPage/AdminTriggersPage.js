import React, { useContext, useState , useEffect} from 'react';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import { Link } from "react-router-dom";
import classes from "./AdminTriggersPage.module.css";
import { Row, Col } from "reactstrap";
import { TextField } from "@mui/material";
import axios from "../../../../../../utils/axios"
import GlobalContext from '../../../../../../Context/GlobalContext';
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import DataTable from '../../../../../../Components/Table/DataTable';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteModal from "../../../../../../Components/Modal/DeleteModal";
import filteredListWithoutRemovedElement from "../../../../../../utils/filter";
import sliceIfNeeded from "../../../../../../utils/stringSlice";

function TriggersPage(props) {
    const context = useContext(GlobalContext);
    const { counterpart } = React.useContext(GlobalContext);
    const [triggers, setTriggers] = useState([])
    const [filteredTriggers, setFilteredTriggers] = useState([])
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [selectedTrigger, setSelectedTrigger] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
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
                return (
                    <React.Fragment>
                        <CustomDeleteIcon onClick={onClick} />
                    </React.Fragment>
                )
            }
        },
        { field: 'args', headerName: context.counterpart("dashboard.table.args"), width: 350, renderCell: (params) => (<span title={JSON.stringify(params.row.content.args)}>{sliceIfNeeded(JSON.stringify(params.row.content.args), 50)}</span>) },
        { field: 'owner', headerName: context.counterpart("dashboard.table.owner"), width: 300, renderCell: (params) => (params.row.owner.username ? params.row.owner.username : "not known") },
        { field: 'created_at', headerName: context.counterpart("dashboard.table.createdAt"), width: 230, renderCell: (params) => (params.row.created_at) },
        { field: 'updated_at', headerName: context.counterpart("dashboard.table.updatedAt"), width: 230, renderCell: (params) => (params.row.updated_at) }
    ];

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/admin/faas/triggers")
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

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const deleteSelectedTriggersHandler = async () => {
        setLoadingDelete(true)
        new Promise((r, j) => {
            const deletedTriggers = []
            selectedDeletionItems.forEach((triggerId, index) => {
                axios.delete(`/faas/trigger/${triggerId}`)
                    .then(res => {
                        deletedTriggers.push(triggerId)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedTriggers)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedTriggers)
                        }
                    })
            })
        })
            .then((deleted_triggers) => {
                setTriggers([...triggers.filter(trigger => !deleted_triggers.includes(trigger.id))])
                if (deleted_triggers.length > 0)
                    toast.success(context.counterpart('dashboard.trigger.message.successMultipleDelete'))
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
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
            <DeleteModal
                resourceName={context.counterpart('dashboard.trigger.title.single').toLowerCase()}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteSelectedTriggersHandler}
                onDelete={deleteTriggerHandler}
                name={selectedTrigger?.name}
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
                rows={filteredTriggers}
                emptyMessage={context.counterpart("dashboard.trigger.message.emptyMessage")}
                checkboxSelection
                setMultiSelection={setMultiSelection}
                onDeleteSelection={preDeleteSelectionHandler}
            />
        </CardComponent>
    )
}

export default TriggersPage
