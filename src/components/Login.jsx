import { useState } from 'react';
import { INITIAL_USERS, ROLE_META } from '../data/data';

export default function Login({ onLogin }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      {/* Floating blobs */}
      <div style={{ position:'fixed', top:'10%', left:'8%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(22,163,74,.18) 0%, transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'15%', right:'10%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,.15) 0%, transparent 70%)', filter:'blur(50px)', pointerEvents:'none' }} />

      <div className="anim-fade-up" style={{ width:'100%', maxWidth:460 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:64, height:64, borderRadius:20, background:'linear-gradient(135deg,#16a34a,#059669)', boxShadow:'0 0 40px rgba(22,163,74,.4)', marginBottom:16 }}>
            <span style={{ fontSize:28 }}>ð</span>
          </div>
          <h1 style={{ fontSize:28, fontWeight:900, color:'#eef4ff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>NPD Library</h1>
          <p style={{ fontSize:13, color:'rgba(238,244,255,.5)', margin:0 }}>Mosaic Wellness Â· R&D Knowledge Hub</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius:24, padding:32 }}>
          <p style={{ fontSize:13, color:'rgba(238,244,255,.6)', marginBottom:20, textAlign:'center' }}>
            Select your profile to continue
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
            {INITIAL_USERS.map(user => {
              const rm = ROLE_META[user.role];
              const isSelected = selected?.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => setSelected(user)}
                  style={{
                    display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                    borderRadius:14, cursor:'pointer', border:'none',
                    background: isSelected ? 'rgba(22,163,74,.25)' : 'rgba(255,255,255,.05)',
                    outline: isSelected ? '1.5px solid rgba(74,222,128,.6)' : '1px solid rgba(255,255,255,.08)',
                    transition:'all .2s', textAlign:'left',
                  }}
                  onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background='rgba(255,255,255,.09)'; }}
                  onMouseLeave={e => { if(!isSelected) e.currentTarget.style.background='rgba(255,255,255,.05)'; }}
                >
                  <div style={{
                    width:34, height:34, borderRadius:10, flexShrink:0,
                    background:`linear-gradient(135deg,${rm.color}cc,${rm.color}88)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:13, fontWeight:800, color:'white', letterSpacing:.5,
                  }}>{user.avatar}</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#eef4ff', lineHeight:1.3 }}>{user.name}</div>
                    <div style={{ fontSize:10, color:rm.color, fontWeight:600 }}>{rm.label}</div>
                  </div>
                  {isSelected && <div style={{ marginLeft:'auto', color:'#4ade80', fontSize:16 }}>â</div>}
                </button>
              );
            })}
          </div>

          <button
            className="btn-glow"
            onClick={() => selected && onLogin(selected)}
            disabled={!selected}
            style={{
              width:'100%', padding:'13px 0', borderRadius:14, border:'none', cursor: selected ? 'pointer' : 'not-allowed',
              color:'white', fontWeight:700, fontSize:14, letterSpacing:.3,
              opacity: selected ? 1 : .45,
            }}
          >
            {selected ? `Enter as ${selected.name} â` : 'Select a profile to continue'}
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:16, fontSize:11, color:'rgba(238,244,255,.3)' }}>
          Role-based access control Â· Powered by Mosaic Wellness NPD
        </p>
      </div>
    </div>
  );
}
