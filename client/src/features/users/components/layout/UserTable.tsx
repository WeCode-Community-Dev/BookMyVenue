import React from 'react';
import type { User } from '../../types';
import { Users, Trash2, RotateCcw, Eye, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, type Column } from '@/shared/components/ui';

type Props = {
  users: User[];
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  isActionLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const UserAvatar: React.FC<{ imageUrl?: string; name: string }> = ({ imageUrl, name }) => {
  const [imageError, setImageError] = React.useState(false);
  return (
    <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-border bg-background shadow-inner flex items-center justify-center">
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center text-primary">
          <UserIcon className="h-5 w-5 stroke-[1.5]" />
        </div>
      )}
    </div>
  );
};

const UserTable: React.FC<Props> = ({
  users,
  onDelete,
  onRestore,
  isActionLoading = false,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const roleStyles = {
    admin:
      'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/10 dark:text-purple-400',
    owner:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/10 dark:text-blue-400',
    user: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/10 dark:text-emerald-400',
  };

  const roleLabels = {
    admin: 'Admin',
    owner: 'Venue Owner',
    user: 'Customer',
  };

  const formatDate = (dateStr?: string) => {
    return dateStr
      ? new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'N/A';
  };

  const columns: Column<User>[] = [
    {
      header: 'Avatar',
      accessor: (u) => <UserAvatar imageUrl={u.imageUrl || undefined} name={u.name} />,
      className: 'w-20',
    },
    {
      header: 'User',
      accessor: (u) => (
        <div>
          <div className="font-semibold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
            {u.name}
          </div>
          <div className="max-w-xs text-xs text-muted truncate mt-0.5" title={u.email}>
            {u.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (u) => (
        <span
          className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${roleStyles[u.role]}`}
        >
          {roleLabels[u.role]}
        </span>
      ),
      className: 'hidden sm:table-cell',
    },
    {
      header: 'Date Joined',
      accessor: (u) => formatDate(u.createdAt),
      className: 'hidden md:table-cell text-xs font-medium text-muted',
    },
    {
      header: 'Status',
      accessor: (u) =>
        u.isActive ? (
          <span className="inline-flex items-center rounded-lg border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-error/20 bg-error/10 px-2.5 py-1 text-xs font-semibold text-error">
            Inactive
          </span>
        ),
      className: 'w-32',
    },
    {
      header: 'Actions',
      accessor: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/admin/users/${u.id || u._id}`}
            title="View Details"
            className="rounded-lg p-2 text-muted hover:bg-background hover:text-foreground transition-all"
          >
            <Eye size={16} />
          </Link>
          {u.isActive ? (
            <button
              onClick={() => onDelete?.(u.id || u._id || '')}
              disabled={isActionLoading}
              title="Disable User"
              className="rounded-lg p-2 text-muted hover:bg-error/10 hover:text-error transition-all disabled:opacity-40 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={() => onRestore?.(u.id || u._id || '')}
              disabled={isActionLoading}
              title="Restore User"
              className="rounded-lg p-2 text-muted hover:bg-success/10 hover:text-success transition-all disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      ),
      className: 'w-40 text-right',
    },
  ];

  return (
    <Table<User>
      columns={columns}
      data={users}
      pagination={{
        page: currentPage,
        totalPages: totalPages,
        total: 0,
        limit: 10,
      }}
      onPageChange={onPageChange}
      itemName="user"
      emptyState={
        <div className="flex flex-col items-center justify-center py-4 gap-3">
          <div className="rounded-full bg-background border border-border p-4 text-muted">
            <Users size={32} className="stroke-[1.2]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">No Users Found</p>
            <p className="text-xs text-muted mt-1">
              Try adjusting your search criteria or add a new user.
            </p>
          </div>
        </div>
      }
    />
  );
};

export default UserTable;
