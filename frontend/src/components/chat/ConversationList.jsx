import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetConversationsQuery } from '../../api/conversationApi';
import {
  setConversations,
  setActiveConversation,
  clearUnread,
  selectActiveConversationId,
  selectMessages,
  selectUnreadCount,
} from '../../redux/slices/chatSlice';
import { formatRelativeTime, truncateText } from '../../utils/formatTime';
import styles from './ConversationList.module.scss';

function ConversationList() {
  const dispatch = useDispatch();
  const activeConversationId = useSelector(selectActiveConversationId);
  const { data, isLoading } = useGetConversationsQuery();

  useEffect(() => {
    if (data) {
      dispatch(setConversations(data));
    }
  }, [data, dispatch]);

  const handleSelect = (conversationId) => {
    dispatch(setActiveConversation(conversationId));
    dispatch(clearUnread(conversationId));
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading conversations…</div>;
  }

  if (!data?.length) {
    return <div className={styles.empty}>No conversations yet</div>;
  }

  return (
    <div className={styles.list}>
      {data.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
          onSelect={() => handleSelect(conversation.id)}
        />
      ))}
    </div>
  );
}

function ConversationItem({ conversation, isActive, onSelect }) {
  const messages = useSelector((state) => selectMessages(state, conversation.id));
  const unread = useSelector((state) => selectUnreadCount(state, conversation.id));

  const otherParticipant = conversation.otherParticipant || {
    username: 'Unknown',   //issue
  };

  const lastMsg = messages[messages.length - 1];
  const preview = truncateText(
    conversation.lastMessage?.content || lastMsg?.content || 'No messages yet'
  );

  return (
    <button
      type="button"
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onSelect}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{otherParticipant.username}</span>
          <span className={styles.time}>
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>
        <div className={styles.previewRow}>
          <span className={styles.preview}>{preview}</span>
          {unread > 0 && (
            <span className={styles.badge}>{unread > 99 ? '99+' : unread}</span>
          )}
        </div>
      </div>
    </button>
  );
}

export default ConversationList;
