"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileForm() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [dob, setDob] = useState(user.dob);
  const [gender, setGender] = useState(user.gender);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [state, setState] = useState(user.state);
  const [country, setCountry] = useState(user.country);
  const [bio, setBio] = useState(user.bio);
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const toggleEdit = (field: string) => setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({ name, phone, dob, gender, address, city, state, country, bio });
      setEditStates({});
      alert("Profile changes saved successfully.");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const formFields = [
    { label: "Full Name", value: name, setter: setName, key: "name", type: "text" },
    { label: "Phone Number", value: phone, setter: setPhone, key: "phone", type: "tel" },
    { label: "Date of Birth", value: dob, setter: setDob, key: "dob", type: "date" },
    { label: "Gender", value: gender, setter: setGender, key: "gender", type: "text" },
    { label: "Address", value: address, setter: setAddress, key: "address", type: "text" },
    { label: "City", value: city, setter: setCity, key: "city", type: "text" },
    { label: "State", value: state, setter: setState, key: "state", type: "text" },
    { label: "Country", value: country, setter: setCountry, key: "country", type: "text" },
  ];

  return (
    <div className="bg-white border border-slate-200/60 shadow-xs rounded-3xl p-6 sm:p-8 space-y-6 text-left">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight select-none">Personal Details</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Email</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{user.email || "Not available"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {formFields.map((field) => {
            const isEditing = !!editStates[field.key];
            return (
              <div key={field.key} className="space-y-1.5 pb-3 border-b border-slate-100/70 md:pb-4 md:border-b-0">
                <div className="flex items-center justify-between select-none">
                  <label htmlFor={field.key} className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{field.label}</label>
                  <button type="button" onClick={() => toggleEdit(field.key)} className="text-xs font-bold text-rose-600 hover:text-rose-700 transition border-0 bg-transparent cursor-pointer">
                    {isEditing ? "Collapse" : "Edit"}
                  </button>
                </div>
                {isEditing ? (
                  <Input id={field.key} type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} />
                ) : (
                  <p className="text-sm font-semibold text-slate-700 h-10 flex items-center">{field.value || <span className="text-slate-400 font-medium italic">Not Specified</span>}</p>
                )}
              </div>
            );
          })}
          <div className="space-y-1.5 md:col-span-2 pb-3 border-b border-slate-100/70 md:pb-0 md:border-b-0">
            <div className="flex items-center justify-between select-none">
              <label htmlFor="bio" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Biography</label>
              <button type="button" onClick={() => toggleEdit("bio")} className="text-xs font-bold text-rose-600 hover:text-rose-700 transition border-0 bg-transparent cursor-pointer">
                {editStates.bio ? "Collapse" : "Edit"}
              </button>
            </div>
            {editStates.bio ? (
              <textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="flex w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-150 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 min-h-[80px]" />
            ) : (
              <p className="text-sm font-semibold text-slate-600 leading-relaxed py-2">{bio || <span className="text-slate-400 font-medium italic">No Bio Written Yet</span>}</p>
            )}
          </div>
        </div>
        <div className="pt-4 select-none border-t border-slate-100">
          <Button type="submit" disabled={isSaving} className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-8 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none disabled:opacity-50">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}



