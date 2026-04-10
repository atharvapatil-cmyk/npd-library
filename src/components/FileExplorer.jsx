import React, { useState, useMemo } from 'react';
import { canEdit, getParentSection, fileTypeColor, fileTypeLabel, formatDate } from '../data/data';
import FileCard from './FileCard';

export default function FileExplorer({ user, currentFolder, files, users, onUploadClick, onFileClick }) {
  const [view, setView] = useState('grid'); // grid | list
  const [typeFilter, setTypeFilter] = useState('all');
  const [sort, setSort] = useState('date_desc');

  const folderFiles = files.filter(f => f.folderId === currentFolder.id);

  const types = useMemo(() => ['all', ...new Set(folderFiles.map(f => f.type))], [folderFiles]);

  const displayed = useMemo(() => {
    let f = typeFilter === 'all' ? folderFiles : folderFiles.filter(f => f.type === typeFilter);
    return [...f].sort((a, b) => {
      if (sort === 'date_desc') return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      if (sort === 'date_asc')  return new Date(a.uploadedAt) - new Date(b.uploadedAt);
      if (sort === 'name_asc')  return a.name.localeCompare(b.name);
      if (sort === 'name_desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [folderFiles, typeFilter, sort]);

  const parent = getParentSection(currentFolder.id);
  const canUp = canEdit(user?.role, currentFolder);

  return (
    <div style={{ padding:28 }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6, fontSize:12, color:'var(--text-muted)' }}>
        <span style={{ cursor:'pointer', color:'var(--accent)', fontWeight:600 }} onClick={() => {}}>Dashboard</span>
        <span>âº</span>
        <span>{parent?.emoji} {parent?.name}</span>
        <span>âº</span>
        <span style={{ color:'var(--text-primary)', fontWeight:700 }}>{currentFolder.name}</span>
      </div>

      {/* Folder header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
        <div style={{
          width:48, height:48, borderRadius:14,
          background:`${parent?.color || '#16a34a'}18`,
          border:`1px solid ${parent?.color || '#16a34a'}33`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
        }}>{parent?.emoji}</div>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:'var(--text-primary)', margin:'0 0 4px' }}>{currentFolder.name}</h2>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>{folderFiles.length} documents</span>
            <span style={{
              fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:6,
              background: canUp ? '#dcfce7' : '#fee2e2',
              color: canUp ? '#16a34a' : '#dc2626',
            }}>{canUp ? 'âï¸ Edit Access' : 'ð View Only'}</span>
          </div>
        </div>
        {canUp && (
          <button className="btn-glow" onClick={onUploadClick}
            style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:12, border:'none', cursor:'pointer', color:'white', fontSize:13, fontWeight:700 }}>
            <span style={{ fontSize:16 }}>â</span> Upload File
          </button>
        )}
      </div>

      {/* Action bar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        {/* Type filter */}
        <div style={{ display:'flex', gap:6 }}>
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{
                padding:'5px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:700,
                background: typeFilter === t ? 'var(--accent)' : 'var(--bg-surface)',
                color: typeFilter === t ? 'white' : 'var(--text-muted)',
                transition:'all .15s',
              }}
            >{t === 'all' ? 'All' : fileTypeLabel(t)}</button>
          ))}
        </div>

        <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding:'5px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-secondary)', fontSize:12, cursor:'pointer' }}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="name_asc">Name AâZ</option>
            <option value="name_desc">Name ZâA</option>
          </select>
          {/* View toggle */}
          <div style={{ display:'flex', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden' }}>
            {['grid','list'].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding:'5px 10px', border:'none', cursor:'pointer', fontSize:13, background: view === v ? 'var(--accent)' : 'var(--bg-surface)', color: view === v ? 'white' : 'var(--text-muted)', transition:'all .15s' }}>
                {v === 'grid' ? 'â¦' : 'â°'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {displayed.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>ð­</div>
          <div style={{ fontSize:16, fontWeight:700, color:'var(--text-secondary)', marginBottom:8 }}>No documents yet</div>
          <div style={{ fontSize:13 }}>{canUp ? 'Be the first to upload a file here.' : 'No files available in this folder.'}</div>
        </div>
      )}

      {/* Grid view */}
      {view === 'grid' && displayed.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:16 }}>
          {displayed.map((f, i) => (
            <div key={f.id} className="anim-fade-up" style={{ animationDelay:`${i * 40}ms` }}>
              <FileCard file={f} user={user} users={users} onClick={() => onFileClick(f)} />
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && displayed.length > 0 && (
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
          <table className="tbl" style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left' }}>Document</th>
                <th style={{ textAlign:'left' }}>Type</th>
                <th style={{ textAlign:'left' }}>Version</th>
                <th style={{ textAlign:'left' }}>Size</th>
                <th style={{ textAlign:'left' }}>Uploaded By</th>
                <th style={{ textAlign:'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(f => {
                const color = fileTypeColor(f.type);
                const uploader = users.find(u => u.id === f.uploadedBy);
                return (
                  <tr key={f.id} onClick={() => onFileClick(f)} style={{ cursor:'pointer' }}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:18 }}>ð</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{f.name}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:280 }}>{f.desc}</div>
                        </div>
                        {f.starred && <span style={{ fontSize:12, color:'#f59e0b' }}>â</span>}
                      </div>
                    </td>
                    <td><span style={{ fontSize:10, fontWeight:700, color, background:`${color}18`, padding:'3px 8px', borderRadius:6 }}>{fileTypeLabel(f.type)}</span></td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{f.version}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{f.size}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:22, height:22, borderRadius:6, background:'linear-gradient(135deg,#16a34acc,#16a34a55)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:800, color:'white' }}>{uploader?.avatar}</div>
                        <span style={{ fontSize:11, color:'var(--text-secondary)' }}>{uploader?.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{formatDate(f.uploadedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
