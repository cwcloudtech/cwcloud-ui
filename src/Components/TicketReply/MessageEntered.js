import React, { useContext, useState, useEffect } from 'react';
import axios from '../../utils/axios';
import GlobalContext from '../../Context/GlobalContext';
import Identicon from 'react-identicons';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import { Row, Col } from 'reactstrap';
import colors from '../../Context/Colors';
import ReactMarkdown from 'react-markdown';
import ReplyTicketModal from '../Modal/ReplyTicketModal';
import { formatDateTime } from '../../utils/FormateDate';
import Translate from 'react-translate-component'

const MessageEntered = ({ ticket_id, reply_id, text, user, creation_date, change_date }) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const navigate = useNavigate();
  const is_admin = context.user.is_admin;
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [changeDate, setChangeDate] = useState(change_date);
  const [edited, setEdited] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [replyText, setReplyText] = useState(text);
  const redirectUserHandler = () => {
        if (is_admin) {
            navigate(`/user/${context.user.id}`)
        }
    }

  const onPreUpdateHandler = () => {
    setShowModal(true);
  }

  const onUpdateHandler = (message) => {
    const body = {
      message: message
    }
    setLoading(true);
    axios.patch(`/support/${ticket_id}/reply/${reply_id}`, body)
      .then(res => {
        setLoading(false);
        setShowModal(false);
        axios.get(`/support/${ticket_id}`)
          .then(res => {
            var replies = res.data.replies
            replies.forEach((reply, index) => {
              if (reply.id === reply_id) {
                setReplyText(replies[index].message)
                setChangeDate(formatDateTime(replies[index].change_date))
                setEdited(true)
              }
            })
          })
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      })
  }

  const onDeleteHandler = () => {
    setLoading(true);
    axios.delete(`/support/${ticket_id}/reply/${reply_id}`)
      .then(res => {
        setLoading(false)
        setShowModal(false)
        setDeleted(true)
        setReplyText(`『 ${context.counterpart('dashboard.support.message.message_deleted')} 』`)
      })
  }

  useEffect(() => {
    if (creation_date !== change_date) {
      setEdited(true);
    }
  }, [creation_date, change_date]);

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
      <ReplyTicketModal
        isOpen={showModal}
        message={replyText}
        loading={loading}
        onUpdate={onUpdateHandler}
        onDelete={onDeleteHandler}
        toggle={() => setShowModal(!showModal)}
      />
      <Tooltip placement="right" title={user.email}>
        <div style={message}>
          <div onClick={redirectUserHandler}>
            <Identicon string={user.email} size="28" style={iconEntered} />
          </div>
          <div style={{width: '10px'}}></div>
          <div style={messageEntered} className='container-fluid'>
            <Row style={{ paddingRight: "10px", paddingLeft: "20px" }}>
              <Col md="12">
                <p style={{ margin: '0', paddingRight: "20px", direction: 'ltr' }}>
                   <ReactMarkdown>{replyText}</ReactMarkdown>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </Tooltip>
      {
        !deleted &&
        <p style={{ paddingTop: "2px", fontStyle: "italic", fontSize: '12px', color: colors.title[_mode]}} >
          {edited 
            ? <span>(<Translate content="common.state.edited" />) {changeDate} </span>
            : <span>{creation_date} </span>
          }
          {
            user.email === context.user.email &&
            <span>| <Link onClick={() => onPreUpdateHandler()} style={{ color: colors.title[_mode], fontStyle: "italic" }}>Edit</Link></span>
          }
        </p>
      }
    </div>
  );
};

export default MessageEntered;
