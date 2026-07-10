import { Link } from 'react-router-dom';

interface NotificationProps {
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    text: 'Your booking at Grand Palace has been confirmed!',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    text: 'New venue "Orchid Garden" is now available in your area.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 3,
    text: 'Welcome to BookMyVenue! Complete your profile to get started.',
    time: '3 days ago',
    read: true,
  },
];

const Notification = ({ onClose }: NotificationProps) => {
  return (
    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-surface shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-1.5 border-b border-border flex justify-between items-center">
        <span className="text-[13px] font-semibold text-foreground">Notifications</span>
        <button className="text-[11px] text-primary hover:underline font-medium cursor-pointer">
          Mark all read
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {mockNotifications.map((notif) => (
          <div
            key={notif.id}
            className={[
              'px-4 py-2.5 hover:bg-muted/30 transition-colors flex flex-col gap-0.5 border-b border-border/40 last:border-0',
              !notif.read ? 'bg-primary/5' : '',
            ].join(' ')}
          >
            <p className="text-[12px] text-foreground font-medium leading-normal">{notif.text}</p>
            <span className="text-[10px] text-foreground/50 font-normal">{notif.time}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pt-1.5 border-t border-border text-center">
        <Link
          to="/notifications"
          className="text-[11px] text-primary hover:underline font-semibold"
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default Notification;
