import { Search, ArrowUpDown } from 'lucide-react';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: 'asc' | 'desc';
  onSortChange: (value: 'asc' | 'desc') => void;
  filter: 'all' | 'active' | 'inactive';
  onFilterChange: (value: 'all' | 'active' | 'inactive') => void;
  roleFilter: 'all' | 'admin' | 'owner' | 'user';
  onRoleFilterChange: (value: 'all' | 'admin' | 'owner' | 'user') => void;
};

const UserToolbar = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filter,
  onFilterChange,
  roleFilter,
  onRoleFilterChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between transition-colors duration-250">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={18}
          className="text-muted absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            border-border
            bg-background
            py-2.5
            pr-4
            pl-11
            text-sm
            text-foreground
            placeholder:text-muted/80
            outline-none
            transition-all
            focus:border-primary
            focus:ring-2
            focus:ring-primary/10
          "
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter Tabs */}
        <div className="flex rounded-xl bg-background border border-border p-1">
          {(['all', 'active', 'inactive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onFilterChange(tab)}
              className={`
                rounded-lg
                px-4
                py-1.5
                text-xs
                font-semibold
                capitalize
                transition-all
                duration-200
                cursor-pointer
                ${
                  filter === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-foreground'
                }
              `}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>

        {/* Role Filter Selector */}
        <div className="relative min-w-[150px]">
          <select
            value={roleFilter}
            onChange={(e) =>
              onRoleFilterChange(e.target.value as 'all' | 'admin' | 'owner' | 'user')
            }
            className="
              w-full
              appearance-none
              rounded-xl
              border
              border-border
              bg-background
              py-2.5
              pr-10
              pl-4
              text-xs
              font-semibold
              text-foreground
              outline-none
              transition-all
              focus:border-primary
              focus:ring-2
              focus:ring-primary/10
              cursor-pointer
            "
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="owner">Venue Owners</option>
            <option value="user">Customers</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Sort Select */}
        <div className="relative min-w-[175px]">
          <ArrowUpDown
            size={14}
            className="text-muted absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none"
          />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
            className="
              w-full
              appearance-none
              rounded-xl
              border
              border-border
              bg-background
              py-2.5
              pr-10
              pl-4
              text-xs
              font-semibold
              text-foreground
              outline-none
              transition-all
              focus:border-primary
              focus:ring-2
              focus:ring-primary/10
              cursor-pointer
            "
          >
            <option value="desc">Date Registered (Newest)</option>
            <option value="asc">Date Registered (Oldest)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserToolbar;
