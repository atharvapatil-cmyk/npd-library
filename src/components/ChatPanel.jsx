import { useState, useRef, useEffect } from 'react';
import { FOLDER_TREE } from '../data/data.js';

const INITIAL_MESSAGES = [
  { id: 1, author: 'System', avatar: 'S', text: 'Team chat for NPD collaboration. Messages are visible to all members.', time: 'Today', system: true },
  { id: 2, author: 'Darshani', avatar: 'D', text: 'Updated the Ashwagandha formulation specs in Nutraceuticals > Formulations.', time: '10:22 AM', color: '#16a34a' },
  { id: 3, author: 'Priya', avatar: 'PS', text: 'New FSSAI compliance checklist added to Regulatory > Domestic.', time: '11:05 AM', color: '#8b5cf6' },
];

export default function ChatPanel({ currentUser, activeSection, activeFolder, onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const section = FOLDER_TREE.find(s => s.id === activeSection);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      author: currentUser.name,
      avatar: currentUser.avatar,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: currentUser.color || '#16a34a',
      own: true,
    }]);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-title">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 3C2 2.45 2.45 2 3 2H12C12.55 2 13 2.45 13 3V9C13 9.55 12.55 10 12 10H5L2 13V3Z" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          Team Chat
          {section && <span className="chat-context">Â· {section.name}</span>}
        </div>
        <button className="chat-close" onClick={onClose}>x</button>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.system ? 'system' : ''} ${msg.own ? 'own' : ''}`}>
            {!msg.system && !msg.own && (
              <div className="chat-avatar" style={{ background: `linear-gradient(135deg, ${msg.color}88, ${msg.color})` }}>
                {msg.avatar}
              </div>
            )}
            <div className="chat-bubble">
              {!msg.system && !msg.own && <div className="chat-author">{msg.author}</div>}
              <div className="chat-text">{msg.text}</div>
              <div className="chat-time">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button className="chat-send" onClick={send} disabled={!input.trim()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7L13 1L7 7L13 13L1 7Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
