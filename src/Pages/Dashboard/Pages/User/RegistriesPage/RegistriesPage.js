import { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
// import classes from "./RegistriesPage.module.css";
import '../../../../../common.css';
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import GlobalContext from "../../../../../Context/GlobalContext";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from 'react-translate-component';
import DeleteModal from "../../../../../Components/Modal/DeleteModal";
import formateDate from "../../../../../utils/FormateDate";
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import { toast } from 'react-toastify';
import DataTable from "../../../../../Components/Table/DataTable";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CustomDeleteIcon from "../../../../../Components/CustomIcon/CustomDeleteIcon";

function RegistriesPage(props) {
    const context = useContext(GlobalContext);
    const location = useLocation()
    const currentPath = location.pathname
    const is_admin = currentPath.includes('admin')
    const [registries, setRegistries] = useState([]);
    const [filtredRegistries, setFiltredRegistries] = useState([]);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const [selectedRegistry, setSelectedRegistry] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const { selectedProvider, region, counterpart, setIsGlobal } = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const columns = [
        { field: 'id', headerName: counterpart("dashboard.adminRegistriesPage.table.id"), width: 200, renderCell: (params) => (<Link to={is_admin ? `/admin/registry/${params.id}` : `/registry/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: counterpart("dashboard.adminRegistriesPage.table.name"), width: 200 },
        { field: 'status', headerName: counterpart("dashboard.adminRegistriesPage.table.status"), width: 100 },
        { field: 'created_at', headerName: counterpart("dashboard.adminRegistriesPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        {
            field: 'action', headerName: counterpart("dashboard.adminRegistriesPage.table.actions"), width: 100, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    preDeleteHandler(params.id)
                };
                return <CustomDeleteIcon onClick={onClick} />
            }
        }
    ];

    useEffect(() => {
        setIsGlobal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        var api_url = is_admin
            ? `/admin/registry/${selectedProvider.name}/${region.name}/all`
            : `/registry/${selectedProvider.name}/${region.name}`
        axios.get(api_url)
            .then(res => {
                setRegistries(res.data)
                setFiltredRegistries(res.data)
            }).catch(err => {
                navigate('/notfound')
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region.name, navigate, selectedProvider.name, showConfirmDeleteModal])

    const preDeleteHandler = (registryId) => {
        setMultiSelection(false)
        const registryIndex = registries.findIndex(b => b.id === registryId)
        setSelectedRegistry(registries[registryIndex])
        setShowConfirmDeleteModal(true)
    }
    
    const deleteRegistryHandler = () => {
        setLoading(true)
        var registryId = selectedRegistry.id
        var api_url = is_admin
            ? `/admin/registry/${registryId}`
            : `/registry/${selectedProvider.name}/${region.name}/${registryId}` 
        axios.delete(api_url)
            .then(res => {
                setRegistries(filteredListWithoutRemovedElement(registryId, registries))
                setFiltredRegistries(filteredListWithoutRemovedElement(registryId, filtredRegistries))
                toast.success(counterpart('dashboard.registryOverview.message.successDelete'))
                setShowConfirmDeleteModal(false)
                setLoading(false)
            }).catch(err => {
                setShowConfirmDeleteModal(false)
                setLoading(false)
            })
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const deleteRegistriesHandler = async () => {
        setLoading(true)
        new Promise((r, j) => {
            const deletedRegistries = []
            selectedDeletionItems.forEach((registryId, index) => {
                var api_url = is_admin
                    ? `/admin/registry/${registryId}`
                    : `/registry/${selectedProvider.name}/${region.name}/${registryId}`
                axios.delete(api_url)
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
            <DeleteModal resourceName={'registry'}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteRegistriesHandler}
                onDelete={deleteRegistryHandler}
                name={selectedRegistry?.name}
                loading={loading} />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className="instanceCreation">
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
                        {
                            is_admin &&
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={
                                <h5 className="tootltipValue">
                                    <Translate content="dashboard.adminRegistriesPage.addInstance" />
                                </h5>}
                                placement="bottom">
                                <Fab color="primary" aria-label="add" onClick={() => navigate("/admin/registries/create")} style={{ transform: 'scale(0.7)' }} >
                                    <AddIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                        }
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-brands fa-docker'}
                noCreate={!is_admin}
                createUrl='/admin/registries/create'
                emptyMessage={counterpart('dashboard.adminRegistriesPage.emptyMessage')}
                createMessage={counterpart('dashboard.adminRegistriesPage.createMessage')}
                checkboxSelection
                columns={columns}
                rows={filtredRegistries}
                setMultiSelection={setMultiSelection}
                onDeleteSelection={preDeleteSelectionHandler} />
        </CardComponent>
    );
}

export default RegistriesPage;
