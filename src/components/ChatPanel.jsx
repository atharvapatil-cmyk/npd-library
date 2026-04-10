import React, { useState, useRef, useEffect } from 'react';
import { OPENAI_KEY, CHATBOT_SYSTEM_PROMPT } from '../data/data';

const SUGGESTIONS = [
  'What formulation docs do we have for ashwagandha?',
  'Show me all stability reports',
  'Which files were added this week?',
  'What is the FSSAI compliance checklist?',
  'List all SOP documents',
];

function renderMessage(text) {
  // Simple bold rendering for **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

export default function ChatPanel({ user, files, users, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${user?.name?.split(' ')[0]}! ð I'm your **NPD Librarian**. I can help you find documents, understand formulations, check compliance requirements, or navigate the library. What do you need?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    const newMsgs = [...messages, { role: 'user', text: msg }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const history = newMsgs.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: CHATBOT_SYSTEM_PROMPT }, ...history],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response. Please check the API key.';
      setMessages(p => [...p, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages(p => [...p, { role: 'assistant', text: 'Connection error. Please check your internet connection and API key configuration.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div className="anim-slide-r" style={{
      position:'fixed', top:'var(--header-height)', right:0,
      bottom:0, width:370,
      background:'var(--bg-card)', borderLeft:'1px solid var(--border)',
      display:'flex', flexDirection:'column', zIndex:90,
      boxShadow:'-8px 0 30px rgba(0,0,0,.1)',
    }}>
      {/* Header */}
      <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#16a34a,#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>ð¤</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)' }}>NPD Librarian</div>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--text-muted)' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', display:'inline-block' }} />
            AI-Powered Â· GPT-4o-mini
          </div>
        </div>
        <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>Ã</button>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:8 }}>TRY ASKING</div>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)}
                style={{ padding:'7px 12px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', textAlign:'left', fontSize:11, color:'var(--text-secondary)', transition:'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background='var(--bg-hover)'; e.currentTarget.style.borderColor='var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='var(--bg-surface)'; e.currentTarget.style.borderColor='var(--border)'; }}
              >{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-end', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            {m.role === 'assistant' && (
              <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#16a34a,#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>ð¤</div>
            )}
            <div className={m.role === 'assistant' ? 'chat-ai' : 'chat-user'}
              style={{ padding:'10px 14px', maxWidth:'80%', fontSize:13, lineHeight:1.6 }}>
              {renderMessage(m.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#16a34a,#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>ð¤</div>
            <div className="chat-ai" style={{ padding:'12px 16px' }}>
              <div className="chat-typing" style={{ display:'flex', gap:4 }}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about any documentâ¦"
            rows={1}
            style={{
              flex:1, padding:'10px 14px', borderRadius:12,
              border:'1px solid var(--border)', background:'var(--bg-surface)',
              color:'var(--text-primary)', fontSize:13, resize:'none',
              lineHeight:1.5, maxHeight:100, overflowY:'auto',
            }}
          />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            className="btn-glow"
            style={{ width:40, height:40, borderRadius:12, border:'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', color:'white', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', opacity: input.trim() && !loading ? 1 : .5, flexShrink:0 }}>
            â
          </button>
        </div>
        <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:6, textAlign:'center' }}>Enter to send Â· Shift+Enter for new line</div>
      </div>
    </div>
  );
}
