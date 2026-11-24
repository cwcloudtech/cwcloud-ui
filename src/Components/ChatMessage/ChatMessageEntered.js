import React, { useContext } from 'react';
import GlobalContext from '../../Context/GlobalContext';
import Identicon from '../Identicon/Identicon';

const ChatMessageEntered = ({ text }) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;

  const messageStyle = {
    backgroundColor: _mode === "dark" ? '#111a2b' : '#e0f2fe',
    color: _mode === "dark" ? 'white' : '#0a6eb4',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '5px',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center', // Center text vertically
    fontSize: '20px',
  };

  const iconStyle = {
    marginRight: '20px',
    marginLeft: '5px',
    width: '25px',
  };

  return (
    <div style={messageStyle}>
      <Identicon string={context.user.email} size="28" style={iconStyle} />
      <p style={{ margin: '0', paddingLeft: "20px" }}>{text}</p>
    </div>
  );
};

export default ChatMessageEntered;
