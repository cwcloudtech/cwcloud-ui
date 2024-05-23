import React, { useContext, useState, useEffect } from 'react';
import axios from '../../../../../utils/axios';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import { Col, Container, Row } from 'reactstrap';
import classes from './Support.module.css';
import DataTable from '../../../../../Components/Table/DataTable';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import { Link } from 'react-router-dom';
import formateDate from '../../../../../utils/FormateDate';
import AddTicketModal from '../../../../../Components/Modal/AddTicketModal';
import TicketModal from '../../../../../Components/Modal/TicketModal';
import { Add } from '@mui/icons-material';
import Translate from "react-translate-component";
import CustomEditIcon from '../../../../../Components/CustomIcon/CustomEditIcon';

function Support() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [showAddTicketModal, setShowAddTicketModal] = useState(false)
    const [showTicketModal, setShowTicketModal] = useState(false)
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFilteredTickets] = useState([])
    const [environments, setEnvironments] = useState([])
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [closedTickets, setClosedTickets] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState(null)

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get('/support')
            .then(res => {
                setTickets(res.data)
            })
        axios.get('/environment/all')
            .then(res => {
                setEnvironments(res.data)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showTicketModal])

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
        { field: 'id', headerName: context.counterpart("dashboard.support.table.id"), width: 100, renderCell: (params) => <Link to={`/support/${params.row.id}`}>{`Ticket #${params.row.id}`}</Link> },
        { field: 'subject', headerName: context.counterpart("dashboard.support.table.subject"), width: 200 },
        { field: 'selected_product', headerName: context.counterpart("dashboard.support.table.selected_product"), width: 200 },
        { field: 'created_at', headerName: context.counterpart("dashboard.support.table.created_at"), width: 200, renderCell: (params) => formateDate(params.row.created_at) },
        { field: 'last_update', headerName: context.counterpart("dashboard.support.table.last_update"), width: 200, renderCell: (params) => formateDate(params.row.created_at) },
        {
            field: 'status', headerName: 'Status', width: 200, renderCell: (params) => {
                if (params.row.status === "await customer")
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ borderRadius: '50%', background: '#22C8A2', height: '15px', width: '15px', marginRight: '10px' }}></div>
                            <h5 style={{ fontSize: '10px', color: colors.mainText[_mode], margin: '0' }}>
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
                            <Translate content="dashboard.support.closed" /></h5>
                    </div>
                )
            }
        },
        {field: 'actions', headerName: context.counterpart("dashboard.table.actions"), width: 130, renderCell: (params) => {
            const updateTicket = (e) => {
                e.stopPropagation()
                onPreUpdateHandler(params.id)
            };
            return (
                <React.Fragment>
                    <CustomEditIcon onClick={updateTicket} />
                </React.Fragment>
            )
        }}
    ];

    const addTicketHandler = async (ticket) => {
        setLoadingSubmit(true)
        axios.post('/support', ticket)
            .then(res => {
                setTickets([res.data, ...tickets])
                setLoadingSubmit(false)
                setShowAddTicketModal(false)
            })
    }

    const onPreUpdateHandler = (ticketId) => {
        const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId)
        setSelectedTicket(tickets[ticketIndex])
        setShowTicketModal(true)
    }

    const onUpdateHandler = (ticket) => {
        setLoading(true)
        var body = {
            severity: ticket.severity,
            product: ticket.selected_product,
            subject: ticket.subject,
            message: ticket.message
        }
        axios.patch(`/support/${ticket.id}`, body)
            .then(res => {
                setLoading(false)
                setShowTicketModal(false)
            })
    }

    return (
        <Container fluid className={classes.container} style={{ padding: "0px 20px 20px 20px", }} >
            <AddTicketModal isOpen={showAddTicketModal} envs={environments} toggle={() => setShowAddTicketModal(!showAddTicketModal)} onSave={addTicketHandler} loading={loadingSubmit} />
            {
                selectedTicket && <TicketModal isOpen={showTicketModal} ticket={selectedTicket} onUpdate={onUpdateHandler} loading={loading} toggle={() => setShowTicketModal(!showTicketModal)} />
            }
            <Row style={{ marginTop: '10px', marginBottom: '20px' }}>
                <Col>
                    <h2 className={classes.mainTitleText} style={{color: colors.mainText[_mode]}}>
                        Tickets
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{width: "fit-content"}}>
                        <div className="toggleContainer" style={{ backgroundColor: colors.secondBackground[_mode], border: "1px solid "+colors.border[_mode], color: colors.mainText[_mode] }}>
                            <div
                                className={!closedTickets ? "activeToggleItemContainer" : "toggleItemContainer"}
                                onClick={() => setClosedTickets(false)}>
                                <h5 className="toggleItemText">
                                    <Translate content="dashboard.support.openedTickets" />
                                </h5>
                            </div>
                            <div
                                className={closedTickets ? "activeToggleItemContainer" : "toggleItemContainer"}
                                onClick={() => setClosedTickets(true)}>
                                <h5 className="toggleItemText">
                                    <Translate content="dashboard.support.closedTickets" />
                                </h5>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <LoadingButton style={{ width: '35px' }} onClick={() => setShowAddTicketModal(true)}>
                        <Add />
                    </LoadingButton>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DataTable
                        columns={columns}
                        rows={filteredTickets} />
                </Col>
            </Row>
        </Container>
    );
}

export default Support;