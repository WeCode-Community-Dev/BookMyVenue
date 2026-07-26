import React from "react";
import { LayoutGrid, List } from "lucide-react";

const ViewToggle = ({ viewMode = "grid", onToggle }) => {
  return (
    <div className="flex border border-slate-200 rounded-xl overflow-hidden">

      <button
        type="button"
        onClick={() => onToggle("grid")}
        className={`p-2 transition-all ${viewMode === "grid" ? "bg-amber-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
      >
        <LayoutGrid size={18} />
      </button>

      <button
        type="button"
        onClick={() => onToggle("list")}
        className={`p-2 transition-all ${viewMode === "list" ? "bg-amber-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
      >
        <List size={18} />
      </button>

    </div>
  );
};

export default ViewToggle;