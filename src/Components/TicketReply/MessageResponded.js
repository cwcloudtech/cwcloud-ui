import React, { useContext } from 'react';
import GlobalContext from '../../Context/GlobalContext';
import Identicon from 'react-identicons';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { Row, Col } from 'reactstrap';
import Linkify from 'linkify-react';
import colors from '../../Context/Colors';
import ReactMarkdown from 'react-markdown';

const ChatMessageEntered = ({ text, user, dateTime }) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const navigate = useNavigate();
  const is_admin = context.user.is_admin;
  const redirectUserHandler = () => {
        if (is_admin) {
            navigate(`/user/${user.id}`)
        }
    }

  const messageResponse = {
    backgroundColor: _mode === "dark" ? '#37404a' : '#ecf5fe',
    color: _mode === "dark" ? 'white' : '#2775ba',
    borderRadius: '15px',
    borderBottomLeftRadius: '0px',
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
  }

  const iconResponse = {
    marginRight: '20px',
    marginLeft: '22px',
    height: '25px',
    width: '20px',
  };

  return (
    <div>
      <Tooltip placement="right" title={user.email}>
        <div style={message}>
          <div onClick={redirectUserHandler}>
            <Identicon string={user.email} size="28" style={iconResponse} />
          </div>
          <div style={{width: '10px'}}></div>
          <div style={messageResponse} className='container-fluid'>
            <Row style={{ paddingRight: "20px", paddingLeft: "10px" }}>
              <Col md="12">
                <p style={{ margin: '0', paddingLeft: "20px", direction: 'ltr' }}>
                    <ReactMarkdown>{text}</ReactMarkdown>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </Tooltip>
      <p style={{ paddingTop: "2px", fontStyle: "italic", fontSize: '12px', float: "right", color: colors.title[_mode]}} >{dateTime}</p>
    </div>
  );
};

export default ChatMessageEntered;
