import { useState, useRef, useEffect } from 'react';
import { FOLDER_TREE, canView } from '../data/data.js';

function buildIndex(currentUser, accessMatrix) {
  const idx = [];
  (FOLDER_TREE || []).forEach(sec => {
    (sec.folders || []).forEach(folder => {
      const hasAccess = canView(currentUser.id, folder.id, accessMatrix);
      idx.push({
        type: 'folder',
        section: sec.name,
        folder: folder.name,
        path: sec.name + ' / ' + folder.name,
        files: folder.files || [],
        accessible: hasAccess,
      });
      if (hasAccess) {
        (folder.files || []).forEach(file => {
          idx.push({
            type: 'file',
            section: sec.name,
            folder: folder.name,
            name: file.name,
            tag: file.tag || '',
            path: sec.name + ' / ' + folder.name + ' / ' + file.name,
            accessible: true,
          });
        });
      }
    });
  });
  return idx;
}

function searchDocs(query, idx) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);
  return idx.filter(item => {
    if (!item.accessible) return false;
    const searchable = [item.path, item.name || '', item.tag || '', item.folder || '', item.section || '']
      .join(' ').toLowerCase();
    return words.every(w => searchable.includes(w));
  }).slice(0, 8);
}

function getResponse(msg, idx) {
  const q = msg.toLowerCase().trim();

  const greetings = ['hello', 'hi', 'hey', 'help', 'start'];
  if (greetings.some(g => q === g || q.startsWith(g + ' '))) {
    return {
      text: "Hi! I'm Lib, your NPD Document Librarian. I know the entire document library. Try asking me:\n- \"find formulation docs\"\n- \"where are stability studies?\"\n- \"show regulatory files\"\n- \"list all sections\"",
      results: [],
    };
  }

  if (q.includes('list section') || q.includes('show section') || q.includes('all section')) {
    const sections = [...new Set(idx.filter(i => i.accessible).map(i => i.section))];
    return {
      text: `Here are the sections you have access to (${sections.length} total):`,
      results: sections.map(s => ({ type: 'section', name: s, path: s })),
    };
  }

  if (q.includes('list folder') || q.includes('show folder') || q.includes('all folder')) {
    const folders = idx.filter(i => i.type === 'folder' && i.accessible).slice(0, 8);
    if (!folders.length) return { text: "No folders found in your accessible areas.", results: [] };
    return { text: `Found ${folders.length} folders:`, results: folders };
  }

  const results = searchDocs(msg, idx);
  if (results.length > 0) {
    const files = results.filter(r => r.type === 'file');
    const folders = results.filter(r => r.type === 'folder');
    let text = `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${msg}":`;
    if (files.length && folders.length) {
      text = `Found ${files.length} file${files.length !== 1 ? 's' : ''} and ${folders.length} folder${folders.length !== 1 ? 's' : ''} matching "${msg}":`;
    }
    return { text, results };
  }

  return {
    text: `I couldn't find anything matching "${msg}" in your accessible documents. Try different keywords, or ask me to "list sections" to browse.`,
    results: [],
  };
}

export default function ChatPanel({ onClose, currentUser, accessMatrix }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: "Hi! I'm Lib, your NPD Document Librarian.\nAsk me to find any file or folder â I know the whole library.",
      results: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const idx = buildIndex(currentUser || { id: '' }, accessMatrix || {});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), from: 'user', text: trimmed, results: [] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getResponse(trimmed, idx);
      const botMsg = { id: Date.now() + 1, from: 'bot', ...response };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 600);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const QUICK = ['find formulation docs', 'show stability studies', 'list sections', 'regulatory files'];

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar-lib">L</div>
          <div>
            <div className="chat-title">Lib</div>
            <div className="chat-subtitle">Document Librarian</div>
          </div>
        </div>
        <button className="chat-close" onClick={onClose} title="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="chat-body">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-msg chat-msg-${msg.from}`}>
            {msg.from === 'bot' && (
              <div className="chat-msg-avatar">L</div>
            )}
            <div className="chat-msg-content">
              <div className="chat-msg-bubble">
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < msg.text.split('\n').length - 1 && <br/>}</span>
                ))}
              </div>
              {msg.results && msg.results.length > 0 && (
                <div className="chat-results">
                  {msg.results.map((r, i) => (
                    <div key={i} className="chat-result-card">
                      <div className="chat-result-icon">
                        {r.type === 'file' ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="#16a34a" strokeWidth="1.3"/>
                            <path d="M4 5h6M4 7h4M4 9h5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        ) : r.type === 'section' ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="#16a34a" strokeWidth="1.2"/>
                            <rect x="8.5" y="1" width="4.5" height="4.5" rx="1" stroke="#16a34a" strokeWidth="1.2"/>
                            <rect x="1" y="8.5" width="4.5" height="4.5" rx="1" stroke="#16a34a" strokeWidth="1.2"/>
                            <rect x="8.5" y="8.5" width="4.5" height="4.5" rx="1" stroke="#16a34a" strokeWidth="1.2"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 4C1 3.45 1.45 3 2 3H5.5L7 4.5H12C12.55 4.5 13 4.95 13 5.5V11C13 11.55 12.55 12 12 12H2C1.45 12 1 11.55 1 11V4Z" stroke="#16a34a" strokeWidth="1.3"/>
                          </svg>
                        )}
                      </div>
                      <div className="chat-result-info">
                        <div className="chat-result-name">{r.name || r.folder || r.section}</div>
                        <div className="chat-result-path">{r.path}</div>
                        {r.tag && <div className="chat-result-tag">{r.tag}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="chat-msg chat-msg-bot">
            <div className="chat-msg-avatar">L</div>
            <div className="chat-typing">
              <span/><span/><span/>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div className="chat-quick">
        {QUICK.map(q => (
          <button key={q} className="chat-quick-btn" onClick={() => send(q)}>{q}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="chat-input"
          placeholder="Ask Lib to find a file..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          className="chat-send"
          onClick={() => send()}
          disabled={!input.trim()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
