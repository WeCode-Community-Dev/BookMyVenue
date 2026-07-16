import React, { useState } from 'react';
import { Mail, MailOpen, MessageSquare, Reply, Send, Check, Shield } from 'lucide-react';

export default function AdminMessages({ messages, onToggleRead, onAddReply }) {
  const [expandedId, setExpandedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showSuccessId, setShowSuccessId] = useState(null);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setReplyText("");
  };

  const handleSendReply = (e, messageId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onAddReply(messageId, replyText);
    setReplyText("");
    
    // Show a quick success banner
    setShowSuccessId(messageId);
    setTimeout(() => {
      setShowSuccessId(null);
    }, 3000);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Inbox Notifications ({messages.length})</h3>
        <p className="text-xs text-slate-400 font-medium">Messages from platform administrators and hosts</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <MailOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-base font-bold text-slate-700">Inbox is Empty</h4>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">No new updates from hosts or platform administration at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isExpanded = expandedId === message.id;
            
            return (
              <div 
                key={message.id}
                className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${
                  message.read 
                    ? 'border-slate-250/70 shadow-sm' 
                    : 'border-ticket-orange/30 shadow-[0_4px_20px_rgba(255,152,0,0.06)]'
                }`}
              >
                {/* Header Header */}
                <div 
                  onClick={() => handleToggleExpand(message.id)}
                  className={`p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                    !message.read ? 'bg-slate-50/50' : ''
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={message.avatar} 
                      alt={message.sender} 
                      className="w-11 h-11 rounded-full object-cover border border-slate-100 bg-slate-200"
                    />
                    {!message.read && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-ticket-orange rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-800 text-sm md:text-base leading-tight truncate">{message.sender}</h4>
                      {message.senderRole.includes('Admin') && (
                        <span className="px-1.5 py-0.5 bg-slate-800 text-white rounded text-[9px] font-extrabold uppercase flex items-center gap-0.5 select-none">
                          <Shield className="w-2 h-2" /> Staff
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{message.senderRole}</span>
                    
                    <p className={`text-slate-600 text-xs md:text-sm mt-2 line-clamp-1 font-medium ${
                      !message.read ? 'font-semibold text-slate-800' : ''
                    }`}>
                      {message.content}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold">{formatDate(message.timestamp)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRead(message.id);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        message.read 
                          ? 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200' 
                          : 'bg-ticket-orange/10 hover:bg-ticket-orange/20 text-ticket-orange border-ticket-orange/30'
                      }`}
                    >
                      {message.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details / Thread */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-100 bg-[#FAF9F6]/50">
                    {/* Message Details */}
                    <div className="py-4 text-slate-700 text-xs md:text-sm leading-relaxed pl-1">
                      {message.content}
                    </div>

                    {/* Chat Replies List */}
                    {message.replies && message.replies.length > 0 && (
                      <div className="space-y-3.5 my-4 border-t border-slate-200/50 pt-4">
                        {message.replies.map((reply, index) => (
                          <div 
                            key={index} 
                            className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs md:text-sm font-medium ${
                              reply.isAdmin 
                                ? 'bg-white border border-slate-200 mr-auto text-slate-700 rounded-tl-none' 
                                : 'bg-slate-800 text-white ml-auto rounded-tr-none shadow-sm'
                            }`}
                          >
                            <span className="text-[9px] font-extrabold uppercase opacity-60 tracking-wider mb-1 block">
                              {reply.sender} • {formatDate(reply.timestamp)}
                            </span>
                            {reply.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Success Notice */}
                    {showSuccessId === message.id && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
                        <Check className="w-4 h-4 shrink-0" /> Reply sent successfully!
                      </div>
                    )}

                    {/* Reply Form */}
                    <form onSubmit={(e) => handleSendReply(e, message.id)} className="flex gap-2.5 mt-3 pt-3 border-t border-slate-200/40">
                      <input 
                        type="text" 
                        placeholder="Type your message to the host/administrator..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                        className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none bg-white text-slate-700 font-medium text-xs md:text-sm shadow-sm"
                      />
                      <button 
                        type="submit"
                        className="px-4 bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 rounded-2xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-ticket-yellow/10"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
