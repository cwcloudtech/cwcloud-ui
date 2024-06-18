import React, { useContext } from 'react';
import GlobalContext from '../../Context/GlobalContext';
import { Col, Row } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import convertMarkdownLink from '../../utils/convertMarkdownLink';

const TicketDescription = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const messageEntered = {
        backgroundColor: _mode === "dark" ? '#2c3139' : '#dae8f7',
        color: _mode === "dark" ? 'white' : '#2775ba',
        borderRadius: '15px',
        padding: '15px',
        marginBottom: '5px',
        maxWidth: '100%',
        fontSize: '20px',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
    };

    const message = {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse',
    }
    return (
        <Row style={{marginTop: '10px', marginBottom: '10px' }}>
            <Col md="12">
                <div style={message}>
                    <div style={messageEntered} className='container-fluid'>
                        <Row style={{ paddingRight: "10px", paddingLeft: "20px" }}>
                        <Col md="12">
                            <p className='text-center' style={{ fontSize: "20px" }}>
                                <ReactMarkdown>{convertMarkdownLink(props.reply.message)}</ReactMarkdown>
                            </p>
                        </Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default TicketDescription
