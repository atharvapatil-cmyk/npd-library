import { useState, useRef, useEffect } from 'react';
import { FOLDER_TREE } from '../data/data.js';

const BOT_COLOR = '#16a34a';

function buildIndex() {
  const idx = [];
  (FOLDER_TREE || []).forEach(sec => {
    (sec.folders || []).forEach(folder => {
      idx.push({ type: 'folder', section: sec.name, folder: folder.name, path: sec.name + ' / ' + folder.name, files: folder.files || [] });
      (folder.files || []).forEach(file => {
        idx.push({ type: 'file', section: sec.name, folder: folder.name, name: file.name, tag: file.tag || '', path: sec.name + ' / ' + folder.name + ' / ' + file.name });
      });
    });
  });
  return idx;
}

function searchDocs(query, idx) {
  const q = (query || '').toLowerCase();
  if (!q || q.length < 2) return [];
  return idx.filter(item =>
    item.path.toLowerCase().includes(q) ||
    (item.tag && item.tag.toLowerCase().includes(q)) ||
    (item.name && item.name.toLowerCase().includes(q)) ||
    item.section.toLowerCase().includes(q) ||
    item.folder.toLowerCase().includes(q)
  );
}

function getResponse(msg, idx) {
  const m = (msg || '').toLowerCase().trim();
  if (!m) return { text: 'Type something and I will help!', results: [] };

  const totalFiles = idx.filter(i => i.type === 'file').length;
  const totalFolders = idx.filter(i => i.type === 'folder').length;
  const secCount = (FOLDER_TREE || []).length;

  if (/^(hi|hello|hey|heyy|good|namaste|sup|yo)/.test(m)) {
    return { text: "Hi there! I'm Lib, your NPD Document Librarian.\n\nI know " + totalFiles + " files across " + totalFolders + " folders in " + secCount + " sections.\n\nTry asking me:\n- Where is the COA document?\n- What is in Regulatory?\n- Find formulation specs\n- List all sections", results: [] };
  }

  if (/help|what can|how do|guide/.test(m)) {
    const secs = (FOLDER_TREE || []).map(s => s.name).join(', ');
    return { text: "I can help you navigate:\n\nSections: " + secs + "\n\nJust describe what you need in plain words and I will find it!", results: [] };
  }

  if (/list.*section|show.*section|all section|what section/.test(m)) {
    const lines = (FOLDER_TREE || []).map(s => s.name + ' -- ' + (s.folders || []).length + ' folders').join('\n');
    return { text: "All sections in the library:\n\n" + lines, results: [] };
  }

  const hits = searchDocs(msg, idx);
  if (hits.length === 0) {
    return { text: 'Could not find "' + msg + '" in the library.\n\nTry searching by section name, document type (COA, SOP, TDS), or topic like "formulation" or "regulatory".', results: [] };
  }
  if (hits.length === 1) {
    const h = hits[0];
    if (h.type === 'file') {
      return { text: 'Found it! "' + h.name + '" is located in:\n' + h.path + (h.tag ? '\n\nDescription: ' + h.tag : ''), results: [h] };
    }
    return { text: 'Found the folder "' + h.folder + '" in ' + h.section + '.\nIt contains ' + h.files.length + ' file(s).', results: [h] };
  }
  const preview = hits.slice(0, 5);
  const moreCount = hits.length - 5;
  const label = hits.length > 5 ? 'Top 5 of ' + hits.length + ' results for "' + msg + '"' : hits.length + ' result(s) for "' + msg + '"';
  return { text: label + (moreCount > 0 ? '\n+' + moreCount + ' more -- try a more specific query' : ''), results: preview };
}

const INIT_MSGS = [
  { id: 1, from: 'bot', text: "Hi! I'm Lib, your NPD Document Librarian.\n\nAsk me to find any file or folder -- I know the whole library. What do you need?" }
];

export default function ChatPanel({ currentUser, activeSection, onClose }) {
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const idx = useRef([]);

  useEffect(() => { idx.current = buildIndex(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  function send() {
    const txt = input.trim();
    if (!txt) return;
    setMsgs(prev => [...prev, { id: Date.now(), from: 'user', text: txt }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const resp = getResponse(txt, idx.current);
      setMsgs(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: resp.text, results: resp.results }]);
      setTyping(false);
    }, 500 + Math.random() * 400);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const user = currentUser || {};
  const userColor = user.color || '#6b7280';
  const rawInitials = (user.avatar || (user.name || 'U').substring(0, 2)).toString();
  const userInitials = rawInitials.replace(/[^\x20-\x7E]/g, '').substring(0, 2).toUpperCase() || 'U';

  const totalFolders = (FOLDER_TREE || []).reduce((a, s) => a + (s.folders || []).length, 0);

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-bot-avatar">L</div>
          <div>
            <div className="chat-title">Lib -- Document Librarian</div>
            <div className="chat-context">{activeSection ? 'Context: ' + activeSection : 'Knows all ' + totalFolders + ' folders'}</div>
          </div>
        </div>
        <button className="chat-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div className="chat-messages">
        {msgs.map(m => (
          <div key={m.id} className={'chat-bubble ' + (m.from === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot')}>
            {m.from === 'bot' && (
              <div className="chat-avatar" style={{ background: BOT_COLOR }}>L</div>
            )}
            <div className="chat-bubble-body">
              {m.from === 'bot' && <div className="chat-author">Lib</div>}
              <div className={'chat-text' + (m.from === 'user' ? ' chat-text-user' : '')}>
                {m.text.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                ))}
              </div>
              {m.results && m.results.length > 0 && (
                <div className="chat-results">
                  {m.results.map((r, i) => (
                    <div key={i} className="chat-result-card">
                      <div className="chat-result-icon">
                        {r.type === 'file'
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        }
                      </div>
                      <div className="chat-result-info">
                        <div className="chat-result-name">{r.type === 'file' ? r.name : r.folder}</div>
                        <div className="chat-result-path">{r.section}{r.type === 'file' ? ' / ' + r.folder : ''}</div>
                        {r.tag && <div className="chat-result-tag">{r.tag}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {m.from === 'user' && (
              <div className="chat-avatar" style={{ background: userColor }}>{userInitials}</div>
            )}
          </div>
        ))}
        {typing && (
          <div className="chat-bubble chat-bubble-bot">
            <div className="chat-avatar" style={{ background: BOT_COLOR }}>L</div>
            <div className="chat-bubble-body">
              <div className="chat-typing"><span/><span/><span/></div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask Lib to find a document..."
          rows={2}
        />
        <button className="chat-send" onClick={send} disabled={!input.trim()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}
