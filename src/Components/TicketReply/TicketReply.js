import React from 'react';
import formateDate from '../../utils/FormateDate'
import { Col, Row } from 'reactstrap';
import MessageEntered from './MessageEntered';
import MessageResponded from './MessageResponded';

const TicketReply = (props) => {
    if (props.reply.is_admin)
        return (
            <Row style={{marginTop: '10px', marginBottom: '10px' }}>
                <Col md="6">
                    <MessageResponded text={props.reply.message} user={props.reply.user} />
                </Col>
                <Col>
                    <div>
                        <h5 style={{ margin: '0', fontSize: '11px', fontWeight: '500', color: '#999999', marginTop: "3px"  }}>
                            {formateDate(props.change_date)}
                        </h5>
                    </div>
                </Col>
            </Row>
        )
    return (
        <Row style={{marginTop: '10px', marginBottom: '10px' }}>
            <Col md="6"/>
            <Col md="6">
                <MessageEntered text={props.reply.message} user={props.reply.user} />
            </Col>
            <Col>
                <div>
                    <h5 style={{ margin: '0', fontSize: '11px', fontWeight: '500', color: '#999999', marginTop: "3px"  }}>
                        {formateDate(props.change_date)}
                    </h5>
                </div>
            </Col>
        </Row>
    )
}

export default TicketReply