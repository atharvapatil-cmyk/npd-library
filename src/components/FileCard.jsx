import { useState, useRef } from 'react';
import { fileTypeColor, fileTypeLabel, fileTypeClass, formatDate } from '../data/data';

export default function FileCard({ file, user, users, onClick }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const color = fileTypeColor(file.type);
  const uploader = users.find(u => u.id === file.uploadedBy);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  return (
    <div ref={ref} className="card-3d"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={onClick}
      style={{
        background:'var(--bg-card)', border:'1px solid var(--border)',
        borderRadius:16, padding:'18px', cursor:'pointer',
        transform:`perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        boxShadow:'var(--shadow-sm)',
        transition:'box-shadow .15s ease, transform .15s ease',
        position:'relative', overflow:'hidden',
        borderTop:`3px solid ${color}`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow=`var(--shadow-md), 0 0 0 1px ${color}33`}
      onMouseLeave={e => e.currentTarget.style.boxShadow='var(--shadow-sm)'}
    >
      {/* Type icon */}
      <div style={{ fontSize:32, lineHeight:1, marginBottom:12 }}>{fileTypeClass(file.type)}</div>

      {/* Badges */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10, flexWrap:'wrap' }}>
        <span style={{ fontSize:10, fontWeight:700, color, background:`${color}18`, padding:'3px 7px', borderRadius:6 }}>
          {fileTypeLabel(file.type)}
        </span>
        <span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', background:'var(--bg-surface)', padding:'3px 7px', borderRadius:6 }}>
          {file.version}
        </span>
        {file.starred && (
          <span style={{ marginLeft:'auto', fontSize:14, color:'#f59e0b' }}>â</span>
        )}
      </div>

      {/* Name */}
      <div style={{
        fontSize:13, fontWeight:700, color:'var(--text-primary)', lineHeight:1.4,
        marginBottom:8, overflow:'hidden', display:'-webkit-box',
        WebkitLineClamp:2, WebkitBoxOrient:'vertical',
      }}>
        {file.name}
      </div>

      {/* Description */}
      <div style={{
        fontSize:11, color:'var(--text-muted)', lineHeight:1.5, marginBottom:12,
        overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
      }}>
        {file.desc}
      </div>

      {/* Tags */}
      {file.tags.length > 0 && (
        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
          {file.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize:10, padding:'2px 7px', borderRadius:5,
              background:'var(--bg-surface)', color:'var(--text-muted)', fontWeight:500,
            }}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:10, borderTop:'1px solid var(--border)' }}>
        <div style={{
          width:22, height:22, borderRadius:6, flexShrink:0,
          background:'linear-gradient(135deg,#16a34acc,#16a34a66)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:8, fontWeight:800, color:'white',
        }}>{uploader?.avatar}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{uploader?.name}</div>
        </div>
        <div style={{ fontSize:10, color:'var(--text-muted)', flexShrink:0 }}>{formatDate(file.uploadedAt)}</div>
      </div>

      {/* Size badge */}
      <div style={{ position:'absolute', top:12, right:14, fontSize:10, color:'var(--text-muted)' }}>
        {file.size}
      </div>
    </div>
  );
}
