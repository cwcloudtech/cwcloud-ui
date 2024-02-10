import { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
import classes from "./AdminRegistriesPage.module.css";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import GlobalContext from "../../../../../Context/GlobalContext";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from 'react-translate-component';
import ActionComponent from "./ActionComponent/ActionComponent";
import DeleteModal from "../../../../../Components/DeleteModal/DeleteModal";
import formateDate from "../../../../../utils/FormateDate";
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import { toast } from 'react-toastify';
import DataTable from "../../../../../Components/DataTable/DataTable";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function AdminRegistriesPage(props) {
    const context = useContext(GlobalContext);
    const [registries, setRegistries] = useState([]);
    const [filtredRegistries, setFiltredRegistries] = useState([]);
    const { selectedProvider, region, counterpart, setIsGlobal } = useContext(GlobalContext)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const columns = [
        { field: 'id', headerName: counterpart("dashboard.adminRegistriesPage.table.id"), width: 200, renderCell: (params) => (<Link to={`/admin/registry/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: counterpart("dashboard.adminRegistriesPage.table.name"), width: 200 },
        { field: 'status', headerName: counterpart("dashboard.adminRegistriesPage.table.status"), width: 100 },
        { field: 'created_at', headerName: counterpart("dashboard.adminRegistriesPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        {
            field: 'action', headerName: counterpart("dashboard.adminRegistriesPage.table.actions"), width: 100, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                };
                const registryIndex = registries.findIndex(b => b.id === params.id)
                return (
                    <ActionComponent
                        item={registries[registryIndex]}
                        onClick={onClick}
                        deleteBucket={(e) => { onClick(e); deleteRegistryHandler(params.row.id) }} />
                )
            }
        }
    ];

    useEffect(() => {
        setIsGlobal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        axios.get(`/admin/registry/${selectedProvider.name}/${region.name}/all`)
            .then(res => {
                setRegistries(res.data)
                setFiltredRegistries(res.data)
            }).catch(err => {
                navigate('/notfound')
            })
    }, [region.name, navigate, selectedProvider.name, showConfirmDeleteModal])

    const deleteRegistryHandler = (registryId) => {
        setRegistries(filteredListWithoutRemovedElement(registryId, registries))
        setFiltredRegistries(filteredListWithoutRemovedElement(registryId, filtreRegistries))
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const deleteRegistriesHandler = async () => {
        setLoading(true)
        new Promise((r, j) => {
            const deletedRegistries = []
            selectedDeletionItems.forEach((registryId, index) => {
                axios.delete(`/admin/registry/${registryId}`)
                    .then(() => {
                        deletedRegistries.push(registryId)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedRegistries)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedRegistries)
                        }
                    })
            })
        })
            .then((delete_registries) => {
                setRegistries([...registries.filter(p => !delete_registries.includes(p.id))])
                toast.success(counterpart('dashboard.adminRegistriesPage.message.successMultiDelete'))
                setLoading(false)
                setShowConfirmDeleteModal(false)
            })

    }

    const filtreRegistries = (e) => {
        const searchQuery = e.target.value.trim() 
        if (isBlank(searchQuery)) {
            setFiltredRegistries(registries)
        } else {
            var filtredRegistries = registries.filter(registry => registry.name.includes(searchQuery))
            setFiltredRegistries(filtredRegistries)
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart('dashboard.adminRegistriesPage.title')}
            subtitle={counterpart('dashboard.adminRegistriesPage.description')}
            link={counterpart('dashboard.adminRegistriesPage.learnMore')}>
            <DeleteModal resourceName={'bucket'}
                multi={true}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteRegistriesHandler}
                loading={loading} />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className={classes.instanceCreation}>
                        <TextField
                            onChange={(e) => filtreRegistries(e) }
                            label={context.counterpart('dashboard.addRegistry.inputs.name.placeholder')}
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
                                <Translate content="dashboard.adminRegistriesPage.addInstance" />
                            </h5>}
                            placement="bottom">
                            <Fab color="primary" aria-label="add" onClick={() => navigate("/admin/registries/create")} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-brands fa-docker'}
                createUrl='/admin/registries/create'
                emptyMessage={counterpart('dashboard.adminRegistriesPage.emptyMessage')}
                createMessage={counterpart('dashboard.adminRegistriesPage.createMessage')}
                checkboxSelection
                columns={columns}
                rows={filtredRegistries}
                onDeleteSelection={preDeleteSelectionHandler} />
        </CardComponent>
    );
}

export default AdminRegistriesPage;
