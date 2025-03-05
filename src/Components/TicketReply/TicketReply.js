import React from 'react';
import { formatDateTime } from '../../utils/FormateDate';
import { Col, Row } from 'reactstrap';
import MessageEntered from './MessageEntered';
import MessageResponded from './MessageResponded';

const TicketReply = (props) => {
    var change_date = formatDateTime(props.reply.change_date)
    var creation_date = formatDateTime(props.reply.creation_date)

    if (props.reply.is_admin)
        return (
            <Row style={{marginTop: '10px', marginBottom: '10px'}}>
                <Col md="8" lg="6">
                    <MessageResponded ticket_id={props.ticket_id} reply_id={props.reply.id} text={props.reply.message} user={props.reply.user} creation_date={creation_date} change_date={change_date} />
                </Col>
                <Col md="4" lg="6" />
            </Row>
        )
    return (
        <Row style={{marginTop: '10px', marginBottom: '10px'}}>
            <Col md="4" lg="6" />
            <Col md="8" lg="6">
                <MessageEntered ticket_id={props.ticket_id} reply_id={props.reply.id} text={props.reply.message} user={props.reply.user} creation_date={creation_date} change_date={change_date} />
            </Col>
        </Row>
    )
}

export default TicketReply
