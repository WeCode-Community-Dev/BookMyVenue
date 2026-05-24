import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Bell, Send, ShieldAlert, Calendar, CheckCircle
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, sendNotification } = useAdmin();
  
  // Local state for sending notifications
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState<'all' | 'owners' | 'customers'>('all');
  const [category, setCategory] = useState<'broadcast' | 'booking' | 'approval' | 'report'>('broadcast');

  const [broadcasting, setBroadcasting] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setBroadcasting(true);
    setTimeout(() => {
      sendNotification(title, message, targetGroup, category);
      
      // Clear form
      setTitle('');
      setMessage('');
      setBroadcasting(false);
      alert(`System broadcast "${title}" sent successfully to ${targetGroup === 'all' ? 'All Users' : targetGroup === 'owners' ? 'Venue Owners' : 'Customers'}!`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="border-b border-slate-900 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">System Notifications</h1>
        <p className="text-slate-400 mt-1">Broadcast system announcements, send target push alerts, or audit automated transactional logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Broadcast Form */}
        <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4 lg:col-span-1 h-fit">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-primary" />
            <span>Create System Broadcast</span>
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4 pt-2">
            
            {/* Target Audience */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase">Target Audience Group</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-sm rounded-lg p-2.5 outline-none transition"
              >
                <option value="all">Broadcast to All Users</option>
                <option value="owners">Target Venue Owners Only</option>
                <option value="customers">Target Customers Only</option>
              </select>
            </div>

            {/* Notification Category */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase">Alert Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-sm rounded-lg p-2.5 outline-none transition"
              >
                <option value="broadcast">Announcement / System Notice</option>
                <option value="booking">Booking transaction alert</option>
                <option value="approval">Listing Audit / KYC update</option>
                <option value="report">Security Warnings / Dispute actions</option>
              </select>
            </div>

            {/* Announcement Title */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase">Notification Title</label>
              <input
                type="text"
                placeholder="Monsoon weddings discount announced..."
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
              />
            </div>

            {/* Announcement Body */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase">Message Body</label>
              <textarea
                placeholder="Enter details of push alert. Make it catchy and brief..."
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
              />
            </div>

            {/* Action Submit */}
            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{broadcasting ? 'Sending Broadcast...' : 'Publish Announcement'}</span>
            </button>
          </form>
        </div>

        {/* History Notification feed */}
        <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4 lg:col-span-2">
          <h3 className="font-bold text-white text-base">Historical System Alerts Logs</h3>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-12 text-center bg-slate-950/20 rounded-lg border border-slate-900 border-dashed">No history alert records found.</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="p-4 bg-slate-950/50 border border-slate-900 hover:border-slate-800 rounded-xl transition duration-200 flex gap-3.5 items-start">
                  
                  {/* Categorized icon container */}
                  <div className={`p-2.5 rounded-lg border shrink-0 ${
                    notif.type === 'broadcast' ? 'bg-primary/10 border-primary/20 text-primary' :
                    notif.type === 'booking' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    notif.type === 'approval' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {notif.type === 'broadcast' && <Bell className="w-4 h-4" />}
                    {notif.type === 'booking' && <Calendar className="w-4 h-4" />}
                    {notif.type === 'approval' && <CheckCircle className="w-4 h-4" />}
                    {notif.type === 'report' && <ShieldAlert className="w-4 h-4" />}
                  </div>

                  {/* Body text details */}
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 className="text-sm font-bold text-white leading-tight">{notif.title}</h4>
                      <span className="text-[9px] text-slate-500 font-mono">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{notif.message}</p>
                    
                    <div className="flex gap-2 items-center text-[10px] text-slate-500 pt-1 font-semibold">
                      <span>Audience: <span className="text-slate-400 uppercase">{notif.sentTo}</span></span>
                      <span>•</span>
                      <span>Alert Type: <span className="text-slate-400 uppercase">{notif.type}</span></span>
                      <span>•</span>
                      <span className="font-mono text-slate-500 font-bold">{notif.id}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
