import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ROLE_META } from '../data/data';

export default function Header({ user, fileCount, searchQuery, setSearchQuery, chatOpen, onChatToggle, onLogout, onSettingsClick }) {
  const { dark, toggle } = useTheme();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const rm = ROLE_META[user?.role] || {};

  useEffect(() => {
    const handler = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, height:'var(--header-height)', zIndex:100,
      background: dark ? 'rgba(7,13,24,.92)' : 'rgba(255,255,255,.92)',
      backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center', padding:'0 20px', gap:12,
      boxShadow:'var(--shadow-sm)',
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, marginRight:4 }}>
        <div style={{
          width:36, height:36, borderRadius:10,
          background:'linear-gradient(135deg,#16a34a,#059669)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 16px rgba(22,163,74,.35)', fontSize:18,
        }}>ð</div>
        <div>
          <div style={{ fontSize:14, fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.3px', lineHeight:1.2 }}>NPD Library</div>
          <div style={{ fontSize:10, color:'var(--text-muted)', lineHeight:1 }}>
            <span style={{ color:'var(--accent)', fontWeight:700 }}>{fileCount}</span> docs accessible
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ flex:1, maxWidth:520, position:'relative' }}>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'var(--text-muted)', pointerEvents:'none' }}>ð</span>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search documents, tags, uploadersâ¦"
          style={{
            width:'100%', padding:'8px 12px 8px 36px',
            borderRadius:10, border:'1px solid var(--border)',
            background:'var(--bg-surface)', color:'var(--text-primary)',
            fontSize:13, transition:'all var(--transition)',
          }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:16, lineHeight:1 }}>Ã</button>
        )}
      </div>

      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
        {/* AI Chat toggle */}
        <button
          onClick={onChatToggle}
          title="AI Librarian"
          style={{
            display:'flex', alignItems:'center', gap:6, padding:'7px 14px',
            borderRadius:10, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
            background: chatOpen ? 'var(--accent)' : 'var(--bg-surface)',
            color: chatOpen ? 'white' : 'var(--text-secondary)',
            transition:'all var(--transition)',
          }}
        >
          <span style={{ fontSize:15 }}>ð¤</span> AI Librarian
        </button>

        {/* Dark/Light toggle */}
        <button onClick={toggle} title={dark ? 'Light mode' : 'Dark mode'}
          style={{ width:36, height:36, borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', transition:'all var(--transition)' }}>
          {dark ? 'âï¸' : 'ð'}
        </button>

        {/* Settings */}
        <button onClick={onSettingsClick} title="Settings"
          style={{ width:36, height:36, borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', transition:'all var(--transition)' }}>
          âï¸
        </button>

        {/* Avatar dropdown */}
        <div ref={dropRef} style={{ position:'relative' }}>
          <button onClick={() => setDropOpen(p => !p)}
            style={{
              display:'flex', alignItems:'center', gap:8, padding:'6px 10px',
              borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)',
              cursor:'pointer', transition:'all var(--transition)',
            }}>
            <div className={user?.role === 'admin' ? 'pulse-ring' : ''} style={{
              width:28, height:28, borderRadius:8,
              background:`linear-gradient(135deg,${rm.color || '#16a34a'}cc,${rm.color || '#16a34a'}66)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:10, fontWeight:800, color:'white',
            }}>{user?.avatar}</div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', lineHeight:1.3 }}>{user?.name}</div>
              <div style={{ fontSize:10, color:rm.color, fontWeight:600 }}>{rm.label}</div>
            </div>
            <span style={{ fontSize:10, color:'var(--text-muted)' }}>â¾</span>
          </button>

          {dropOpen && (
            <div className="anim-scale" style={{
              position:'absolute', top:'calc(100% + 8px)', right:0, minWidth:180,
              background:'var(--bg-card)', border:'1px solid var(--border)',
              borderRadius:14, boxShadow:'var(--shadow-lg)', overflow:'hidden', zIndex:200,
            }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)' }}>{user?.name}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <button onClick={() => { onSettingsClick(); setDropOpen(false); }}
                style={{ width:'100%', padding:'10px 16px', textAlign:'left', background:'none', border:'none', cursor:'pointer', fontSize:13, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:8 }}>
                âï¸ Settings
              </button>
              <button onClick={onLogout}
                style={{ width:'100%', padding:'10px 16px', textAlign:'left', background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#dc2626', display:'flex', alignItems:'center', gap:8, borderTop:'1px solid var(--border)' }}>
                ðª Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
