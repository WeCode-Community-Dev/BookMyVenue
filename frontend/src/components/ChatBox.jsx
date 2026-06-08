import React, { useState, useEffect, useRef } from 'react';
import { fetchRoomMessages } from '../services/chatApi';

const ChatBox = ({ roomId, currentUserId, partnerName }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load historical messages
    fetchRoomMessages(roomId).then(setMessages).catch(console.error);

    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use localhost:8000 for local dev
    const wsUrl = `${protocol}//localhost:8000/api/v1/chat/ws/${roomId}/${currentUserId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMsg]);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [roomId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !ws.current) return;
    
    ws.current.send(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-96 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-slate-800 p-4 border-b border-slate-700 font-semibold text-slate-100 flex justify-between items-center">
        <span>Chat with {partnerName || 'Partner'}</span>
        <span className="flex items-center text-xs text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Live
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMine ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-3 bg-slate-800 border-t border-slate-700 flex">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-900 text-slate-100 border border-slate-700 rounded-l-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-r-lg font-medium transition-colors">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
