import React from "react";
import { LayoutGrid, List } from "lucide-react";

const ViewToggle = () => {
  return (
    <div className="flex border border-slate-200 rounded-xl overflow-hidden">

      <button className="p-2 bg-blue-600 text-white">
        <LayoutGrid size={18} />
      </button>

      <button className="p-2 bg-white text-slate-600 hover:bg-slate-50">
        <List size={18} />
      </button>

    </div>
  );
};

export default ViewToggle;