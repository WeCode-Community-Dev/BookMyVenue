import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyGetMessagesQuery } from '../../api/conversationApi';
import {
  addMessage,
  setMessages,
  updateMessageStatus,
  selectMessages,
  selectConversations,
} from '../../redux/slices/chatSlice';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { sendMessage as wsSendMessage } from '../../hooks/useWebSocket';
import styles from './ChatWindow.module.scss';

const SCROLL_THRESHOLD = 80;

function ChatWindow({ conversationId }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const conversations = useSelector(selectConversations);
  const messages = useSelector((state) => selectMessages(state, conversationId));

  const [input, setInput] = useState('');
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const messagesRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const prevScrollHeightRef = useRef(0);

  const [fetchMessages, { isFetching }] = useLazyGetMessagesQuery();

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherParticipant = conversation?.otherParticipant || { username: 'Chat' };

  const loadInitialMessages = useCallback(async () => {
    try {
      const result = await fetchMessages({ conversationId, limit: 20 }).unwrap();
      dispatch(setMessages({ conversationId, messages: result || [] }));
      setHasMore((result || []).length >= 20);
      setInitialLoaded(true);
    } catch (err) {
      console.error('Failed to load messages', err);
      setInitialLoaded(true);
    }
  }, [conversationId, dispatch, fetchMessages]);

  useEffect(() => {
    setInitialLoaded(false);
    setHasMore(true);
    loadInitialMessages();
  }, [conversationId, loadInitialMessages]);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
    }
  }, []);

  useEffect(() => {
    if (initialLoaded) {
      scrollToBottom('auto');
    }
  }, [initialLoaded, conversationId, scrollToBottom]);

  useEffect(() => {
    if (isAtBottomRef.current && messages.length) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  const handleScroll = async () => {
    const el = messagesRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAtBottomRef.current = distanceFromBottom < SCROLL_THRESHOLD;

    if (el.scrollTop > 20 || loadingOlder || !hasMore || isFetching) return;

    const oldest = messages[0];
    if (!oldest?.createdAt) return;

    setLoadingOlder(true);
    prevScrollHeightRef.current = el.scrollHeight;

    try {
      const older = await fetchMessages({
        conversationId,
        cursor: oldest.createdAt,
        limit: 20,
      }).unwrap();

      if (!older?.length) {
        setHasMore(false);
      } else {
        dispatch(setMessages({ conversationId, messages: older, prepend: true }));
        setHasMore(older.length >= 20);
      }
    } catch (err) {
      console.error('Failed to load older messages', err);
    } finally {
      setLoadingOlder(false);
      requestAnimationFrame(() => {
        const container = messagesRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight - prevScrollHeightRef.current;
        }
      });
    }
  };

  const submitMessage = useCallback(
    (content, retryTempId) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const tempId = retryTempId || `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      if (!retryTempId) {
        dispatch(
          addMessage({
            tempId,
            id: tempId,
            conversationId,
            senderId: currentUser.id,
            content: trimmed,
            venueId: null,
            isRead: true,
            createdAt: new Date().toISOString(),
            status: 'sending',
          })
        );
      } else {
        dispatch(updateMessageStatus({ conversationId, tempId, status: 'sending' }));
      }

      const sent = wsSendMessage(conversationId, trimmed);
      if (!sent) {
        dispatch(updateMessageStatus({ conversationId, tempId, status: 'failed' }));
      }

      isAtBottomRef.current = true;
    },
    [conversationId, currentUser?.id, dispatch]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    submitMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRetry = (msg) => {
    submitMessage(msg.content, msg.tempId);
  };

  return (
    <div className={styles.window}>
      <header className={styles.header}>
        <h2>{otherParticipant.username}</h2>
      </header>

      <div className={styles.messages} ref={messagesRef} onScroll={handleScroll}>
        {(loadingOlder || isFetching) && !initialLoaded && (
          <div className={styles.loadMore}>Loading messages…</div>
        )}
        {loadingOlder && initialLoaded && (
          <div className={styles.loadMore}>Loading older messages…</div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUser?.id;
          const statusClass =
            msg.status === 'failed' ? styles.failed : msg.status === 'sending' ? styles.sending : '';

          return (
            <div
              key={msg.id || msg.tempId}
              className={`${styles.bubbleRow} ${isOwn ? styles.own : styles.other}`}
            >
              <div>
                <div className={`${styles.bubble} ${isOwn ? styles.own : styles.other} ${statusClass}`}>
                  {msg.content}
                </div>
                {msg.status === 'failed' && (
                  <div className={styles.bubbleMeta}>
                    <span>Failed to send</span>
                    <button type="button" className={styles.retryBtn} onClick={() => handleRetry(msg)}>
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.typing}>typing…</div>

      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
        />
        <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
