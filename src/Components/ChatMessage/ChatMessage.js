import React, { useContext, useState, useEffect } from 'react';
import GlobalContext from '../../Context/GlobalContext';

const ChatMessage = ({ text }) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;

  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timer;

    if (isTyping) {
      timer = setTimeout(() => {
        const currentTextLength = typedText.length;
        const targetText = text;

        if (currentTextLength < targetText.length) {
          const nextChar = targetText.charAt(currentTextLength);
          setTypedText((prevText) => prevText + nextChar);
        } else {
          setIsTyping(false);
        }
      }, 60); // Adjust the typing speed by changing the delay (in milliseconds)
    }

    return () => clearTimeout(timer);
  }, [isTyping, text, typedText]);

  const messageStyle = {
    backgroundColor: _mode === "dark" ? '#37404a' : '#ecf5fe',
    color: _mode === "dark" ? 'white' : '#2775ba',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '5px',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center', // Center text vertically
    fontSize: '20px',
  };

  const iconStyle = {
    marginRight: '22px',
    marginLeft: '5px', // Add some spacing between the icon and text
    height: '25px', // Adjust the height of the icon as per your requirements
    width: '20px', // Adjust the width of the icon as per your requirements
  };

  return (
    <div style={messageStyle}>
      <i className="fa-solid fa-robot" style={iconStyle} />
      <p style={{ margin: '0' }}>{typedText}</p>
    </div>
  );
};

export default ChatMessage;
