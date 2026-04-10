import React, { useState, useRef } from 'react';
import { FOLDER_TREE, canEdit } from '../data/data';

export default function UploadModal({ user, currentFolder, onUpload, onClose }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderId, setFolderId] = useState(currentFolder?.id || '');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [version, setVersion] = useState('v1.0');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const editableFolders = FOLDER_TREE.flatMap(s => s.folders.filter(f => canEdit(user?.role, f)));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setSelectedFile(f);
  };

  const getFileType = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    const map = { pdf:'pdf', xlsx:'xlsx', xls:'xlsx', pptx:'pptx', ppt:'pptx', docx:'docx', doc:'docx', csv:'csv', png:'img', jpg:'img', jpeg:'img' };
    return map[ext] || 'pdf';
  };

  const handleSubmit = () => {
    if (!selectedFile || !folderId) return;
    setSubmitting(true);
    setTimeout(() => {
      const newFile = {
        id: 'f' + Date.now(),
        name: selectedFile.name.replace(/\.[^.]+$/, ''),
        type: getFileType(selectedFile.name),
        folderId,
        version,
        desc: desc || 'No description provided.',
        tags: tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString(),
        starred: false,
        size: selectedFile.size > 1024*1024 ? `${(selectedFile.size/(1024*1024)).toFixed(1)} MB` : `${(selectedFile.size/1024).toFixed(0)} KB`,
      };
      onUpload(newFile);
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', backdropFilter:'blur(6px)', zIndex:200 }} />
      <div className="anim-scale" style={{
        position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:'min(500px,90vw)', background:'var(--bg-card)',
        border:'1px solid var(--border)', borderRadius:22,
        boxShadow:'var(--shadow-lg)', zIndex:210, overflow:'hidden',
      }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h3 style={{ fontSize:17, fontWeight:800, color:'var(--text-primary)', margin:'0 0 3px' }}>Upload Document</h3>
            <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>Add a file to the NPD Library</p>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>Ã</button>
        </div>

        <div style={{ padding:'20px 24px', maxHeight:'70vh', overflowY:'auto' }}>
          {/* Drop zone */}
          <div
            className={`upload-zone ${dragOver ? 'dragging' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ padding:'32px 20px', textAlign:'center', cursor:'pointer', marginBottom:20 }}
          >
            <input ref={fileInputRef} type="file" style={{ display:'none' }} onChange={e => setSelectedFile(e.target.files[0])} />
            {selectedFile ? (
              <div>
                <div style={{ fontSize:36, marginBottom:8 }}>ð</div>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', marginBottom:4 }}>{selectedFile.name}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>{(selectedFile.size / 1024).toFixed(0)} KB</div>
                <button onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                  style={{ marginTop:10, padding:'4px 12px', borderRadius:7, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', fontSize:11, color:'var(--text-muted)' }}>
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize:36, marginBottom:10 }}>âï¸</div>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text-secondary)', marginBottom:4 }}>Drag & drop or click to browse</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>PDF, DOCX, XLSX, PPTX, CSV, Images</div>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Folder */}
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Destination Folder *</label>
              <select value={folderId} onChange={e => setFolderId(e.target.value)}
                style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-primary)', fontSize:13 }}>
                <option value="">Select folderâ¦</option>
                {FOLDER_TREE.map(s => (
                  <optgroup key={s.id} label={`${s.emoji} ${s.name}`}>
                    {s.folders.filter(f => canEdit(user?.role, f)).map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Version */}
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Version</label>
              <input value={version} onChange={e => setVersion(e.target.value)} placeholder="e.g. v1.0"
                style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-primary)', fontSize:13 }} />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description of this documentâ¦" rows={3}
                style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-primary)', fontSize:13, resize:'vertical' }} />
            </div>

            {/* Tags */}
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Tags <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(comma-separated)</span></label>
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. stability, q2, ashwagandha"
                style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-primary)', fontSize:13 }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'11px', borderRadius:12, border:'1px solid var(--border)', background:'var(--bg-surface)', cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!selectedFile || !folderId || submitting}
            className="btn-glow"
            style={{ flex:2, padding:'11px', borderRadius:12, border:'none', cursor: selectedFile && folderId ? 'pointer' : 'not-allowed', color:'white', fontSize:13, fontWeight:700, opacity: selectedFile && folderId ? 1 : .5 }}>
            {submitting ? 'â³ Uploadingâ¦' : 'â Upload Document'}
          </button>
        </div>
      </div>
    </>
  );
}
