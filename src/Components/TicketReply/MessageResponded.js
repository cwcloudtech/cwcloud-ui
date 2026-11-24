import React, { useContext, useState, useEffect } from 'react';
import axios from '../../utils/axios';
import GlobalContext from '../../Context/GlobalContext';
import Identicon from '../Identicon/Identicon';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import colors from '../../Context/Colors';
import Markdown from '../Markdown/Markdown';
import ReplyTicketModal from '../Modal/ReplyTicketModal';
import { formatDateTime } from '../../utils/FormateDate';
import Translate from '../Translate/Translate';

const ChatMessageEntered = ({ ticket_id, reply_id, text, user, creation_date, change_date }) => {
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
      navigate(`/user/${user.id}`);
    }
  };

  const onPreUpdateHandler = () => {
    setShowModal(true);
  };

  const onUpdateHandler = (message) => {
    const body = { message };
    setLoading(true);
    axios.patch(`/admin/support/${ticket_id}/reply/${reply_id}`, body)
      .then(() => {
        setLoading(false);
        setShowModal(false);
        axios.get(`/admin/support/${ticket_id}`)
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
    axios.delete(`/admin/support/${ticket_id}/reply/${reply_id}`)
      .then(() => {
        setLoading(false);
        setShowModal(false);
        setDeleted(true);
        setReplyText(`『 ${context.counterpart('dashboard.support.message.message_deleted')} 』`);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (creation_date !== change_date) {
      setEdited(true);
    }
  }, [creation_date, change_date]);

  const bubble = {
    backgroundColor: colors.bubbleAssistant[_mode],
    color: colors.bubbleAssistantText[_mode],
    border: `1px solid ${colors.border[_mode]}`,
    borderRadius: '14px',
    borderTopLeftRadius: '4px',
    padding: '12px 16px',
    flex: '0 1 auto',
    minWidth: 0,
    maxWidth: 'calc(100% - 42px)',
    boxShadow: colors.shadow[_mode],
    textAlign: 'left',
  };

  const message = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    flexDirection: 'row',
  };

  const avatar = {
    height: '32px',
    width: '32px',
    flexShrink: 0,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondBackground[_mode],
    border: `1px solid ${colors.border[_mode]}`,
    cursor: is_admin ? 'pointer' : 'default',
  };

  const meta = {
    marginTop: '4px',
    fontSize: '12px',
    color: colors.secondText[_mode],
    textAlign: 'left',
    padding: '0 42px',
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
      <div style={message}>
        <Tooltip placement="top" title={user.email}>
          <div style={avatar} onClick={redirectUserHandler}>
            <Identicon string={user.email} size={20} />
          </div>
        </Tooltip>
        <div style={bubble}>
          <Markdown>{replyText}</Markdown>
        </div>
      </div>
      {
        !deleted &&
        <p style={meta}>
          {edited 
            ? <span>(<Translate content="common.state.edited" />) {changeDate} </span>
            : <span>{creation_date} </span>
          }
          {
            user.email === context.user.email &&
              <span>| <Link onClick={() => onPreUpdateHandler()} style={{ color: colors.link[_mode] }}><Translate content="common.button.edit" /></Link></span>
          }
        </p>
      }
    </div>
  );
};

export default ChatMessageEntered;
