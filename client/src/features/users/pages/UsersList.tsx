import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import UserHeader from '../components/layout/UserHeader';
import UserTable from '../components/layout/UserTable';
import UserToolbar from '../components/layout/UserToolbar';
import { usersApi } from '../services/users.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import type { User } from '../types';
import { Loading } from '@/shared/components/ui';
import { toast } from 'sonner';
import { Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/useDebounce';

const UsersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state parameters from URL search params
  const searchParam = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sort') || 'desc') as 'asc' | 'desc';
  const filter = (searchParams.get('status') || 'all') as 'all' | 'active' | 'inactive';
  const roleFilter = (searchParams.get('role') || 'all') as 'all' | 'admin' | 'owner' | 'user';
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('limit')) || 5;

  // Local state for the input field to keep typing responsive
  const [search, setSearch] = useState(searchParam);

  // useAsyncFetch hooks
  const {
    data: listResponse,
    loading,
    execute: fetchUsers,
  } = useAsyncFetch<{
    success: boolean;
    message: string;
    data: {
      users: User[];
      totalUsers: number;
    };
  }>();

  const { loading: actionLoading, execute: executeAction } = useAsyncFetch<{
    success: boolean;
    message: string;
    data: User;
  }>();

  // Extract users and pagination metadata
  const users = useMemo(() => listResponse?.data?.users || [], [listResponse]);
  const totalUsers = listResponse?.data?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Helper function to update search parameters in the URL
  const updateParams = (updates: Record<string, string | number | undefined>) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === '') {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
        });
        return newParams;
      },
      { replace: true }
    );
  };

  // Debounce search input changes before writing to URL
  const debouncedSearch = useDebounce(search, 400);

  // Sync debounced search to URL (and reset page to 1)
  useEffect(() => {
    updateParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch]);

  // Sync local input with searchParam (e.g. if the user navigates back/forward)
  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  // Fetch Users function using current query parameters
  const loadUsers = useCallback(() => {
    fetchUsers(() =>
      usersApi.getAll({
        search: searchParam,
        sort: sortBy,
        status: filter,
        role: roleFilter,
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [fetchUsers, searchParam, sortBy, filter, roleFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Delete User (Soft Delete)
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to disable this user account?')) return;

    try {
      await executeAction(() => usersApi.remove(id));
      toast.success('User disabled successfully');
      loadUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to disable user';
      toast.error(msg);
    }
  };

  // Restore User
  const handleRestore = async (id: string) => {
    try {
      await executeAction(() => usersApi.restore(id));
      toast.success('User restored successfully');
      loadUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to restore user';
      toast.error(msg);
    }
  };

  // Statistics Calculation
  const stats = useMemo(() => {
    return {
      total: totalUsers,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
    };
  }, [users, totalUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <UserHeader />

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Total Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Users size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.total}
            </p>
          </div>
        </div>

        {/* Active Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <CheckCircle2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Active Accounts
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.active}
            </p>
          </div>
        </div>

        {/* Inactive Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-error/10 p-3 text-error">
            <AlertTriangle size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Disabled Accounts
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.inactive}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <UserToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={(value) => updateParams({ sort: value, page: 1 })}
        filter={filter}
        onFilterChange={(value) => updateParams({ status: value, page: 1 })}
        roleFilter={roleFilter}
        onRoleFilterChange={(value) => updateParams({ role: value, page: 1 })}
      />

      {/* Content Area */}
      {loading ? (
        <Loading />
      ) : (
        <UserTable
          users={users}
          onDelete={handleDelete}
          onRestore={handleRestore}
          isActionLoading={actionLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => updateParams({ page })}
        />
      )}
    </div>
  );
};

export default UsersList;
