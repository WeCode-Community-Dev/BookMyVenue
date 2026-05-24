import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Settings as SettingsIcon, DollarSign, Clock, ShieldCheck, 
  Mail, Phone, Save, Info, RefreshCw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  
  // Local state for form submission
  const [commission, setCommission] = useState(settings.commissionPercentage.toString());
  const [cancellationDays, setCancellationDays] = useState(settings.cancellationPolicyDays.toString());
  const [taxPercent, setTaxPercent] = useState(settings.taxSettingsPercentage.toString());
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      updateSettings({
        commissionPercentage: Number(commission),
        cancellationPolicyDays: Number(cancellationDays),
        taxSettingsPercentage: Number(taxPercent),
        supportEmail,
        supportPhone
      });
      setSaving(false);
      alert('Platform configurations updated successfully! Splitting metrics have been recalculated.');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="border-b border-slate-900 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Platform Settings</h1>
        <p className="text-slate-400 mt-1">Configure global transaction variables, service tax rules, and customer cancellation timelines.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Financial Configurations */}
        <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4 lg:col-span-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <SettingsIcon className="w-4.5 h-4.5 text-primary" />
            <span>Platform Variables</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Commission Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>Base Platform Commission (%)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 pl-4 pr-10 text-sm text-white focus:border-primary outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-sm text-slate-500 font-bold">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Fee charged per successful venue booking. Splitting logic updates instantly upon save.</p>
            </div>

            {/* Tax Settings */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Service GST Tax Percentage (%)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 pl-4 pr-10 text-sm text-white focus:border-primary outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-sm text-slate-500 font-bold">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Government service tax appended to user invoice payments.</p>
            </div>

            {/* Cancellation Timelines */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Cancellation Grace Timeline</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  required
                  value={cancellationDays}
                  onChange={(e) => setCancellationDays(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 pl-4 pr-14 text-sm text-white focus:border-primary outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">Days</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Minimum days prior to event start for a customer to request a 100% refund.</p>
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-6 border-t border-slate-900">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Configurations
                </>
              )}
            </button>
          </div>
        </div>

        {/* Support & Operations Helpdesk */}
        <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Mail className="w-4.5 h-4.5 text-accent" />
            <span>Support & Helpdesk</span>
          </h3>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Support Email Address</span>
              </label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Support Contact Number</span>
              </label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-lg p-3.5 border border-slate-900 text-xs text-slate-400 flex items-start gap-2 mt-4">
            <Info className="w-4.5 h-4.5 mt-0.5 text-accent shrink-0" />
            <p>These support channels are automatically rendered on booking invoices, PDF templates, and user-facing mobile apps for customer disputes.</p>
          </div>
        </div>

      </form>
    </div>
  );
};
