import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Translate from 'react-translate-component';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { Col, Row } from 'reactstrap';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import CustomEditIcon from '../../../../../../Components/CustomIcon/CustomEditIcon';
import DeleteModal from '../../../../../../Components/Modal/DeleteModal';
import DataTable from '../../../../../../Components/Table/DataTable';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from "../../../../../../utils/axios";
import formateDate from '../../../../../../utils/FormateDate';

function KVStorage(props) {
    const location = useLocation();
    const currentPath = location.pathname;
    const is_admin = currentPath.includes("admin");
    const context = useContext(GlobalContext);
    const { counterpart } = context;
    const navigate = useNavigate();
    const createLink = "/kv/create";
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [kvEntries, setKvEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [multiSelection, setMultiSelection] = useState(false);
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([]);

    const columns = [
        ...(is_admin ? [{
            field: 'id',
            headerName: counterpart("dashboard.kv.table.id"),
            width: 300,
            renderCell: (params) => (
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {params.row.id}
                </div>
            )
        }] : []),
        { 
            field: 'key', 
            headerName: counterpart("dashboard.kv.table.key"), 
            width: 150,
            renderCell: (params) => (
                params.row.key
            )
        },
        { 
            field: 'payload', 
            headerName: counterpart("dashboard.kv.table.payload"), 
            width: 300,
            renderCell: (params) => (
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {JSON.stringify(params.row.payload).substring(0, 50)}
                    {JSON.stringify(params.row.payload).length > 50 ? '...' : ''}
                </div>
            )
        },
        { 
            field: 'ttl', 
            headerName: counterpart("dashboard.kv.table.ttl"), 
            width: 100,
            renderCell: (params) => (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    {params.row.ttl ? params.row.ttl : <i className="fa-solid fa-infinity"></i>}
                </div>
            )
        },
        { 
            field: 'source', 
            headerName: counterpart("dashboard.kv.table.source"), 
            width: 100,
            renderCell: (params) => (
                params.row.source
            )
        },
        ...(is_admin ? [{
            field: 'user_email',
            headerName: counterpart("dashboard.kv.table.ownedBy"),
            width: 220,
        }] : []),
        {
            field: 'created_at',
            headerName: counterpart("dashboard.kv.table.createdAt"),
            width: 100,
            renderCell: (params) => formateDate(params.row.created_at)
        },
        {
            field: 'updated_at',
            headerName: counterpart("dashboard.kv.table.updatedAt"),
            width: 100,
            renderCell: (params) => formateDate(params.row.updated_at)
        },
        { 
            field: 'actions', 
            headerName: counterpart("dashboard.table.actions"), 
            width: 150, 
            renderCell: (params) => {
                const deleteEntry = (e) => {
                    e.stopPropagation();
                    preDeleteEntryHandler(params.id);
                };
                
                const editEntry = (e) => {
                    e.stopPropagation();
                    const editPath = is_admin 
                        ? `/admin/kv/edit/${params.row.key}`
                        : `/kv/edit/${params.row.key}`;
                    navigate(editPath, { state: { kvEntry: params.row } });
                };
                
                return (    
                    <React.Fragment>
                        <CustomEditIcon onClick={editEntry}/>
                        <CustomDeleteIcon onClick={deleteEntry}/>
                    </React.Fragment>
                );
            }
        },
    ];

    const fetchKVEntries = (searchQuery = '') => {
        context.setIsGlobal(true);
        const api_url = is_admin 
            ? `/admin/storage/kv/all${searchQuery ? `?search=${searchQuery}` : ''}` 
            : `/storage/kv${searchQuery ? `?search=${searchQuery}` : ''}`;
        return axios.get(api_url)
            .then(res => {
                const entries = res.data.items.map(entry => ({
                    ...entry,
                    id: entry.id || `${entry.source}_${entry.key}`
                }));
                setKvEntries(entries);
                setFilteredEntries(entries);
            })
            .catch(err => {
                toast.error(counterpart("dashboard.kv.message.errorFetchEntries"));
                console.error("Error fetching KV entries:", err);
            });
    };

    useEffect(() => {
        fetchKVEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal]);

    const filterEntries = (e) => {
        const searchQuery = e.target.value.trim();
        fetchKVEntries(searchQuery);
    };

    const preDeleteEntryHandler = (entryId) => {
        const entryIndex = kvEntries.findIndex(entry => entry.id === entryId);
        setSelectedEntry(kvEntries[entryIndex]);
        setShowConfirmDeleteModal(true);
    };

    const deleteEntryHandler = () => {
        setLoadingDelete(true);
        const api_url = is_admin 
            ? `/admin/storage/kv/user/${selectedEntry.user_id}/storage/${selectedEntry.key}` 
            : `/storage/kv/${selectedEntry.key}`;
        
        axios.delete(api_url)
            .then(() => {
                toast.success(counterpart("dashboard.kv.message.successDelete"));
                setLoadingDelete(false);
                setShowConfirmDeleteModal(false);
            })
            .catch(err => {
                toast.error(counterpart("dashboard.kv.message.errorDelete"));
                console.error("Error deleting KV entry:", err);
                setShowConfirmDeleteModal(false);
                setLoadingDelete(false);
            });
    };

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true);
        setShowConfirmDeleteModal(true);
        setSelectedDeletionItems(selectedItems);
    };

    const deleteSelectedEntriesHandler = async () => {
        setLoadingDelete(true);
        const deletedEntries = [];
        
        new Promise((resolve, reject) => {
            selectedDeletionItems.forEach((entryId, index) => {
                const entry = kvEntries.find(item => item.id === entryId);
                if (!entry) return;
                
                const api_url = is_admin 
                    ? `/admin/storage/kv/user/${entry.user_id}/storage/${entry.key}` 
                    : `/storage/kv/${entry.key}`;
                
                axios.delete(api_url)
                    .then(() => {
                        deletedEntries.push(entryId);
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedEntries);
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedEntries);
                        }
                    });
            });
        })
        .then((deletedEntries) => {
            setKvEntries([...kvEntries.filter(entry => !deletedEntries.includes(entry.id))]);
            setFilteredEntries([...filteredEntries.filter(entry => !deletedEntries.includes(entry.id))]);
            if (deletedEntries.length > 0) {
                toast.success(counterpart("dashboard.kv.message.successDeleteMultiple"));
            }
            setLoadingDelete(false);
            setShowConfirmDeleteModal(false);
        });
    };

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart('dashboard.kv.overview.mainTitle')}
        >
            <DeleteModal
                resourceName={counterpart('dashboard.kv.name').toLowerCase()}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteSelectedEntriesHandler}
                onDelete={deleteEntryHandler}
                name={selectedEntry?.key}
                loading={loadingDelete}
            />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className="instanceCreation">
                        <TextField
                            onChange={(e) => filterEntries(e) }
                            label={counterpart('dashboard.kv.table.key')}
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
                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className="tootltipValue">
                            <Translate content="dashboard.kv.overview.addKV" />
                        </h5>} placement="bottom">
                            <Fab color="primary" aria-label="add" onClick={() => navigate(createLink)} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-database'}
                createUrl={createLink}
                emptyMessage={counterpart('dashboard.kv.overview.emptyMessage')}
                createMessage={counterpart('dashboard.kv.overview.createMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={kvEntries}
                onDeleteSelection={preDeleteSelectionHandler} />
        </CardComponent>
    );
}

export default KVStorage;
