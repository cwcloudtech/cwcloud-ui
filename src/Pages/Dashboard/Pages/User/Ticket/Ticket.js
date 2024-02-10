import { useContext, useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import classes from "./Ticket.module.css";
import { Row, Col } from "reactstrap";
import { NavLink, useParams } from "react-router-dom";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import { TextareaAutosize } from '@mui/material';
import GlobalContext from '../../../../../Context/GlobalContext';
import TicketReply from '../../../../../Components/TicketReply/TicketReply'
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import Translate from 'react-translate-component';
import colors from '../../../../../Context/Colors';
import formateDate from '../../../../../utils/FormateDate';

function Ticket() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const { ticketId } = useParams()
    const [ticket, setTicket] = useState(null)
    const [replyMessage, setReplyMessage] = useState('')
    const [loadingReply, setLoadingReply] = useState(false)

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get(`/support/${ticketId}`)
            .then(res => {
                setTicket(res.data)
            })
    }, [context, ticketId, loadingReply])

    const getStatusIcon = () => {
        if (ticket.status === "await customer")
            return (
                <div style={{ display: 'inline-block', borderRadius: '50%', background: '#22C8A2', height: '15px', width: '15px', marginRight: '15px' }}></div>
            )
        if (ticket.status === 'await agent')
            return (
                <div style={{ display: 'inline-block', borderRadius: '50%', background: '#FF8D69', height: '15px', width: '15px', marginRight: '15px' }}></div>
            )
        return (
            <div style={{ display: 'inline-block', borderRadius: '50%', background: 'red', height: '15px', width: '15px', marginRight: '15px' }}></div>
        )
    }
    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            replyHandler()
        }
    }
    const replyHandler = () => {
        setLoadingReply(true)
        axios.post(`/support/${ticket.id}`, { message: replyMessage })
            .then(res => {
                setLoadingReply(false)
                setTicket({ ...ticket, status: 'await agent', replies: [{ ...res.data }, ...ticket.replies] })
                setReplyMessage("")
            })
    }
    const findSeverity = (severity) => {
        return context.counterpart(`dashboard.support.severity.${severity}`)
    }

    if (!ticket)
        return null
    return (
        <Container fluid>
            <div className={classes.goBack} >
                <NavLink to='/support' className={classes.link}>
                    <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                    <Translate content="dashboard.support.back" />
                </NavLink>
            </div>
            <Row style={{ marginTop: '20px' }}>
                <Col>
                    <h5 style={{ width: '100%', margin: '0', color: colors.mainText[_mode] }}>{getStatusIcon()} {`Ticket ${ticket.id} - ${ticket.subject}`}</h5>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
                <Col>
                    <h5 style={{ fontSize: '12px', fontWeight: '400', color: colors.title[_mode] }}>
                        {`${findSeverity(ticket.severity)} ${context.counterpart("dashboard.support.severityText")}`} | {ticket.selected_product} | <Translate content="dashboard.table.createdAt" /> : {formateDate(ticket.created_at)} | <Translate content="dashboard.table.updatedAt" /> : {formateDate(ticket.last_update)}
                    </h5>
                </Col>

            </Row>
            <Row style={{ marginTop: '30px', marginBottom: '30px' }}>
                <Col>
                    <TicketReply key={'first1'} reply={{ ...ticket, change_date: ticket.created_at }} />
                    {ticket.replies.map(reply => (
                        <TicketReply key={reply.id} reply={reply} />
                    ))}
                </Col>
            </Row>
            {ticket.status !== 'closed' &&
                <Row >
                    <Col>
                        <Row>
                            <Col>
                                <TextareaAutosize 
                                    placeholder={context.counterpart("dashboard.support.updateFromKeyboardTip")}
                                    minRows={3}
                                    style={{ width: '100%', padding: '10px 15px', backgroundColor: colors.secondBackground[_mode], color: colors.menuText[_mode], border: "1px solid "+ colors.textAreaBorder[_mode], borderRadius: "5px", marginBottom: "20px" }}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingButton disabled={isBlank(replyMessage)} loading={loadingReply} onClick={replyHandler}>
                                    <Translate content="dashboard.support.reply" />
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row >
            }
        </Container >
    )
}

export default Ticket