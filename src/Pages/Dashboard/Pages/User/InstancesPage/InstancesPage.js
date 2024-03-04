import { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
import classes from "./InstancesPage.module.css";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import GlobalContext from "../../../../../Context/GlobalContext";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from "react-translate-component";
import DeleteModal from "../../../../../Components/Modal/DeleteModal";
import { toast } from 'react-toastify';
import ActionComponent from "./ActionComponent/ActionComponent";
import DataTable from "../../../../../Components/Table/DataTable";
import formateDate from "../../../../../utils/FormateDate";
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function InstancesPage(props) {
    const context = useContext(GlobalContext);
    const [instances, setInstances] = useState([]);
    const [filtredInstances, setFiltredInstances] = useState([])
    const { selectedProvider, region, counterpart, setIsGlobal, user } = useContext(GlobalContext)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const [multiSelection, setMultiSelection] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const columns = [
        { field: 'id', headerName: counterpart("dashboard.instancesPage.table.id"), width: 200, renderCell: (params) => (<Link to={`/instance/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: counterpart("dashboard.instancesPage.table.name"), width: 200 },
        { field: 'type', headerName: counterpart("dashboard.instancesPage.table.size"), width: 100 },
        { field: 'status', headerName: counterpart("dashboard.instancesPage.table.status"), width: 100 },
        { field: 'created_at', headerName: counterpart("dashboard.instancesPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        {
            field: 'action', headerName: counterpart("dashboard.instancesPage.table.actions"), width: 100, renderCell: (params) => {
                if (params.row.user_id !== user.id)
                    return null
                const onClick = (e) => {
                    e.stopPropagation();
                };
                const instanceIndex = instances.findIndex(i => i.id === params.id)
                return (
                    <ActionComponent
                        item={instances[instanceIndex]}
                        onClick={onClick}
                        updateInstanceStatus={updateInstanceStatusHandler}
                        deleteInstance={deleteInstanceHandler} />
                )
            }
        }
    ];

    useEffect(() => {
        setIsGlobal(false)
        axios.get(`/instance/${selectedProvider.name}/${region.name}`)
            .then(res => {
                setInstances(res.data)
                setFiltredInstances(res.data)
                setLoading(false)
            }).catch(err => {
                navigate('/notfound')
            })
    }, [region, navigate, selectedProvider, setIsGlobal, showConfirmDeleteModal])

    const deleteInstanceHandler = (instanceId) => {
        setInstances(filteredListWithoutRemovedElement(instanceId, instances))
        setFiltredInstances(filteredListWithoutRemovedElement(instanceId, filtredInstances))
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        const allowedInstances = [...instances.filter(b => b.user_id === user.id).map(i => i.id)]
        setSelectedDeletionItems(selectedItems.filter(instanceId => allowedInstances.includes(instanceId)))

    }

    const updateInstanceStatusHandler = (instanceId, newStatus) => {
        const instanceIndex = instances.findIndex(instance => instance.id === instanceId)
        const _instances = [...instances]
        _instances[instanceIndex].status = newStatus
        setInstances(_instances)
    }

    const deleteInstancesHandler = async () => {
        setLoading(true)
        new Promise((r, j) => {
            const deletedInstances = []
            selectedDeletionItems.forEach((instanceId, index) => {
                axios.delete(`/instance/${selectedProvider.name}/${region.name}/${instanceId}`)
                    .then(() => {
                        deletedInstances.push(instanceId)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedInstances)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedInstances)
                        }
                    })
            })
        })
            .then((delete_instances) => {
                setInstances([...instances.filter(p => !delete_instances.includes(p.id))])
                if (delete_instances.length > 0)
                    toast.success(counterpart('dashboard.instancesPage.message.successMultiDelete'))
                setLoading(false)
                setShowConfirmDeleteModal(false)
            })
    }

    const filterInstances = (e) => {
        const searchQuery = e.target.value.trim() 
        if (isBlank(searchQuery)) {
            setFiltredInstances(instances)
        } else {
            var filtredInstances = instances.filter(instances => instances.name.includes(searchQuery))
            setFiltredInstances(filtredInstances)
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart('dashboard.instancesPage.title')}
            subtitle={counterpart('dashboard.instancesPage.description')}
            link={counterpart('dashboard.instancesPage.learnMore')}>
            <DeleteModal resourceName={'instance'}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteInstancesHandler}
                loading={loading} />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className={classes.instanceCreation}>
                        <TextField
                            onChange={(e) => filterInstances(e) }
                            label={context.counterpart('dashboard.addInstance.inputs.name.placeholder')}
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
                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={
                            <h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.instancesPage.addInstance" />
                            </h5>}
                            placement="bottom">
                            <Fab color="primary" aria-label="add" onClick={() => navigate("/instances/create")} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-microchip'}
                createUrl='/instances/create'
                emptyMessage={counterpart('dashboard.instancesPage.emptyMessage')}
                createMessage={counterpart('dashboard.instancesPage.createMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={filtredInstances}
                onDeleteSelection={preDeleteSelectionHandler} />
        </CardComponent>
    );
}

export default InstancesPage;
