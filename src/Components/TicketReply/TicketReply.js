import React from 'react';
import { formatDateTime } from '../../utils/FormateDate';
import MessageEntered from './MessageEntered';
import MessageResponded from './MessageResponded';

const rowStyle = (alignRight) => ({
    display: 'flex',
    justifyContent: alignRight ? 'flex-end' : 'flex-start',
    margin: '14px 0',
});

const columnStyle = {
    width: '100%',
    maxWidth: '860px',
    minWidth: 0,
};

const TicketReply = (props) => {
    var change_date = formatDateTime(props.reply.change_date)
    var creation_date = formatDateTime(props.reply.creation_date)

    if (props.reply.is_admin)
        return (
            <div style={rowStyle(false)}>
                <div style={columnStyle}>
                    <MessageResponded ticket_id={props.ticket_id} reply_id={props.reply.id} text={props.reply.message} user={props.reply.user} creation_date={creation_date} change_date={change_date} />
                </div>
            </div>
        )
    return (
        <div style={rowStyle(true)}>
            <div style={columnStyle}>
                <MessageEntered ticket_id={props.ticket_id} reply_id={props.reply.id} text={props.reply.message} user={props.reply.user} creation_date={creation_date} change_date={change_date} />
            </div>
        </div>
    )
}

export default TicketReply
