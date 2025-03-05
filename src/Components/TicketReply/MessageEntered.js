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
      navigate(`/user/${context.user.id}`);
    }
  };

  const onPreUpdateHandler = () => {
    setShowModal(true);
  };

  const onUpdateHandler = (message) => {
    const body = { message };
    setLoading(true);
    axios.patch(`/support/${ticket_id}/reply/${reply_id}`, body)
      .then(() => {
        setLoading(false);
        setShowModal(false);
        axios.get(`/support/${ticket_id}`)
          .then(res => {
            const replies = res.data.replies;
            replies.forEach((reply) => {
              if (reply.id === reply_id) {
                setReplyText(reply.message);
                setChangeDate(formatDateTime(reply.change_date));
                setEdited(true);
              }
            });
          });
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };

  const onDeleteHandler = () => {
    setLoading(true);
    axios.delete(`/support/${ticket_id}/reply/${reply_id}`)
      .then(() => {
        setLoading(false);
        setShowModal(false);
        setDeleted(true);
        setReplyText(`『 ${context.counterpart('dashboard.support.message.message_deleted')} 』`);
      });
  };

  useEffect(() => {
    if (creation_date !== change_date) {
      setEdited(true);
    }
  }, [creation_date, change_date]);

  const messageEntered = {
    backgroundColor: _mode === "dark" ? '#2c3139' : '#dae8f7',
    color: _mode === "dark" ? 'white' : '#2775ba',
    borderRadius: '15px',
    borderTopRightRadius: '0px',
    padding: '15px',
    marginBottom: '5px',
    maxWidth: '100%',
    fontSize: '20px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  };

  const message = {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row-reverse',
  };

  const iconEntered = {
    marginRight: '0px',
    marginLeft: '10px',
    height: '28px',
    width: '28px',
    flexShrink: 0
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
          <div style={{...messageEntered, width: '100%'}} className='container-fluid'>
            <Row style={{ width: "100%", margin: 0 }}>
              <Col md="12" style={{ padding: 0 }}>
                <div style={{ margin: '0', paddingRight: "20px", direction: 'ltr', maxWidth: '100%' }}>
                  <ReactMarkdown components={{
                    code: ({node, inline, className, children, ...props}) => {
                      return inline ? (
                        <code className={className} {...props}>{children}</code>
                      ) : (
                        <div style={{ position: 'relative', maxWidth: '100%' }}>
                          <pre
                            style={{
                              margin: 0,
                              padding: 0,
                              maxWidth: '100%',
                              overflow: 'hidden',
                            }}
                          >
                            <code
                              className={className}
                              style={{
                                display: 'block',
                                overflowX: 'auto',
                                maxWidth: '100%',
                                padding: '8px',
                                backgroundColor: _mode === 'dark' ? '#1e2227' : '#f5f5f5',
                                borderRadius: '4px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                              }}
                              {...props}
                            >
                              {children}
                            </code>
                          </pre>
                        </div>
                      );
                    },
                    p: ({node, children, ...props}) => (
                      <p 
                        style={{ 
                          margin: '0', 
                          overflowWrap: 'break-word', 
                          wordBreak: 'break-word',
                          maxWidth: '100%' 
                        }} 
                        {...props}
                      >
                        {children}
                      </p>
                    )
                  }}>
                    {replyText}
                  </ReactMarkdown>
                </div>
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
