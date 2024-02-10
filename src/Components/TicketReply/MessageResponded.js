import React, { useContext } from 'react';
import GlobalContext from '../../Context/GlobalContext';
import Identicon from 'react-identicons';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const ChatMessageEntered = ({ text, user }) => {
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
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '5px',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
  };

  const iconResponse = {
    marginRight: '20px',
    marginLeft: '5px',
    width: '25px',
  };

  return (
    <Tooltip placement="right" title={user.email}>
        <div style={messageResponse}>
          <div onClick={redirectUserHandler}>
            <Identicon string={user.email} size="28" style={iconResponse} />
          </div>
            <p style={{ margin: '0', paddingLeft: "20px" }}>{text}</p>
        </div>
    </Tooltip>
  );
};

export default ChatMessageEntered;
