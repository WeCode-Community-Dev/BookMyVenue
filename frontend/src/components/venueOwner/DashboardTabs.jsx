import { useState } from 'react';

export const TABS = [
  {
    key: "active",
    label: "Active Venues",
    statuses: ["APPROVED"],
    emptyTabText: "No approved venues yet.",
  },
  {
    key: "inProgress",
    label: "In Progress",
    statuses: ["DRAFT", "EDIT_DRAFT"],
    emptyTabText: "No drafts in progress.",
  },
  {
    key: "submittedForReview",
    label: "Submitted For Review",
    statuses: ["PENDING", "CHANGES_PENDING"],
    emptyTabText: "No venues under review.",
  },
  {
    key: "rejected",
    label: "Rejected",
    statuses: ["REJECTED"],
    emptyTabText: "No rejected venues.",
  },
];

export function getEmptyTabText(tabKey) {
  return TABS.find(tab => tab.key === tabKey).emptyTabText;
}

export default function DashboardTabs({ activeTab, counts, onTabChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mb-6">
      {/* Desktop */}
      <div className="hidden md:flex border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === tab.key
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-gray-400">({counts[tab.key] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Mobile: active tab label + hamburger */}
      <div className="flex md:hidden items-center justify-between border-b border-gray-200 pb-3">
        <span className="text-sm font-medium text-red-600">
          {TABS.find(t => t.key === activeTab)?.label}
          <span className="ml-1 text-gray-400">({counts[activeTab] ?? 0})</span>
        </span>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          aria-label="Open tab menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-64 h-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <span className="font-medium text-gray-800">Sections</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 py-2">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    onTabChange(tab.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs text-gray-400">({counts[tab.key] ?? 0})</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
