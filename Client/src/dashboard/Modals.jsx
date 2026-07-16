import React, { useState } from 'react';
import { X, Send, Play, Sparkles, CheckCircle2 } from 'lucide-react';

export function NewCampaignModal({ isOpen, onClose, onAddCampaign }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Active');
  const [sent, setSent] = useState('');
  const [opens, setOpens] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !sent || !opens) {
      setError('Please fill in all fields.');
      return;
    }
    const sentNum = parseInt(sent);
    const opensNum = parseInt(opens);
    if (isNaN(sentNum) || isNaN(opensNum) || sentNum < 0 || opensNum < 0) {
      setError('Sent and Opens must be non-negative numbers.');
      return;
    }
    if (opensNum > sentNum) {
      setError('Opens cannot exceed Sent count.');
      return;
    }

    onAddCampaign({
      id: Date.now().toString(),
      name,
      status,
      sent: sentNum,
      opens: opensNum,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    setSuccess(true);
    setError('');
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setSent('');
      setOpens('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative bg-white border border-slate-200 max-w-md w-full rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-ticket-yellow to-ticket-orange"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center text-center py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-250 flex items-center justify-center mb-4 animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Campaign Created!</h3>
            <p className="text-slate-500 text-sm">Your new campaign has been successfully added.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Send className="w-5 h-5 text-ticket-orange" /> New Campaign
              </h2>
              <p className="text-slate-500 text-xs mt-1">Configure your email or marketing launch.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-650 border border-red-200/60 p-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Summer Special Launch"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-4 text-slate-800 text-sm font-medium outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sent Contacts</label>
                  <input 
                    type="number" 
                    value={sent} 
                    onChange={(e) => setSent(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-4 text-slate-800 text-sm font-medium outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Opens Count</label>
                  <input 
                    type="number" 
                    value={opens} 
                    onChange={(e) => setOpens(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-4 text-slate-800 text-sm font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-4 text-slate-800 text-sm font-medium outline-none transition-all cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
              >
                Launch Campaign
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function CreateAutomationModal({ isOpen, onClose, onAddAutomation }) {
  const [name, setName] = useState('');
  const [triggerCount, setTriggerCount] = useState('');
  const [completedCount, setCompletedCount] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !triggerCount || !completedCount || !conversionRate) {
      setError('Please fill in all fields.');
      return;
    }
    const trig = parseInt(triggerCount);
    const comp = parseInt(completedCount);
    const conv = parseFloat(conversionRate);

    if (isNaN(trig) || isNaN(comp) || isNaN(conv) || trig < 0 || comp < 0 || conv < 0) {
      setError('Fields must be valid non-negative numbers.');
      return;
    }
    if (comp > trig) {
      setError('Completed count cannot exceed Triggered count.');
      return;
    }
    if (conv > 100) {
      setError('Conversion rate cannot exceed 100%.');
      return;
    }

    onAddAutomation({
      id: Date.now().toString(),
      name,
      rate: conv,
      triggered: trig,
      completed: comp
    });

    setSuccess(true);
    setError('');
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setTriggerCount('');
      setCompletedCount('');
      setConversionRate('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative bg-white border border-slate-200 max-w-md w-full rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-ticket-yellow to-ticket-orange"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center text-center py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-250 flex items-center justify-center mb-4 animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Automation Created!</h3>
            <p className="text-slate-500 text-sm">Your new automation has been successfully deployed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Play className="w-5 h-5 text-ticket-orange" /> Create Automation
              </h2>
              <p className="text-slate-500 text-xs mt-1">Design triggers and automated email flows.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-650 border border-red-200/60 p-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Automation Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Post-purchase Re-engagement"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-4 text-slate-800 text-sm font-medium outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Triggered Count</label>
                  <input 
                    type="number" 
                    value={triggerCount} 
                    onChange={(e) => setTriggerCount(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-4 text-slate-800 text-sm font-medium outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Completed Count</label>
                  <input 
                    type="number" 
                    value={completedCount} 
                    onChange={(e) => setCompletedCount(e.target.value)}
                    placeholder="e.g. 180"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-4 text-slate-800 text-sm font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Conversion Rate (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    value={conversionRate} 
                    onChange={(e) => setConversionRate(e.target.value)}
                    placeholder="e.g. 85.5"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-4 text-slate-800 text-sm font-medium outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
              >
                Deploy Flow
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
