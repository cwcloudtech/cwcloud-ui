import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { TextField, Tooltip, Fab, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import Fade from '@mui/material/Fade';
import { Row, Col } from 'reactstrap';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import DeleteModal from '../../../../../../Components/Modal/DeleteModal';
import DataTable from '../../../../../../Components/Table/DataTable';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from "../../../../../../utils/axios";
import { isBlank } from "../../../../../../utils/common";
import { shortname } from '../../../../../../utils/monitor';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Translate from 'react-translate-component';

function Monitors(props) {
    const location = useLocation();
    const currentPath = location.pathname;
    const is_admin = currentPath.includes("admin");
    const nextPath = is_admin ? "/admin/monitor/add" : "/monitor/add";
    const context = useContext(GlobalContext);
    const { counterpart } = context;
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [monitors, setMonitors] = useState([]);
    const [filteredMonitors, setFilteredMonitors] = useState([]);
    const [selectedMonitor, setSelectedMonitor] = useState(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [multiSelection, setMultiSelection] = useState(false);
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [familyFilter, setFamilyFilter] = useState('all');
    const [familyOptions, setFamilyOptions] = useState(['all']);
    const navigate = useNavigate();
    const columns = [
        { 
            field: 'name', 
            headerName: counterpart("dashboard.monitor.table.name"), 
            width: 150,
            renderCell: (params) => (
                <Link to={
                    is_admin
                    ?`/admin/monitor/${params.id}`
                    :`/monitor/${params.id}`
                }>
                    {shortname(params.row.name)}
                </Link>
            )
        },
        { 
            field: 'url', 
            headerName: counterpart("dashboard.monitor.table.url"), 
            width: 400,
            renderCell: (params) => (
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {params.row.url}
                </div>
            )
        },
        { 
            field: 'type', 
            headerName: counterpart("dashboard.monitor.table.type"), 
            width: 80 
        },
        {
            field: 'method',
            headerName: counterpart("dashboard.monitor.table.method"),
            width: 80
        },
        {
            field: 'timeout',
            headerName: counterpart("dashboard.monitor.table.timeout"),
            width: 80
        },
        {
            field: 'family',
            headerName: counterpart("dashboard.monitor.table.family"),
            width: 80,
            renderCell: (params) => {
                return params.row.family ? params.row.family : 'N/A';
            }
        },
        {
            field: 'updated_at',
            headerName: counterpart("dashboard.monitor.table.updatedAt"),
            width: 100,
            renderCell: (params) => {
                return params.row.updated_at
            }
        },
        ...(is_admin ? [{
            field: 'owned_by',
            headerName: counterpart("dashboard.monitor.table.ownedBy"),
            width: 200,
            renderCell: (params) => {
                const owner = users.find(user => user.id === params.row.user_id);
                return owner ? owner.email : 'N/A';
            }
        }] : []),
        { 
            field: 'status', 
            headerName: counterpart("dashboard.monitor.table.status"), 
            width: 100,
            renderCell: (params) => {
                var status = params.row.status;
                const responseTime = params.row.response_time;
                const hasResponse = Boolean(responseTime);
                if (status === 'failure' && !hasResponse) {
                    status = 'pending';
                }
                const dotStyle = {
                    height: 12,
                    width: 12,
                    borderRadius: '50%',
                    margin: '0 4px',
                    display: 'inline-block'
                };
        
                return (
                    <Tooltip title={status.toUpperCase()} placement='bottom' style={{ width: '100%', textAlign: 'center' }}>
                        <span style={{
                            ...dotStyle,
                            backgroundColor: status === 'failure' && hasResponse ? '#FF0000' : 'black'
                        }} />
                        <span style={{
                            ...dotStyle,
                            backgroundColor: status === 'pending' ? '#FFD700' : 'black'
                        }} />
                        <span style={{
                            ...dotStyle,
                            backgroundColor: status === 'success' && hasResponse ? '#32CD32' : 'black'
                        }} />
                    </Tooltip>
                );
            }
        },
        { 
            field: 'response_time', 
            headerName: counterpart("dashboard.monitor.table.responseTime"), 
            width: 120,
            renderCell: (params) => {
                const responseTime = params.row.response_time;
                if (!responseTime) {
                    return (
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <Tooltip title="No response time">
                                <HourglassBottomIcon sx={{ color: 'yellow' }} />
                            </Tooltip>
                        </div>
                    );
                }
                const numericPart = responseTime.split(' ')[0];
                const formattedTime = parseFloat(numericPart).toFixed(3).toString().slice(0, 6);
                return <div style={{ width: '100%', textAlign: 'center' }}>{formattedTime} ms</div>;
            }
        },
        { 
            field: 'actions', 
            headerName: counterpart("dashboard.table.actions"), 
            width: 100, 
            renderCell: (params) => {
                const deleteMonitor = (e) => {
                    e.stopPropagation();
                    preDeleteMonitorHandler(params.id);
                };
                return (    
                    <React.Fragment>
                        <CustomDeleteIcon onClick={deleteMonitor}/>
                    </React.Fragment>
                );
            }
        },
    ];

    useEffect(() => {
        if (is_admin) {
            axios.get("/admin/user/all")
                .then(response => {
                    setUsers(response.data.result);
                })
                .catch(error => {
                    toast.error(error.response?.data?.message || context.counterpart("common.message.errorFetchingUsers"));
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_admin]);

    const fetchMonitors = () => {
        context.setIsGlobal(true);
        var api_url = is_admin ? "/admin/monitor/all" : "/monitor/all";
        return axios.get(api_url)
            .then(res => {
                setMonitors(res.data);
                const filtered = familyFilter === 'all' 
                    ? res.data 
                    : res.data.filter(monitor => monitor.family === familyFilter);
                setFilteredMonitors(filtered);
            })
            .catch(err => {
                toast.error(counterpart("dashboard.monitor.message.errorFetchMonitors"));
                console.error("Error fetching monitors:", err);
            });
    };

    useEffect(() => {
        fetchMonitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal, familyFilter]);

    useEffect(() => {
        const intervalId = setInterval(fetchMonitors, 5000);
        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [familyFilter]);

    useEffect(() => {
        const uniqueFamilies = ['all', ...new Set(monitors.map(monitor => monitor.family).filter(family => family))];
        setFamilyOptions(uniqueFamilies);
    }, [monitors]);

    const filterMonitors = (e) => {
        const searchQuery = e.target.value.trim();
        if (isBlank(searchQuery)) {
            setFilteredMonitors(monitors);
        } else {
            const filteredList = monitors.filter((monitor) =>
                monitor.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMonitors(filteredList);
        }
    };

    const handleFamilyFilterChange = (e) => {
        const newFamily = e.target.value;
        setFamilyFilter(newFamily);
        const filtered = newFamily === 'all' 
            ? monitors 
            : monitors.filter(monitor => monitor.family === newFamily);
        setFilteredMonitors(filtered);
    };

    const preDeleteMonitorHandler = (monitorId) => {
        const monitorIndex = monitors.findIndex(monitor => monitor.id === monitorId);
        setSelectedMonitor(monitors[monitorIndex]);
        setShowConfirmDeleteModal(true);
    };

    const deleteMonitorHandler = () => {
        setLoadingDelete(true);
        var api_url = is_admin ? `/admin/monitor/${selectedMonitor.id}` : `/monitor/${selectedMonitor.id}`;
        axios.delete(api_url)
            .then(() => {
                toast.success(counterpart("dashboard.monitor.message.successDelete"));
                setLoadingDelete(false);
                setShowConfirmDeleteModal(false);
            })
            .catch(err => {
                toast.error(counterpart("dashboard.monitor.message.errorDelete"));
                console.error("Error deleting monitor:", err);
                setShowConfirmDeleteModal(false);
                setLoadingDelete(false);
            });
    };

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true);
        setShowConfirmDeleteModal(true);
        setSelectedDeletionItems(selectedItems);
    };

    const deleteSelectedMonitorsHandler = async () => {
        setLoadingDelete(true);
        const deletedMonitors = [];
        
        new Promise((resolve, reject) => {
            selectedDeletionItems.forEach((monitorId, index) => {
                axios.delete(`/monitor/${monitorId}`)
                    .then(() => {
                        deletedMonitors.push(monitorId);
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedMonitors);
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedMonitors);
                        }
                    });
            });
        })
        .then((deletedMonitors) => {
            setMonitors([...monitors.filter(monitor => !deletedMonitors.includes(monitor.id))]);
            setFilteredMonitors([...filteredMonitors.filter(monitor => !deletedMonitors.includes(monitor.id))]);
            if (deletedMonitors.length > 0) {
                toast.success(counterpart("dashboard.monitor.message.successDeleteMultiple"));
            }
            setLoadingDelete(false);
            setShowConfirmDeleteModal(false);
        });
    };

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart('dashboard.monitor.overview.mainTitle')}
        >
            <DeleteModal
                resourceName={counterpart('dashboard.monitor.name').toLowerCase()}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteSelectedMonitorsHandler}
                onDelete={deleteMonitorHandler}
                name={shortname(selectedMonitor?.name)}
                loading={loadingDelete}
            />
            <Row style={{ paddingBottom: "20px" }}>
                <Col md="9">
                    <TextField
                        onChange={(e) => filterMonitors(e)}
                        label="Search Monitors"
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
                </Col>
                <Col md="2">
                    <FormControl fullWidth size="small">
                        <InputLabel>
                            <Translate content="dashboard.monitor.inputs.family.title" />
                        </InputLabel>
                        <Select
                            value={familyFilter}
                            label="Family"
                            onChange={handleFamilyFilterChange}
                        >
                            {familyOptions.map((family) => (
                                <MenuItem key={family} value={family}>
                                    {family === 'all'
                                        ? context.counterpart('dashboard.monitor.inputs.family.all')
                                        : family
                                    }
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Col>
                <Col md="1">
                    <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                    >
                        <Fab
                            color="primary"
                            aria-label="add"
                            onClick={() => navigate(nextPath)}
                            style={{ transform: "scale(0.7)" }}
                        >
                            <AddIcon className="whiteIcon" />
                        </Fab>
                    </Tooltip>
                </Col>
            </Row>

            <DataTable
                icon={'fa-solid fa-chart-line'}
                createUrl={nextPath}
                emptyMessage={counterpart('dashboard.monitor.message.emptyMessage')}
                createMessage={counterpart('dashboard.monitor.message.createMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={filteredMonitors}
                onDeleteSelection={preDeleteSelectionHandler}
            />
        </CardComponent>
    );
}

export default Monitors;
