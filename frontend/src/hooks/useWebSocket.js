import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../redux/slices/authSlice';
import { isChatEnabled } from '../config/featureFlags';
import {
  addMessage,
  incrementUnread,
  selectActiveConversationId,
} from '../redux/slices/chatSlice';

const WS_BASE =
  import.meta.env.VITE_API_URL?.replace(/^http/, 'ws') || 'ws://localhost:5005';

const MAX_BACKOFF_MS = 30000;

let wsInstance = null;
let reconnectTimer = null;
let reconnectAttempt = 0;
let connectFn = null;

export function sendMessage(conversationId, content, venueId) {
  if (!isChatEnabled) return false;
  if (!wsInstance || wsInstance.readyState !== 1) {
    return false;
  }

  wsInstance.send(
    JSON.stringify({
      type: 'SEND_MESSAGE',
      payload: { conversationId, content, venueId: venueId || undefined },
    })
  );
  return true;
}

export function useWebSocket() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const activeConversationId = useSelector(selectActiveConversationId);
  const activeConversationIdRef = useRef(activeConversationId);
  const currentUserIdRef = useRef(currentUser?.id);
  const dispatchRef = useRef(dispatch);

  activeConversationIdRef.current = activeConversationId;
  currentUserIdRef.current = currentUser?.id;
  dispatchRef.current = dispatch;

  const cleanup = useCallback(() => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    reconnectAttempt = 0;
    if (wsInstance) {
      wsInstance.onopen = null;
      wsInstance.onmessage = null;
      wsInstance.onclose = null;
      wsInstance.onerror = null;
      wsInstance.close();
      wsInstance = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!isChatEnabled || !isAuthenticated || wsInstance?.readyState === 1 || wsInstance?.readyState === 0) {
      return;
    }

    const ws = new WebSocket(WS_BASE);
    wsInstance = ws;

    ws.onopen = () => {
      reconnectAttempt = 0;
    };

    ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);

        if (type === 'NEW_MESSAGE') {
          dispatchRef.current(addMessage(payload));

          const isActive =
            payload.conversationId === activeConversationIdRef.current;
          const isOwnMessage = payload.senderId === currentUserIdRef.current;

          if (!isActive && !isOwnMessage) {
            dispatchRef.current(incrementUnread(payload.conversationId));
          }
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    ws.onclose = () => {
      wsInstance = null;
      if (!connectFn) return;

      const delay = Math.min(1000 * 2 ** reconnectAttempt, MAX_BACKOFF_MS);
      reconnectAttempt += 1;
      reconnectTimer = setTimeout(() => connectFn(), delay);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error', err);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    connectFn = connect;
    return () => {
      connectFn = null;
    };
  }, [connect]);

  useEffect(() => {
    if (!isChatEnabled) {
      cleanup();
      return;
    }

    if (isAuthenticated) {
      connect();
    } else {
      cleanup();
    }

    return cleanup;
  }, [isAuthenticated, connect, cleanup]);

  return { sendMessage };
}
