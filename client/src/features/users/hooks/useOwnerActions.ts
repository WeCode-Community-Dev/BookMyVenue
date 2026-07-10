import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { usersApi } from '../services/users.api';

export function useOwnerActions() {
  const { loading, execute } = useAsyncFetch();

  const approveOwner = async (id: string) => {
    return execute(() => usersApi.approveOwner(id));
  };

  const rejectOwner = async (id: string, reason: string) => {
    return execute(() => usersApi.rejectOwner(id, reason));
  };

  return {
    loading,
    approveOwner,
    rejectOwner,
  };
}
