import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Mail, Building, Users } from "lucide-react";

export default function Organizers() {
  const { organizers } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrganizers = organizers.filter(
    (o) =>
      o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organizers Directory</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and coordinate with registered event host organizers.
        </p>
      </div>

   
      <div className="flex bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by organizer or agency name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange/20 transition-all outline-none text-sm text-slate-700 font-medium"
          />
        </div>
      </div>

      {filteredOrganizers.length > 0 ? (
        <>
         
          <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Organizer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Verified Host</th>
                  <th className="px-6 py-4 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-sm text-slate-700">
                {filteredOrganizers.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-ticket-orange/15 flex items-center justify-center text-ticket-orange border border-ticket-orange/30 font-bold uppercase">
                        {o.userName.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{o.userName}</span>
                    </td>
                    <td className="px-6 py-4 font-normal text-slate-500">{o.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
                        Yes
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredOrganizers.map((o) => (
              <div
                key={o.id}
                className="bg-white p-5 border border-slate-200/80 rounded-3xl shadow-sm space-y-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ticket-orange/15 flex items-center justify-center text-ticket-orange border border-ticket-orange/30 font-extrabold uppercase">
                    {o.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{o.userName}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 font-medium text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{o.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verified Organizer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">No Organizers Found</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
