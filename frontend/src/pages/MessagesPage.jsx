import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import {
  setActiveConversation,
  selectActiveConversationId,
  selectConversations,
  clearUnread,
} from '../redux/slices/chatSlice';
import { useGetConversationsQuery } from '../api/conversationApi';
import styles from './MessagesPage.module.scss';

function MessagesPage() {
  const dispatch = useDispatch();
  const activeConversationId = useSelector(selectActiveConversationId);
  const conversations = useSelector(selectConversations);
  const { data: fetchedConversations, isLoading } = useGetConversationsQuery();

  useEffect(() => {
    if (!fetchedConversations?.length) return;

    if (activeConversationId) {
      const exists = fetchedConversations.some((c) => c.id === activeConversationId);
      if (exists) return;
    }

    dispatch(setActiveConversation(fetchedConversations[0].id));
    dispatch(clearUnread(fetchedConversations[0].id));
  }, [fetchedConversations, activeConversationId, dispatch]);

  useEffect(() => {
    if (activeConversationId) {
      dispatch(clearUnread(activeConversationId));
    }
  }, [activeConversationId, dispatch]);

  const hasConversations = !isLoading && conversations.length > 0;
  const showEmpty = !isLoading && conversations.length === 0;

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1>Messages</h1>
        </div>
        <ConversationList />
      </aside>

      <div className={styles.main}>
        {showEmpty && (
          <div className={styles.emptyState}>No conversations yet</div>
        )}
        {hasConversations && activeConversationId && (
          <ChatWindow conversationId={activeConversationId} />
        )}
        {hasConversations && !activeConversationId && (
          <div className={styles.emptyState}>Select a conversation</div>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
