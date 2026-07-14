import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFindOrCreateConversationMutation } from '../api/conversationApi';
import { isChatEnabled } from '../config/featureFlags';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { setActiveConversation, clearUnread } from '../redux/slices/chatSlice';

export function useStartConversation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [findOrCreateConversation, { isLoading }] = useFindOrCreateConversationMutation();

  const startConversation = async ({ ownerId, userId }) => {
    if (!isChatEnabled) {
      throw new Error('Chat feature is disabled');
    }

    const body =      currentUser?.role === 'owner' ? { userId } : { ownerId };

    const conversation = await findOrCreateConversation(body).unwrap();
    dispatch(setActiveConversation(conversation.id));
    dispatch(clearUnread(conversation.id));
    navigate('/messages');
    return conversation;
  };

  return { startConversation, isLoading };
}
