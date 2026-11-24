import React, { useContext } from 'react';
import GlobalContext from '../../Context/GlobalContext';
import colors from '../../Context/Colors';
import Markdown from '../Markdown/Markdown';

const TicketDescription = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const card = {
        backgroundColor: colors.secondBackground[_mode],
        color: colors.mainText[_mode],
        border: `1px solid ${colors.border[_mode]}`,
        borderLeft: `4px solid ${colors.blue[_mode]}`,
        borderRadius: '10px',
        padding: '16px 20px',
        margin: '16px 0',
        boxShadow: colors.shadow[_mode],
        textAlign: 'left',
        minWidth: 0,
    };

    return (
        <div style={card}>
            <Markdown>{props.reply.message}</Markdown>
        </div>
    )
}

export default TicketDescription
