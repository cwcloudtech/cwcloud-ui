import { useContext, useState, useEffect } from 'react';
import axios from '../../../../../utils/axios';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import { Col, Container, Row } from 'reactstrap';
import classes from './ManageSupport.module.css';
import DataTable from '../../../../../Components/Table/DataTable';
import formateDate from '../../../../../utils/FormateDate';
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import DeleteModal from "../../../../../Components/Modal/DeleteModal";
import CustomDeleteIcon from '../../../../../Components/CustomIcon/CustomDeleteIcon';
import { toast } from 'react-toastify';
import AddTicketModal from '../../../../../Components/Modal/AddTicketModal';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import { Add } from '@mui/icons-material';
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';


function ManageSupport() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFilteredTickets] = useState([])
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [closedTickets, setClosedTickets] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [showAddTicketModal, setShowAddTicketModal] = useState(false)
    const [environments, setEnvironments] = useState([])
    const [users, setUsers] = useState([])

    const fetchData = async () => {
        context.setIsGlobal(true)
        axios.get('/admin/support')
            .then(res => {
                setTickets(res.data)
                setFilteredTickets(res.data)
            })
        axios.get('/environment/all')
        .then(res => {
            setEnvironments(res.data)
        })
        const responseUsers = await axios.get("/admin/user/all")
        setUsers(responseUsers.data.result)
    }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal])

    useEffect(() => {
        if (!tickets)
            return
        if (closedTickets) {
            setFilteredTickets(tickets.filter((ticket) => ticket.status === "closed"))
        } else {
            setFilteredTickets(tickets.filter((ticket) => ticket.status !== "closed"))
        }
    }, [tickets, closedTickets])

    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.support.table.id"), width: 100, renderCell: (params) => <Link to={`/admin/support/${params.row.id}`}>{`Ticket #${params.row.id}`}</Link> },
        { field: 'severity', headerName: context.counterpart("dashboard.support.severityText"), width: 100 },
        { field: 'subject', headerName: context.counterpart("dashboard.support.table.subject"), width: 200 },
        { field: 'selected_product', headerName: context.counterpart("dashboard.support.table.selected_product"), width: 100 },
        { field: 'created_at', headerName: context.counterpart("dashboard.support.table.created_at"), width: 150, renderCell: (params) => formateDate(params.row.created_at) },
        { field: 'last_update', headerName: context.counterpart("dashboard.support.table.last_update"), width: 150, renderCell: (params) => formateDate(params.row.created_at) },
        {
            field: 'status', headerName: 'Status', width: 200, renderCell: (params) => {
                if (params.row.status === "await customer")
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ borderRadius: '50%', background: '#22C8A2', height: '15px', width: '15px', marginRight: '10px' }}></div>
                            <h5 style={{ fontSize: '10px', margin: '0', color: colors.mainText[_mode]}}>
                                <Translate content="dashboard.support.awaitCustomer" />
                            </h5>
                        </div>
                    )
                if (params.row.status === 'await agent')
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ borderRadius: '50%', background: '#FF8D69', height: '15px', width: '15px', marginRight: '10px' }}></div>
                            <h5 style={{ fontSize: '10px', color: colors.mainText[_mode], margin: '0' }}>
                                <Translate content="dashboard.support.awaitAgent" />
                            </h5>
                        </div>
                    )
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ borderRadius: '50%', background: 'red', height: '15px', width: '15px', marginRight: '10px' }}></div>
                        <h5 style={{ fontSize: '10px', color: colors.mainText[_mode], margin: '0' }}>
                            <Translate content="dashboard.support.closed" />
                        </h5>
                    </div >
                )
            }
        },
        {
            field: 'action', headerName: context.counterpart("dashboard.projectsPage.table.actions"), width: 200, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    onPreDeleteHandler(params.id)
                };
                return <CustomDeleteIcon onClick={onClick} />
            }
        }


    ];

    const onPreDeleteHandler = (ticketId) => {
        const ticketIndex = tickets.findIndex(p => p.id === ticketId)
        setSelectedTicket(tickets[ticketIndex])
        setShowConfirmDeleteModal(true)
    }

    const onDeleteHandler = () => {
        setLoadingDelete(true)
        axios.delete(`/admin/support/${selectedTicket.id}`).then(response => {
            setTickets(filteredListWithoutRemovedElement(selectedTicket.id, tickets))
            setFilteredTickets(filteredListWithoutRemovedElement(selectedTicket.id, filteredTickets))
            toast.success(context.counterpart('dashboard.support.successDelete'))
            setShowConfirmDeleteModal(false)
            setLoadingDelete(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setLoadingDelete(false)

        })
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const onDeleteSelectionHandler = async () => {
        setLoadingDelete(true)
        new Promise((r, j) => {
            const deletedTickets = []
            selectedDeletionItems.forEach((ticketId, index) => {
                axios.delete(`/admin/support/${ticketId}`)
                    .then(() => {
                        deletedTickets.push(ticketId)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedTickets)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedTickets)
                        }
                    })
            })
        })
            .then((delete_tickets) => {
                setTickets([...tickets.filter(p => !delete_tickets.includes(p.id))])
                toast.success(context.counterpart('dashboard.support.successMultiDelete'))
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
            })
    }

    const addTicketHandler = async (ticket) => {
        setLoadingSubmit(true)
        axios.post('/admin/support', ticket)
            .then(res => {
                setTickets([res.data, ...tickets])
                setLoadingSubmit(false)
                setShowAddTicketModal(false)
            })
    }

    const filtreTickets = (e) => {
        const searchQuery = e.target.value
        if (searchQuery === "") {
            var currentTickets = 
                closedTickets
                ? tickets.filter((ticket) => ticket.status === "closed") 
                : tickets.filter((ticket) => ticket.status !== "closed")
            setFilteredTickets(currentTickets)
            return
        } else {
            const filtered = filteredTickets.filter((ticket) => {
                return ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
            })
            setFilteredTickets(filtered)
        }
    }

    return (
        <Container fluid className={classes.container} style={{ padding: "0px 20px 20px 20px" }} >
            <DeleteModal resourceName={'ticket'}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onDelete={onDeleteHandler}
                onMultiDelete={onDeleteSelectionHandler}
                name={selectedTicket?.id.toString()}
                loading={loadingDelete} />
            <AddTicketModal isAdmin={true} isOpen={showAddTicketModal} envs={environments} users={users} toggle={() => setShowAddTicketModal(!showAddTicketModal)} onSave={addTicketHandler} loading={loadingSubmit} />
            <Row style={{ marginTop: '10px', }}>
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <LoadingButton style={{ width: '35px' }} onClick={() => setShowAddTicketModal(true)}>
                        <Add />
                    </LoadingButton>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', marginBottom: '20px' }}>
                <Col>
                    <h1 className={classes.mainTitleText} style={{color: colors.mainText[_mode]}}>
                        Tickets
                    </h1>
                </Col>
            </Row>
            <Row>
                <div style={{width: "fit-content"}}>
                    <div className="toggleContainer" style={{ backgroundColor: colors.secondBackground[_mode], border: "1px solid "+colors.border[_mode], color: colors.mainText[_mode] }}>
                        <div
                            className={!closedTickets? "activeToggleItemContainer": "toggleItemContainer"}
                            onClick={() => setClosedTickets(false)}>
                            <h5 className="toggleItemText">
                                <Translate content="dashboard.support.openedTickets" />
                            </h5>
                        </div>
                        <div
                            className={closedTickets? "activeToggleItemContainer": "toggleItemContainer"}
                            onClick={() => setClosedTickets(true)}>
                            <h5 className="toggleItemText">
                                <Translate content="dashboard.support.closedTickets" />
                            </h5>
                        </div>
                    </div>
                </div>
            </Row>
            <Row style={{ marginTop: '20px' }}>
            <Col>
                    <div style={{ paddingBottom: "20px"  }} className={classes.instanceCreation}>
                        <TextField
                            onChange={(e) => filtreTickets(e) }
                            label={context.counterpart('dashboard.support.ticketTitle')}
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
            <Row>
                <Col>
                    <DataTable
                        icon={'fa-solid fa-ticket'}
                        checkboxSelection
                        onDeleteSelection={preDeleteSelectionHandler}
                        columns={columns}
                        rows={filteredTickets} />
                </Col>
            </Row>
        </Container>
    );
}

export default ManageSupport;