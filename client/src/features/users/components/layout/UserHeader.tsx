const UserHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted">
          Manage system users, administrators, venue owners, and platform roles
        </p>
      </div>
    </div>
  );
};

export default UserHeader;
