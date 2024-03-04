import React, { useContext } from 'react';
import GlobalContext from '../../Context/GlobalContext';
import Identicon from 'react-identicons';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import { Row, Col } from 'reactstrap';
import Linkify from 'linkify-react';
import colors from '../../Context/Colors';

const MessageEntered = ({ text, user, dateTime }) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const navigate = useNavigate();
  const is_admin = context.user.is_admin;
  const redirectUserHandler = () => {
        if (is_admin) {
            navigate(`/user/${context.user.id}`)
        }
    }

  const messageEntered = {
    backgroundColor: _mode === "dark" ? '#2c3139' : '#dae8f7',
    color: _mode === "dark" ? 'white' : '#2775ba',
    borderRadius: '15px',
    borderBottomRightRadius: '0px',
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

  const iconEntered = {
    marginRight: '5px',
    marginLeft: '22px',
    height: '25px',
    width: '20px',
  };

  return (
    <div>
      <Tooltip placement="right" title={user.email}>
        <div style={message}>
          <div onClick={redirectUserHandler}>
            <Identicon string={user.email} size="28" style={iconEntered} />
          </div>
          <div style={{width: '10px'}}></div>
          <div style={messageEntered} className='container-fluid'>
            <Row style={{ paddingRight: "10px", paddingLeft: "20px" }}>
              <Col md="12">
                <p style={{ margin: '0', paddingRight: "20px", direction: 'rtl' }}><Linkify>{text}</Linkify></p>
              </Col>
            </Row>
          </div>
        </div>
      </Tooltip>
      <p style={{ paddingTop: "2px", fontStyle: "italic", fontSize: '12px', color: colors.title[_mode]}} >{dateTime}</p>
    </div>
  );
};

export default MessageEntered;
