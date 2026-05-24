import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Plus, Trash2, Tag, ToggleLeft, ToggleRight
} from 'lucide-react';
export const CMSView: React.FC = () => {
  const { 
    banners, promotions, addBanner, toggleBannerActive, deleteBanner,
    addPromotion, togglePromotionActive, deletePromotion
  } = useAdmin();

  // Tab switch
  const [activeCmsTab, setActiveCmsTab] = useState<'banners' | 'promotions'>('banners');

  // Form states
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [promoExpiry, setPromoExpiry] = useState('');

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerUrl.trim() || !bannerLink.trim()) return;

    addBanner({
      title: bannerTitle,
      imageUrl: bannerUrl,
      link: bannerLink,
      active: true
    });

    setBannerTitle('');
    setBannerUrl('');
    setBannerLink('');
    alert('Marketing banner created successfully!');
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim() || !promoDiscount.trim() || !promoExpiry.trim()) return;

    addPromotion({
      code: promoCode.trim().toUpperCase(),
      discountPercentage: Number(promoDiscount),
      expiryDate: promoExpiry,
      active: true
    });

    setPromoCode('');
    setPromoDiscount('');
    setPromoExpiry('');
    alert('Promo discount code published successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Content Management (CMS)</h1>
          <p className="text-slate-400 mt-1">Manage marketing slider banners, homepage highlights, and operational coupon promotional codes.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-900">
          <button
            onClick={() => setActiveCmsTab('banners')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              activeCmsTab === 'banners' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Promotional Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveCmsTab('promotions')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              activeCmsTab === 'promotions' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Discount Coupons ({promotions.length})
          </button>
        </div>
      </div>

      {activeCmsTab === 'banners' ? (
        /* CMS BANNERS WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Banner Form */}
          <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4 h-fit">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-primary" />
              <span>Publish Promo Slider Banner</span>
            </h3>

            <form onSubmit={handleAddBanner} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Banner Header Title</label>
                <input
                  type="text"
                  placeholder="e.g. Wedding Season 15% discount..."
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Slide Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  required
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Action Navigation Link</label>
                <input
                  type="text"
                  placeholder="e.g. /offers/wedding-monsoon"
                  required
                  value={bannerLink}
                  onChange={(e) => setBannerLink(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition"
              >
                Publish Live Banner
              </button>
            </form>
          </div>

          {/* Active Banners Grid */}
          <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4 lg:col-span-2">
            <h3 className="font-bold text-white text-base">Active Marketing Banners</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map(banner => (
                <div key={banner.id} className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden flex flex-col justify-between group relative">
                  
                  {/* Aspect ratio frame */}
                  <div className="h-32 overflow-hidden relative bg-slate-950">
                    <img src={banner.imageUrl} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-3">
                      <span className="text-white text-xs font-bold leading-snug line-clamp-2">{banner.title}</span>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">{banner.link}</span>
                    </div>
                  </div>

                  <div className="p-3 flex justify-between items-center bg-slate-950/80">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{banner.id}</span>
                    
                    <div className="flex items-center gap-2">
                      {/* Active toggle button */}
                      <button
                        onClick={() => toggleBannerActive(banner.id)}
                        className={`text-slate-400 hover:text-white transition`}
                        title={banner.active ? 'Disable Banner' : 'Enable Banner'}
                      >
                        {banner.active ? (
                          <ToggleRight className="w-6 h-6 text-primary" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-600" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="p-1.5 rounded hover:bg-red-950 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* CMS PROMOTIONS WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Promotion Form */}
          <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4 h-fit">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-primary" />
              <span>Create Coupon Code</span>
            </h3>

            <form onSubmit={handleAddPromo} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE20"
                  required
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g. 15"
                  required
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={promoExpiry}
                  onChange={(e) => setPromoExpiry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition"
              >
                Create Promo Code
              </button>
            </form>
          </div>

          {/* Active Promotions Ledger */}
          <div className="glass-panel border border-slate-850 p-5 rounded-xl space-y-4 lg:col-span-2">
            <h3 className="font-bold text-white text-base">Active Discounts & Coupons</h3>

            <div className="overflow-x-auto border border-slate-900 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Discount Percent</th>
                    <th className="p-3">Expiration Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {promotions.map(promo => (
                    <tr key={promo.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-3 font-mono font-bold text-white tracking-wider flex items-center gap-1.5 mt-1.5">
                        <Tag className="w-3.5 h-3.5 text-primary" />
                        {promo.code}
                      </td>
                      <td className="p-3 font-bold text-emerald-400">{promo.discountPercentage}% OFF</td>
                      <td className="p-3 text-slate-400 font-mono">{promo.expiryDate}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          promo.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {promo.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => togglePromotionActive(promo.id)}
                          className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition"
                        >
                          {promo.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deletePromotion(promo.id)}
                          className="p-1 rounded hover:bg-red-950 text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
