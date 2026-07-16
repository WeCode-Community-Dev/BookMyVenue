import React, { useState, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  FileImage,
  Clock,
  Send,
  Eye,
  Star,
  Calendar,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function VenueAddModal({ onClose, onSubmit, orgId, error, isLoading }) {
  const [formData, setFormData] = useState({
    organiZerId: orgId,
    name: "",
    place: "",
    type: "",
    rating: "0",
    price: "",
    capacity: "",
    description: "",
    image: null,
    isApproved: "no",
    spec: [{ spec: "" }],
    // Added date to initial state
    slots: [{ date: "", startTime: "", endTime: "" }],
  });
  const [image, setImage] = useState("");

  // console.log("f..",formData);
  

  
  const fileInputRef = useRef(null);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({ ...formData, image: URL.createObjectURL(file) });
      setFormData({ ...formData, image: file });
    }
  };

  // Dynamic Lists (Specs/Slots)
  const updateList = (listName, index, field, value) => {
    const newList = [...formData[listName]];
    if (field) newList[index][field] = value;
    else newList[index] = { ...newList[index], spec: value };
    setFormData({ ...formData, [listName]: newList });
  };

  const addRow = (listName, template) => {
    setFormData({ ...formData, [listName]: [...formData[listName], template] });
  };

  const removeRow = (listName, index) => {
    setFormData({
      ...formData,
      [listName]: formData[listName].filter((_, i) => i !== index),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8 
    animate-fade-in-up"
    >
      <div className="relative flex flex-col md:flex-row gap-8 w-full max-w-6xl max-h-[90vh]">
        <div
          className="flex-1 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-y-auto relative
         p-8 md:p-12 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent animate-fade-in-up"
        >
          <div className="absolute top-6 right-8 flex  items-center gap-3">
            <h1 className="text-ticket-orange text-xs">
              + Add image <span className="text-red-700 text-lg">*</span>
            </h1>

            <button
              onClick={() => fileInputRef.current.click()}
              className="w-12 h-12 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center
               text-ticket-orange transition-all hover:scale-105"
            >
              <FileImage size={24} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <div className="flex justify-between items-start mt-4 mb-10 pr-16">
            <div className="text-xs font-medium text-gray-400">
              ID: <span className="text-gray-300">{orgId}</span>
            </div>
            <div className="text-right flex-1 ml-4">
              <input
                className="text-4xl font-bold text-gray-800 outline-none placeholder:text-gray-300 w-full text-right"
                placeholder="Venue Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {image.image && (
            <div className="mb-8 w-full h-48 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              <img
                src={image.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {error && (
            <div className="w-full p-3 bg-red-500 rounded-md mb-2 text-center text-white font-medium">
              <h1>{error}</h1>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Location Detail <span className="text-red-700 text-lg">*</span>
              </label>
              <input
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="Address or Area"
                className="w-full bg-gray-50 border-none rounded-md p-3 text-sm focus:ring-1 focus:ring-ticket-orange 
                outline-none transition-all"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief venue description..."
                className="w-full bg-gray-50 border-none rounded-md p-3 mt-2 text-sm h-24 resize-none outline-none 
                focus:ring-1 focus:ring-ticket-orange  transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Venue Category <span className="text-red-700 text-lg">*</span>
              </label>
              <input
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Banquet, Garden, etc."
                className="w-full bg-gray-50 border-none rounded-md p-3 text-sm outline-none focus:ring-1
                 focus:ring-ticket-orange  transition-all"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Capacity"
                  className="bg-gray-50 border-none rounded-md p-3 text-sm outline-none focus:ring-1
                   focus:ring-ticket-orange  transition-all"
                />
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="bg-gray-50 border-none rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-ticket-orange 
                   transition-all"
                />
              </div>
            </div>
          </div>

          <div
            className="border-b border-gray-100 pb-2 mb-4 grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase 
          tracking-widest"
          >
            <div className="col-span-11">
              Specifications & Features{" "}
              <span className="text-red-700 text-lg">*</span>
            </div>
          </div>

          <div className="space-y-3 mb-10">
            {formData.spec.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="flex-1">
                  <input
                    value={item.spec}
                    onChange={(e) =>
                      updateList("spec", idx, null, e.target.value)
                    }
                    placeholder="Feature name (e.g. Free WiFi)"
                    className="w-full p-2 bg-transparent border-b border-transparent hover:border-gray-200
                     focus:ring-ticket-orange  outline-none text-sm transition-all"
                  />
                </div>
                <button
                  onClick={() => removeRow("spec", idx)}
                  className="w-8 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addRow("spec", { spec: "" })}
              className="text-ticket-orange text-xs font-bold mt-2 flex items-center gap-1 hover:underline"
            >
              <Plus size={14} /> Add Specification
            </button>
          </div>

          <div
            className="border-b border-gray-100 pb-2 mb-4 mt-10 grid grid-cols-12 text-[10px] font-bold
           text-gray-400 uppercase tracking-widest"
          >
            <div className="col-span-11">Available Dates & Time Slots</div>
          </div>

          <div className="space-y-4">
            {formData.slots.map((slot, idx) => (
              <div
                key={idx}
                className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-4 bg-gray-50/50 p-3 rounded-lg border
                 border-gray-100"
              >
                <div className="flex-1 flex items-center gap-2 bg-white p-2 rounded border border-gray-100">
                  <Calendar size={14} className="text-ticket-orange" />
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) =>
                      updateList("slots", idx, "date", e.target.value)
                    }
                    className="bg-transparent text-sm outline-none w-full text-gray-700"
                  />
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <div className="flex-1 flex items-center gap-2 bg-white p-2 rounded border border-gray-100">
                    <Clock size={14} className="text-gray-400" />
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateList("slots", idx, "startTime", e.target.value)
                      }
                      className="bg-transparent text-sm outline-none w-full text-gray-700"
                    />
                  </div>

                  <span className="text-gray-400 text-xs font-bold uppercase mx-1">
                    To
                  </span>

                  <div className="flex-1 bg-white p-2 rounded border border-gray-100">
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        updateList("slots", idx, "endTime", e.target.value)
                      }
                      className="bg-transparent text-sm outline-none w-full text-gray-700"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeRow("slots", idx)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                addRow("slots", { date: "", startTime: "", endTime: "" })
              }
              className="text-ticket-orange text-xs font-bold mt-2 flex items-center gap-1 hover:underline"
            >
              <Plus size={14} /> Add Time Slot
            </button>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-4 flex flex-col h-full shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
            {isLoading ? (
              <button
                className="flex items-center justify-center w-32 h-10 bg-ticket-yellow hover:bg-ticket-yellow/90
                                     text-slate-900 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(255,193,7,0.2)] 
                                     hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]"
              >
                <DotLottieReact
                  className="w-32 h-32 brightness-0"
                  src="https://lottie.host/07edc8d8-86af-40f2-ba5b-fbc869fbfded/YTDgtXR0cO.lottie"
                  loop
                  autoplay
                />
              </button>
            ) : (
              <button
                onClick={() => onSubmit(formData)}
                className="w-full bg-ticket-orange  text-white font-bold py-3 rounded-lg flex items-center justify-center
               gap-2 shadow-lg shadow-blue-200 transition-all"
              >
                <Send size={18} /> Send to Registry
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 bg-white border border-gray-200 py-2 rounded-lg text-sm font-bold
                 text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6 flex-1">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Rating
              </label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <input
                  type="number"
                  max="5"
                  min="0"
                  step="0.1"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full text-sm font-bold outline-none bg-transparent"
                />
              </div>
            </div>

            <hr className="border-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueAddModal;
