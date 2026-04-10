import { useEffect } from 'react';
import { canEdit, getFolderById, getParentSection, fileTypeColor, fileTypeLabel, fileTypeClass, formatDate, ROLE_META } from '../data/data';

export default function FileDetail({ file, user, users, onClose, onDelete, onToggleStar }) {
  const folder = getFolderById(file.folderId);
  const parent = getParentSection(file.folderId);
  const uploader = users.find(u => u.id === file.uploadedBy);
  const color = fileTypeColor(file.type);
  const canDel = canEdit(user?.role, folder);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const fakeVersions = [
    { version: file.version, date: file.uploadedAt, by: uploader?.name, note: 'Current version' },
    { version: 'v1.0', date: new Date(new Date(file.uploadedAt).getTime() - 14 * 86400000).toISOString(), by: uploader?.name, note: 'Initial upload' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', zIndex:150 }} />

      {/* Panel */}
      <div className="anim-slide-r" style={{
        position:'fixed', top:0, right:0, bottom:0, width:420,
        background:'var(--bg-card)', borderLeft:'1px solid var(--border)',
        zIndex:160, display:'flex', flexDirection:'column',
        boxShadow:'-12px 0 40px rgba(0,0,0,.15)',
      }}>
        {/* Header */}
        <div style={{ padding:'20px 22px', borderBottom:'1px solid var(--border)', borderTop:`4px solid ${color}` }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
              <span style={{ fontSize:32, lineHeight:1, flexShrink:0 }}>{fileTypeClass(file.type)}</span>
              <div>
                <h3 style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', margin:'0 0 6px', lineHeight:1.3 }}>{file.name}</h3>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <span style={{ fontSize:10, fontWeight:700, color, background:`${color}18`, padding:'3px 8px', borderRadius:6 }}>{fileTypeLabel(file.type)}</span>
                  <span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', background:'var(--bg-surface)', padding:'3px 8px', borderRadius:6 }}>{file.version}</span>
                  <span style={{ fontSize:10, color:'var(--text-muted)', background:'var(--bg-surface)', padding:'3px 8px', borderRadius:6 }}>{file.size}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--text-muted)' }}>Ã</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 22px' }}>
          {/* Description */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.7px', textTransform:'uppercase', marginBottom:8 }}>Description</div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, margin:0 }}>{file.desc}</p>
          </div>

          {/* Tags */}
          {file.tags.length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.7px', textTransform:'uppercase', marginBottom:8 }}>Tags</div>
              <div style={{ display:'flex', gap:6, flewWrap:'wrap' }}>
                {file.tags.map(tag => (
                  <span key={tag} style={{ fontSize:11, padding:'3px 10px', borderRadius:7, background:'var(--bg-surface)', color:'var(--text-secondary)', border:'1px solid var(--border)' }}>#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div style={{ marginBottom:20, padding:14, borderRadius:12, background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.7px', textTransform:'uppercase', marginBottom:10 }}>Location</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
              <span style={{ fontSize:18 }}>{parent?.emoji}</span>
              <span style={{ color:'var(--text-secondary)', fontWeight:600 }}>{parent?.name}</span>
              <span style={{ color:'var(--text-muted)' }}>âº</span>
              <span style={{ color:'var(--text-primary)', fontWeight:700 }}>{folder?.name}</span>
            </div>
          </div>

          {/* Uploader */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.7px', textTransform:'uppercase', marginBottom:10 }}>Uploaded By</div>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderRadius:12, background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#16a34acc,#16a34a66)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'white' }}>{uploader?.avatar}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{uploader?.name}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{uploader?.email}</div>
                <div style={{ fontSize:11, color:ROLE_META[uploader?.role]?.color, fontWeight:600, marginTop:1 }}>{ROLE_META[uploader?.role]?.label}</div>
              </div>
              <div style={{ marginLeft:'auto', textAlign:'right' }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>Uploaded</div>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>{formatDate(file.uploadedAt)}</div>
              </div>
            </div>
          </div>

          {/* Access */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.7px', textTransform:'uppercase', marginBottom:10 }}>Access Control</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div style={{ padding:12, borderRadius:10, background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#16a34a', marginBottom:6 }}>ð CAN VIEW</div>
                {folder?.viewRoles.map(r => (
                  <div key={r} style={{ fontSize:10, color:'#166534', marginBottom:2 }}>â¢ {ROLE_META[r]?.label}</div>
                ))}
              </div>
              <div style={{ padding:12, borderRadius:10, background:'#eff6ff', border:'1px solid #bfdbfe' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#2563eb', marginBottom:6 }}>âï¸ CAN EDIT</div>
                {folder?.editRoles.map(r => (
                  <div key={r} style={{ fontSize:10, color:'#1e40af', marginBottom:2 }}>â¢ {ROLE_META[r]?.label}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Version history */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.7px', textTransform:'uppercase', marginBottom:10 }}>Version History</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {fakeVersions.map((v, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
                  <div style={{ width:28, height:28, borderRadius:8, background: i === 0 ? 'var(--accent)' : 'var(--bg-hover)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color: i === 0 ? 'white' : 'var(--text-muted)' }}>{v.version}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)' }}>{v.note}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{v.by} Â· {formatDate(v.date)}</div>
                  </div>
                  {i === 0 && <span style={{ fontSize:10, fontWeight:700, color:'var(--accent)', background:'var(--accent-light)', padding:'2px 7px', borderRadius:5 }}>Current</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding:'16px 22px', borderTop:'1px solid var(--border)', display:'flex', gap:8 }}>
          <button onClick={() => onToggleStar(file.id)}
            style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', fontSize:14, fontWeight:700, color: file.starred ? '#f59e0b' : 'var(--text-muted)', transition:'all .15s' }}>
            {file.starred ? 'â Starred' : 'â Star'}
          </button>
          <button style={{ flex:2, padding:'10px', borderRadius:10, border:'none', background:'var(--accent)', cursor:'pointer', fontSize:13, fontWeight:700, color:'white' }}>
            â Download
          </button>
          {canDel && (
            <button onClick={() => onDelete(file.id)}
              style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid #fecaca', background:'#fef2f2', cursor:'pointer', fontSize:13, fontWeight:700, color:'#dc2626', transition:'all .15s' }}>
              ð Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
}
