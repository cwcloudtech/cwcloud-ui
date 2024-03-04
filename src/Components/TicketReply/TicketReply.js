import React from 'react';
import { formatDateTime } from '../../utils/FormateDate';
import { Col, Row } from 'reactstrap';
import MessageEntered from './MessageEntered';
import MessageResponded from './MessageResponded';

const TicketReply = (props) => {
    var dateTime = props.reply.created_at ? formatDateTime(props.reply.created_at) : formatDateTime(props.reply.change_date)
    if (props.reply.is_admin)
        return (
            <Row style={{marginTop: '10px', marginBottom: '10px' }}>
                <Col md="6">
                    <MessageResponded text={props.reply.message} user={props.reply.user} dateTime={dateTime} />
                </Col>
            </Row>
        )
    return (
        <Row style={{marginTop: '10px', marginBottom: '10px' }}>
            <Col md="6"/>
            <Col md="6">
                <MessageEntered text={props.reply.message} user={props.reply.user} dateTime={dateTime}/>
            </Col>
        </Row>
    )
}

export default TicketReply