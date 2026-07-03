import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Plus, Trash2, Search, RefreshCw, Copy, Check, Sparkles, Database, AlertCircle
} from 'lucide-react';

export const AmenitiesView: React.FC = () => {
  const { 
    amenities, apiState, refreshAmenities, createAmenity, deleteAmenity 
  } = useAdmin();

  // Component local states
  const [searchTerm, setSearchTerm] = useState('');
  const [newAmenityName, setNewAmenityName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Create Submit
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newAmenityName.trim();
    if (!trimmed) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      await createAmenity(trimmed);
      setNewAmenityName('');
      showSuccess(`Amenity "${trimmed}" added successfully!`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create amenity.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Click
  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await deleteAmenity(id);
      showSuccess('Amenity deleted successfully!');
      setDeleteConfirmId(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete amenity.');
    }
  };

  // Copy UUID helper
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Helper function to display success flash briefly
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Filter amenities list
  const filteredAmenities = amenities.filter(amenity => 
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5 font-sans">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <span>Venue Amenities Management</span>
          </h1>
          <p className="text-slate-400 mt-1 text-xs">
            Configure global features, facilities, and tags available for venue property registration details.
          </p>
        </div>

        {/* Database connectivity badge */}
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-900">
          <Database className={`w-4 h-4 ${apiState.amenities.usingMockData ? 'text-amber-500' : 'text-emerald-500'}`} />
          <div className="text-left leading-none">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Database Status</span>
            <span className={`text-xs font-bold ${apiState.amenities.usingMockData ? 'text-amber-400' : 'text-emerald-400'}`}>
              {apiState.amenities.usingMockData ? 'Mock Database (Local Mode)' : 'Live Backend API'}
            </span>
          </div>
        </div>
      </div>

      {/* Action triggers and search filtering */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter amenities by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-primary outline-none transition"
          />
        </div>

        {/* API Reload Action */}
        <button
          onClick={() => {
            setErrorMsg(null);
            refreshAmenities().then(() => showSuccess('Refreshed amenities list.'));
          }}
          disabled={apiState.amenities.loading}
          className="flex items-center gap-2 px-3.5 py-2 border rounded-lg bg-slate-900 border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${apiState.amenities.loading ? 'animate-spin' : ''}`} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Alerts Banners */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
          <Check className="w-5 h-5 flex-shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Main Workspace grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Create Amenity Panel */}
        <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4 h-fit">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <span>Create New Amenity</span>
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold uppercase">Amenity Title</label>
              <input
                type="text"
                placeholder="e.g. Swimming Pool, Valet Parking"
                required
                value={newAmenityName}
                onChange={(e) => setNewAmenityName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:border-primary outline-none transition placeholder-slate-650"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition shadow-md shadow-primary/10 disabled:opacity-50 cursor-pointer animate-none"
            >
              {submitting ? 'Submitting request...' : 'Publish Amenity'}
            </button>
          </form>
        </div>

        {/* Right Side: List & Grid View */}
        <div className="lg:col-span-2 space-y-4">
          
          {apiState.amenities.loading ? (
            // Shimmer skeletons for loading state
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-850 space-y-3 shimmer-surface h-[84px]" />
              ))}
            </div>
          ) : filteredAmenities.length > 0 ? (
            
            // Amenities active lists
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAmenities.map(amenity => (
                <div 
                  key={amenity.id} 
                  className="glass-panel border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4 group transition hover:border-slate-800"
                >
                  
                  {/* Amenity Info */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <span className="font-bold text-white text-xs block truncate">{amenity.name}</span>
                    
                    {/* Copyable UUID badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-500 font-mono select-all truncate max-w-[170px]" title={amenity.id}>
                        {amenity.id}
                      </span>
                      <button 
                        onClick={() => handleCopyId(amenity.id)}
                        className="text-slate-500 hover:text-white transition cursor-pointer"
                        title="Copy UUID to clipboard"
                      >
                        {copiedId === amenity.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Amenity Actions */}
                  <div className="flex-shrink-0">
                    {deleteConfirmId === amenity.id ? (
                      // Confirmation buttons on delete attempt
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(amenity.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-2 py-1.5 rounded transition cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-bold px-2 py-1.5 rounded transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      // Standard trash action trigger
                      <button
                        onClick={() => setDeleteConfirmId(amenity.id)}
                        className="p-2 rounded hover:bg-red-950/40 text-slate-500 hover:text-red-400 transition cursor-pointer"
                        title="Delete Amenity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            
            // Empty listings state
            <div className="glass-panel border border-slate-850 p-12 text-center rounded-xl space-y-3">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="font-bold text-white text-sm">No Amenities Available</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                No features are listed in the platform database yet. Use the creation panel to publish your first venue amenity.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
