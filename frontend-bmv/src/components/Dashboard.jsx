import UserDashboard from './UserDashboard';
import OwnerDashboard from './OwnerDashboard';
import AdminDashboard from './AdminDashboard';

function Dashboard({ user, onLogout }) {
  const userRole = user?.role?.toLowerCase();

  switch (userRole) {
    case 'admin':
      return <AdminDashboard user={user} onLogout={onLogout} />;
    case 'owner':
      return <OwnerDashboard user={user} onLogout={onLogout} />;
    case 'user':
    default:
      return <UserDashboard user={user} onLogout={onLogout} />;
  }
}

export default Dashboard;
