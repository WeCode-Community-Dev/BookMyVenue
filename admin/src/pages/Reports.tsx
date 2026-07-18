import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Search, AlertTriangle, X 
} from 'lucide-react';
import type { ComplaintReport } from '../data/mockStore';

export const ReportsView: React.FC = () => {
  const { 
    reports, resolveReport, rejectReport, 
    blockCustomer, blockVenue 
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<ComplaintReport | null>(null);

  const getFilteredReports = () => {
    let list = reports;
    if (statusFilter !== 'all') {
      list = reports.filter(r => r.status === statusFilter);
    }
    return list.filter(r => {
      const matchesSearch = 
        r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.details.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredReports = getFilteredReports();

  const handleResolve = (id: string) => {
    resolveReport(id);
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport(prev => prev ? { ...prev, status: 'resolved' } : null);
    }
  };

  const handleReject = (id: string) => {
    rejectReport(id);
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
  };

  const handleDisciplinaryBlock = (targetType: 'venue' | 'user' | 'owner', targetId: string) => {
    if (targetType === 'venue') {
      blockVenue(targetId);
      alert(`Disciplinary action executed: Venue ${targetId} has been suspended.`);
    } else if (targetType === 'user') {
      blockCustomer(targetId);
      alert(`Disciplinary action executed: Customer account ${targetId} has been blocked.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="border-b border-slate-900 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dispute Moderation</h1>
        <p className="text-slate-400 mt-1">Review guest complaints, fake listings reports, spam detection, and property damage conflicts.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search reports by reporter name, reason, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-primary rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-xs rounded-lg px-3 py-2 outline-none transition"
          >
            <option value="all">All Disputes</option>
            <option value="pending">Pending Review</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Dismissed / Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports Listing */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-slate-950/20 rounded-xl border border-slate-900 border-dashed">
            No complaints logs match criteria. Good job keeping the platform clean!
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id} 
              className={`glass-panel border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition duration-300 ${
                report.status === 'pending' ? 'border-l-4 border-l-amber-500 border-slate-850' : 'border-slate-900'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-500">{report.id}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    report.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    report.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                    'bg-slate-800 text-slate-400 border border-slate-750'
                  }`}>
                    {report.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-950 border border-slate-900 px-2 py-0.5 rounded">
                    Category: {report.reason}
                  </span>
                </div>

                <div className="text-sm font-semibold text-white">
                  Reported by: <span className="text-slate-300 font-normal">{report.reporterName} ({report.reporterType})</span>
                  <span className="mx-2 text-slate-600">&rarr;</span>
                  Target: <span className="text-rose-400">{report.targetName} ({report.targetType})</span>
                </div>
                
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{report.details}</p>
              </div>

              <div className="flex gap-2 w-full md:w-auto shrink-0 md:justify-end">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 md:flex-none text-xs font-bold px-4.5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                >
                  Inspect Dispute
                </button>

                {report.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReject(report.id)}
                      className="text-xs font-semibold px-3 py-2 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition"
                      title="Dismiss Report"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="text-xs font-bold px-3 py-2 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 transition"
                      title="Resolve Issue"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* DISPUTE INSPECTION DETAILS MODAL */}
      {selectedReport && (
        <div className="modal-overlay">
          <div className="glass-panel border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-6 relative">
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 hover:bg-slate-950 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-900 pb-4">
              <span className="font-mono text-xs font-bold text-slate-500">{selectedReport.id}</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Dispute Case Audit</h2>
              <span className="text-[10px] text-slate-400">Lodged on: {selectedReport.date}</span>
            </div>

            {/* Profiles detail card */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/60 p-4 rounded-lg border border-slate-900">
                <div>
                  <span className="text-slate-500 block uppercase font-semibold text-[8px]">Complainant</span>
                  <span className="text-slate-200 block font-bold text-sm mt-0.5">{selectedReport.reporterName}</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold mt-0.5 block">{selectedReport.reporterType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-semibold text-[8px]">Offender / Target</span>
                  <span className="text-rose-400 block font-bold text-sm mt-0.5">{selectedReport.targetName}</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold mt-0.5 block">{selectedReport.targetType}</span>
                </div>
              </div>

              {/* Dispute statement details */}
              <div className="space-y-2">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Case Reason / Category</span>
                <span className="text-white text-sm font-bold bg-slate-950 border border-slate-900 px-3 py-1 rounded inline-block">
                  {selectedReport.reason}
                </span>

                <span className="text-slate-500 text-[10px] uppercase font-semibold block pt-2">Full Dispute Statement</span>
                <div className="bg-slate-950/30 p-4 rounded-lg border border-slate-900 text-xs text-slate-300 leading-relaxed font-medium">
                  "{selectedReport.details}"
                </div>
              </div>
            </div>

            {/* Compliance disciplinary actions (optional context-based block buttons) */}
            {selectedReport.status === 'pending' && (
              <div className="p-3 bg-red-950/10 border border-red-950/30 rounded-lg text-xs space-y-2">
                <span className="text-red-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Compliance Controls
                </span>
                <p className="text-slate-400">If the claim is verified, you can directly execute an immediate suspension block on the target account/space.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDisciplinaryBlock(selectedReport.targetType, selectedReport.targetId)}
                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded transition"
                  >
                    Block Target {selectedReport.targetType === 'venue' ? 'Space Listing' : 'Profile'}
                  </button>
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex justify-end gap-2 border-t border-slate-900 pt-4">
              {selectedReport.status === 'pending' && (
                <>
                  <button
                    onClick={() => { handleReject(selectedReport.id); setSelectedReport(null); }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-red-400 hover:text-red-300 border border-slate-850 font-bold text-xs rounded-lg transition"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => { handleResolve(selectedReport.id); setSelectedReport(null); }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                  >
                    Mark Resolved
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-semibold text-xs rounded-lg transition"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
