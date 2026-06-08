import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateVenue, uploadImage, fetchVenueById } from '../services/venueApi';

const EditVenuePage = ({ showToast, loadVenues }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [venue, setVenue] = useState(location.state?.venue || null);

  const [formData, setFormData] = useState({ 
    name: '', 
    location: '', 
    capacity: '', 
    price_per_hour: '', 
    photo_urls: [''], 
    inventory_type: 'capacity_based', 
    features: {},
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setUploading(true);
    setError('');
    
    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.url);
      
      setFormData(prev => ({
        ...prev,
        photo_urls: [...prev.photo_urls.filter(u => u !== ''), ...newUrls]
      }));
    } catch (err) {
      setError(err.message || 'Failed to upload one or more images');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const removePhoto = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      photo_urls: prev.photo_urls.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  useEffect(() => {
    if (!venue && id) {
      fetchVenueById(id).then(setVenue).catch(err => setError('Failed to load venue'));
    } else if (venue) {
      // Normalize old features to new format
      const oldFeatures = venue.features || {};
      const newFeatures = { ...oldFeatures };
      if (oldFeatures.wifi) newFeatures['WiFi'] = true;
      if (oldFeatures.ac) newFeatures['Air Conditioning'] = true;
      if (oldFeatures.parking) newFeatures['Parking'] = true;
      delete newFeatures.wifi;
      delete newFeatures.ac;
      delete newFeatures.parking;

      setFormData({
        name: venue.name || '',
        location: venue.location || '',
        capacity: venue.capacity ? venue.capacity.toString() : '',
        price_per_hour: venue.price_per_hour ? venue.price_per_hour.toString() : '',
        photo_urls: venue.photos && venue.photos.length > 0 ? venue.photos : [''],
        inventory_type: venue.inventory_type || 'capacity_based',
        features: newFeatures,
        latitude: venue.latitude || '',
        longitude: venue.longitude || ''
      });
    }
  }, [venue, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateVenue(venue.id, {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
        price_per_hour: formData.price_per_hour ? parseFloat(formData.price_per_hour) : null,
        photos: formData.photo_urls.filter(url => url.trim() !== ''),
      });
      showToast('Venue updated successfully!');
      loadVenues();
      navigate(-1);
    } catch (err) {
      setError(err.message || 'Failed to update venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden animate-[slide-up_0.3s_ease-out] border border-slate-800">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-100">Edit Venue</h2>
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800/50 text-red-400 rounded-lg text-sm flex items-start">
              <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Venue Name</label>
              <input 
                type="text" required
                className="input-field"
                placeholder="e.g. Grand Plaza"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <input 
                type="text" required
                className="input-field"
                placeholder="e.g. Downtown, NY"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Latitude</label>
                <input 
                  type="number" step="any"
                  className="input-field"
                  placeholder="e.g. 40.7128"
                  value={formData.latitude || ''}
                  onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value) || null})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Longitude</label>
                <input 
                  type="number" step="any"
                  className="input-field"
                  placeholder="e.g. -74.0060"
                  value={formData.longitude || ''}
                  onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value) || null})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Images</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.photo_urls.filter(url => url.trim() !== '').map((url, idx) => (
                  <div key={idx} className="relative group w-20 h-20 rounded-md overflow-hidden border border-slate-800">
                    <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute inset-0 bg-red-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative">
                <input 
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border file:border-indigo-800/50
                    file:text-sm file:font-semibold
                    file:bg-indigo-900/30 file:text-indigo-400
                    hover:file:bg-indigo-800/50 disabled:opacity-50
                    cursor-pointer"
                />
                {uploading && <div className="mt-2 text-sm text-indigo-400 animate-pulse">Uploading images...</div>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Capacity</label>
                <input 
                  type="number" required min="1"
                  className="input-field"
                  placeholder="e.g. 500"
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Price / Hour</label>
                <input 
                  type="number" step="0.01" min="0"
                  className="input-field"
                  placeholder="e.g. 150.00"
                  value={formData.price_per_hour}
                  onChange={e => setFormData({...formData, price_per_hour: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Inventory Type</label>
              <select 
                className="input-field"
                value={formData.inventory_type}
                onChange={e => setFormData({...formData, inventory_type: e.target.value})}
              >
                <option value="capacity_based">Capacity Based (e.g. Cafe, Studio)</option>
                <option value="entire_venue">Entire Venue (Exclusive Booking)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Features</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  'WiFi', 'Projector', 'Whiteboard', 'Parking', 
                  'Air Conditioning', 'Catering', 'Wheelchair Accessible', 'Audio System'
                ].map(feature => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-500 focus:ring-indigo-500 bg-slate-950 border-slate-700" 
                      checked={!!formData.features[feature]} 
                      onChange={e => setFormData({
                        ...formData, 
                        features: {
                          ...formData.features, 
                          [feature]: e.target.checked
                        }
                      })} 
                    />
                    <span className="text-sm text-slate-400">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-slate-800">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[120px]">
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenuePage;
