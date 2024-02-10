import React, { useContext } from 'react';
import GlobalContext from '../../Context/GlobalContext';
import Identicon from 'react-identicons';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';

const MessageEntered = ({ text, user }) => {
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
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '5px',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    flexDirection: 'row-reverse',
  };

  const iconEntered = {
    marginRight: '5px',
    marginLeft: '22px',
    height: '25px',
    width: '20px',
  };

  return (
    <Tooltip placement="right" title={user.email}>
      <div style={messageEntered}>
        <div onClick={redirectUserHandler}>
          <Identicon string={user.email} size="28" style={iconEntered} />
        </div>
        <p style={{ margin: '0', paddingRight: "20px" }}>{text}</p>
      </div>
    </Tooltip>
  );
};

export default MessageEntered;
