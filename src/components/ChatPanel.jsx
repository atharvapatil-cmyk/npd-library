import { useState, useRef, useEffect } from 'react';
import { canView } from '../data/data.js';

const QUICK_REPLIES = [
  { label: 'Formulation Docs',  q: 'formulation docs' },
  { label: 'Stability Studies', q: 'stability studies' },
  { label: 'All Sections',      q: 'list all sections' },
  { label: 'Regulatory Files',  q: 'regulatory files' },
  { label: 'Search by Tag',     q: 'search by tag' },
  { label: 'Batch Records',     q: 'batch records' },
];

const LIB_LINES = [
  'Found it in 0.3 seconds.',
  "I've memorised every file in this vault - ask me ANYTHING.",
  'My filing system is immaculate.',
  "Here's what I found!",
  'Found it!',
  'Searching the depths of the NPD vault...',
  'Found it! Anything else you need?',
];

const randomLine = () => LIB_LINES[Math.floor(Math.random() * LIB_LINES.length)];

function getSearchResults(q, sections, user, matrix) {
  const query = q.toLowerCase().trim();
  const allFiles = [];
  sections.forEach(s => {
    s.folders?.forEach(f => {
      if (canView(user.id, f.id, matrix)) {
        (f.files || []).forEach(file => {
          allFiles.push({ ...file, section: s.name, folder: f.name, sectionColor: s.color });
        });
      }
    });
  });

  if (query.includes('formul')) {
    const r = allFiles.filter(f => f.name.toLowerCase().includes('formul') || (f.tags||[]).some(t => t.includes('formul')));
    return { text: `Found **${r.length} formulation files** you can access!`, files: r.slice(0,5) };
  }
  if (query.includes('stabil')) {
    const r = allFiles.filter(f => f.name.toLowerCase().includes('stab') || (f.tags||[]).includes('stability'));
    return { text: 'Here are the **stability study files** - great science lives here!', files: r.slice(0,5) };
  }
  if (query.includes('list') || query.includes('section')) {
    return { text: `The library has **${sections.length} sections**: ${sections.map(s => s.name).join(', ')}. Click any section in the top nav to jump there!` };
  }
  if (query.includes('reg') || query.includes('fssai') || query.includes('fda') || query.includes('ayush') || query.includes('compliance')) {
    const r = allFiles.filter(f => f.section.toLowerCase().includes('reg') || (f.tags||[]).some(t => ['fssai','fda','label','ayush','reg'].some(k => t.includes(k))));
    return { text: `**Regulatory files** incoming! Found ${r.length} docs:`, files: r.slice(0,5) };
  }
  if (query.includes('batch') || query.includes('trial')) {
    const r = allFiles.filter(f => (f.tags||[]).some(t => ['batch','trial','tb-'].some(k => t.includes(k))) || f.name.toLowerCase().includes('batch') || f.name.toLowerCase().includes('trial'));
    return { text: `**Batch & trial records** - ${r.length} found!`, files: r.slice(0,5) };
  }
  if (query.includes('tag')) {
    return { text: 'Tag search: just type a tag like **ayurvedic**, **collagen**, **fssai**, **pilot**, **sop** - I will find it!' };
  }
  if (query.includes('sop')) {
    const r = allFiles.filter(f => (f.tags||[]).includes('sop') || f.name.toLowerCase().includes('sop'));
    return { text: `SOPs found! Standard Operating Procedures - ${r.length} docs`, files: r.slice(0,5) };
  }
  if (query.includes('coa') || query.includes('certificate')) {
    const r = allFiles.filter(f => (f.tags||[]).some(t => t.includes('coa')) || f.name.toLowerCase().includes('coa'));
    return { text: `COA files! Found ${r.length} certificates of analysis.`, files: r.slice(0,5) };
  }

  const r = allFiles.filter(f =>
    f.name.toLowerCase().includes(query) ||
    (f.tags || []).some(t => t.toLowerCase().includes(query)) ||
    f.section.toLowerCase().includes(query) ||
    f.folder.toLowerCase().includes(query)
  );

  if (r.length > 0) {
    return { text: `${randomLine()} Found **${r.length} match${r.length > 1 ? 'es' : ''}** for "${q}":`, files: r.slice(0,5) };
  }
  return {
    text: `Could not find anything for "${q}". Try: **formulation**, **COA**, **SOP**, **trial**, **stability**, **label**, **collagen**... or any tag!`
  };
}

function LibrarianSVG({ size = 38 }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
        <defs>
          <linearGradient id="libBg" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#dcfce7"/>
            <stop offset="100%" stopColor="#a7f3d0"/>
          </linearGradient>
          <linearGradient id="libBody" x1="0" y1="40" x2="64" y2="64">
            <stop offset="0%" stopColor="#16a34a"/>
            <stop offset="100%" stopColor="#15803d"/>
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="32" fill="url(#libBg)"/>
        <ellipse cx="32" cy="22" rx="12" ry="11" fill="#1c0a00"/>
        <path d="M20 22C20 16 25 11 32 11C39 11 44 16 44 22C44 18 41 14 32 14C23 14 20 18 20 22Z" fill="#2d1500"/>
        <rect x="29" y="33" width="6" height="5" fill="#FDDCB5"/>
        <ellipse cx="32" cy="25" rx="10" ry="10.5" fill="#FDDCB5"/>
        <ellipse cx="27" cy="24" rx="2" ry="2.2" fill="#2d1500"/>
        <ellipse cx="37" cy="24" rx="2" ry="2.2" fill="#2d1500"/>
        <circle cx="27.8" cy="23" r="0.8" fill="white"/>
        <circle cx="37.8" cy="23" r="0.8" fill="white"/>
        <rect x="23.5" y="22" width="7" height="5" rx="2.5" stroke="#16a34a" strokeWidth="1.3" fill="none" fillOpacity="0.1"/>
        <rect x="33.5" y="22" width="7" height="5" rx="2.5" stroke="#16a34a" strokeWidth="1.3" fill="none" fillOpacity="0.1"/>
        <line x1="31" y1="24.5" x2="33.5" y2="24.5" stroke="#16a34a" strokeWidth="1.3"/>
        <path d="M27 30C28.5 32 35.5 32 37 30" stroke="#b97a3a" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="24" cy="29" r="2.2" fill="#fca5a5" opacity="0.4"/>
        <circle cx="40" cy="29" r="2.2" fill="#fca5a5" opacity="0.4"/>
        <path d="M17 64H47V42C47 40 45 38 43 38H21C19 38 17 40 17 42V64Z" fill="url(#libBody)"/>
        <path d="M26 38L32 46L38 38" stroke="#15803d" strokeWidth="1.5" fill="white"/>
        <rect x="43" y="36" width="9" height="13" rx="1.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8"/>
        <line x1="45" y1="39" x2="50" y2="39" stroke="#92400e" strokeWidth="0.7"/>
        <line x1="45" y1="41.5" x2="50" y2="41.5" stroke="#92400e" strokeWidth="0.7"/>
        <line x1="45" y1="44" x2="50" y2="44" stroke="#92400e" strokeWidth="0.7"/>
        <rect x="24" y="45" width="16" height="6" rx="1.5" fill="white" opacity="0.9"/>
        <text x="32" y="49.5" textAnchor="middle" fill="#16a34a" fontSize="4" fontWeight="800" fontFamily="system-ui,sans-serif">LIB</text>
      </svg>
    </div>
  );
}

function FileResultCard({ file }) {
  const ext = (file.name || '').split('.').pop().toLowerCase();
  const colors = { pdf:'#ef4444', xlsx:'#22c55e', xls:'#22c55e', docx:'#3b82f6', doc:'#3b82f6' };
  const c = colors[ext] || '#6b7280';
  return (
    <div className="chat-result-card">
      <div className="chat-result-file-icon" style={{ color: c }}>
        <svg width="16" height="19" viewBox="0 0 20 24" fill="none">
          <path d="M3 3C3 1.9 3.9 1 5 1H13L19 7V21C19 22.1 18.1 23 17 23H5C3.9 23 3 22.1 3 21V3Z" fill={c+'20'} stroke={c} strokeWidth="1.4"/>
          <path d="M13 1V7H19" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="chat-result-file-info">
        <div className="chat-result-file-name">{file.name}</div>
        <div className="chat-result-file-path">{file.section} &rsaquo; {file.folder}</div>
        {(file.tags||[]).length > 0 && (
          <div style={{ display:'flex', gap:'4px', marginTop:'4px', flexWrap:'wrap' }}>
            {file.tags.slice(0,3).map(t => <span key={t} className="file-tag" style={{fontSize:'9px'}}>#{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function renderBold(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export default function ChatPanel({ onClose, currentUser, accessMatrix, sections }) {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: `Hey ${currentUser?.name?.split(' ')[0] || 'there'}! I'm **Lib** - your NPD Document Librarian. I know every file in this library. Ask me by name, tag, topic, anything!`,
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setTyping(true);
    setTimeout(() => {
      const result = getSearchResults(q, sections || [], currentUser, accessMatrix);
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', ...result }]);
    }, 500 + Math.random() * 500);
  };

  return (
    <div className="chat-float-panel">
      <div className="chat-float-header">
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ position:'relative' }}>
            <LibrarianSVG size={44}/>
            <div className="chat-online-indicator"/>
          </div>
          <div>
            <div className="chat-float-name">Lib</div>
            <div className="chat-float-status">Document Librarian &middot; Always on</div>
          </div>
        </div>
        <button className="chat-float-close" onClick={onClose}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="chat-quick-bar">
        {QUICK_REPLIES.map(r => (
          <button key={r.q} className="chat-quick-chip" onClick={() => send(r.q)}>
            {r.label}
          </button>
        ))}
      </div>

      <div className="chat-float-body" ref={bodyRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg-row ${msg.role}`}>
            {msg.role === 'bot' && <LibrarianSVG size={30}/>}
            <div className="chat-msg-content">
              <div className={`chat-bubble-msg ${msg.role}`}>
                <span dangerouslySetInnerHTML={{ __html: renderBold(msg.text) }}/>
              </div>
              {(msg.files || []).length > 0 && (
                <div className="chat-file-results">
                  {msg.files.map((f, fi) => <FileResultCard key={fi} file={f}/>)}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="chat-user-bubble-avatar">
                {currentUser?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="chat-msg-row bot">
            <LibrarianSVG size={30}/>
            <div className="chat-typing-indicator">
              <span/><span/><span/>
            </div>
          </div>
        )}
      </div>

      <div className="chat-float-input-row">
        <input
          ref={inputRef}
          className="chat-float-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask Lib anything..."
          autoFocus
        />
        <button className="chat-float-send" onClick={() => send()} disabled={!input.trim()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
