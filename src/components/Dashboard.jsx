import { useMemo, useState, useRef } from 'react';
import { FOLDER_TREE, ROLE_META, canView, getParentSection, fileTypeColor, fileTypeLabel, fileTypeClass, formatDate } from '../data/data';

function StatCard({ emoji, label, value, sub, color }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  return (
    <div ref={ref} className="card-3d"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        background:'var(--bg-card)', border:'1px solid var(--border)',
        borderRadius:18, padding:'20px 22px',
        transform:`perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        boxShadow:`var(--shadow-md), 0 0 0 1px ${color}22`,
        borderTop:`3px solid ${color}`,
      }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ fontSize:28, lineHeight:1 }}>{emoji}</div>
        <div style={{ fontSize:10, fontWeight:700, color, background:`${color}18`, padding:'3px 8px', borderRadius:6 }}>{sub}</div>
      </div>
      <div style={{ fontSize:30, fontWeight:900, color:'var(--text-primary)', lineHeight:1, marginBottom:6 }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500 }}>{label}</div>
    </div>
  );
}

export default function Dashboard({ user, files, users, onFolderClick }) {
  const rm = ROLE_META[user?.role] || {};

  const stats = useMemo(() => {
    const starred = files.filter(f => f.starred).length;
    const types = [...new Set(files.map(f => f.type))].length;
    const recentCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recent = files.filter(f => new Date(f.uploadedAt) > recentCutoff).length;
    return { total: files.length, starred, types, recent };
  }, [files]);

  const accessibleSections = FOLDER_TREE.filter(s =>
    s.folders.some(f => canView(user?.role, f))
  );

  const recentFiles = [...files].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 6);

  return (
    <div style={{ padding:28 }}>
      {/* Hero banner */}
      <div className="anim-gradient" style={{
        borderRadius:20, padding:'28px 32px', marginBottom:28,
        background:'linear-gradient(135deg,#0f2210,#0a1a1f,#12100e)',
        backgroundSize:'300% 300%',
        border:'1px solid rgba(74,222,128,.2)',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(22,163,74,.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:100, width:140, height:140, borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,.15) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(74,222,128,.7)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>
              {rm.emoji} {rm.label} Access
            </div>
            <h2 style={{ fontSize:26, fontWeight:900, color:'#eef4ff', margin:'0 0 8px', letterSpacing:'-0.5px' }}>
              Welcome back, {user?.name?.split(' ')[0]} ð
            </h2>
            <p style={{ fontSize:13, color:'rgba(238,244,255,.5)', margin:0 }}>
              You have access to <strong style={{ color:'#4ade80' }}>{stats.total}</strong> documents across the NPD Library.
            </p>
          </div>
          <div style={{ display:'flex', gap:16, flexShrink:0 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'#4ade80', lineHeight:1 }}>{stats.total}</div>
              <div style={{ fontSize:10, color:'rgba(238,244,255,.4)', marginTop:2 }}>Total Docs</div>
            </div>
            <div style={{ width:1, background:'rgba(255,255,255,.1)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'#fbbf24', lineHeight:1 }}>{stats.starred}</div>
              <div style={{ fontSize:10, color:'rgba(238,244,255,.4)', marginTop:2 }}>Starred</div>
            </div>
            <div style={{ width:1, background:'rgba(255,255,255,.1)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'#60a5fa', lineHeight:1 }}>{stats.recent}</div>
              <div style={{ fontSize:10, color:'rgba(238,244,255,.4)', marginTop:2 }}>This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16, marginBottom:28 }}>
        <StatCard emoji="ð" label="Documents Accessible" value={stats.total} sub="Active" color="#16a34a" />
        <StatCard emoji="â­" label="Starred Documents" value={stats.starred} sub="Favourites" color="#f59e0b" />
        <StatCard emoji="ðï¸" label="File Types" value={stats.types} sub="Formats" color="#6366f1" />
        <StatCard emoji="ð" label="Added This Week" value={stats.recent} sub="Recent" color="#0891b2" />
      </div>

      {/* Quick access sections */}
      <div style={{ marginBottom:28 }}>
        <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', margin:'0 0 14px' }}>Quick Access</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:12 }}>
          {accessibleSections.map(section => {
            const accessFolders = section.folders.filter(f => canView(user?.role, f));
            const docCount = files.filter(f => accessFolders.some(af => af.id === f.folderId)).length;

            return (
              <button key={section.id}
                onClick={() => onFolderClick(accessFolders[0])}
                style={{
                  display:'flex', alignItems:'center', gap:14, padding:'16px 18px',
                  borderRadius:16, border:`1px solid ${section.color}33`,
                  background:`${section.color}0d`, cursor:'pointer',
                  textAlign:'left', transition:'all var(--transition)',
                  boxShadow:`0 2px 12px ${section.color}0a`,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${section.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 2px 12px ${section.color}0a`; }}
              >
                <div style={{ fontSize:26, lineHeight:1 }}>{section.emoji}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{section.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{accessFolders.length} folders Â· {docCount} docs</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent files */}
      <div>
        <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', margin:'0 0 14px' }}>Recently Added</h3>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
          <table className="tbl" style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left' }}>Document</th>
                <th style={{ textAlign:'left' }}>Type</th>
                <th style={{ textAlign:'left' }}>Folder</th>
                <th style={{ textAlign:'left' }}>Added</th>
              </tr>
            </thead>
            <tbody>
              {recentFiles.map(f => {
                const parent = getParentSection(f.folderId);
                const color = fileTypeColor(f.type);
                const uploader = users.find(u => u.id === f.uploadedBy);
                return (
                  <tr key={f.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:18 }}>{fileTypeClass(f.type)}</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{f.name}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{uploader?.name} Â· {f.version}</div>
                        </div>
                        {f.starred && <span style={{ fontSize:12, color:'#f59e0b' }}>â</span>}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize:10, fontWeight:700, color, background:`${color}18`, padding:'3px 8px', borderRadius:6 }}>
                        {fileTypeLabel(f.type)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize:11, color:'var(--text-muted)' }}>
                        {parent?.emoji} {parent?.name}
                      </span>
                    </td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{formatDate(f.uploadedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
