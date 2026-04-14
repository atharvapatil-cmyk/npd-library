import { useState, useRef } from 'react';
import { canView, canEdit } from '../data/data.js';

function FileTypeIcon({ name, size = 22 }) {
  const ext = (name || '').split('.').pop().toLowerCase();
  const cfg = {
    pdf:  { c: '#ef4444', l: 'PDF' },
    docx: { c: '#3b82f6', l: 'DOC' },
    doc:  { c: '#3b82f6', l: 'DOC' },
    xlsx: { c: '#22c55e', l: 'XLS' },
    xls:  { c: '#22c55e', l: 'XLS' },
    pptx: { c: '#f97316', l: 'PPT' },
    png:  { c: '#a855f7', l: 'IMG' },
    jpg:  { c: '#a855f7', l: 'IMG' },
  }[ext] || { c: '#6b7280', l: ext.toUpperCase().slice(0,3) || 'FILE' };

  return (
    <svg width={size} height={Math.round(size*1.2)} viewBox="0 0 20 24" fill="none">
      <path d="M3 3C3 1.9 3.9 1 5 1H13L19 7V21C19 22.1 18.1 23 17 23H5C3.9 23 3 22.1 3 21V3Z" fill={cfg.c+'18'} stroke={cfg.c} strokeWidth="1.4"/>
      <path d="M13 1V7H19" stroke={cfg.c} strokeWidth="1.4" strokeLinejoin="round"/>
      <text x="11" y="17" textAnchor="middle" fill={cfg.c} fontSize="4.8" fontWeight="800" fontFamily="system-ui,sans-serif">{cfg.l}</text>
    </svg>
  );
}

function FolderCard3D({ folder, section, onClick }) {
  const ref = useRef();
  const [tilt, setTilt] = useState('');
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
    setTilt(`perspective(500px) rotateY(${x}deg) rotateX(${y}deg) translateZ(4px)`);
  };
  const onLeave = () => setTilt('');
  const color = section.color || '#16a34a';
  const fileCount = (folder.files || []).length;

  return (
    <button
      ref={ref}
      className="folder-card"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform: tilt, transition: tilt ? 'none' : 'all 0.35s cubic-bezier(.23,1,.32,1)', '--fc': color }}
    >
      <div className="folder-card-shine"/>
      <div className="folder-card-icon">
        <svg width="40" height="34" viewBox="0 0 44 36" fill="none">
          <path d="M2 9C2 7.3 3.3 6 5 6H16L19.5 9H39C40.7 9 42 10.3 42 12V30C42 31.7 40.7 33 39 33H5C3.3 33 2 31.7 2 30V9Z" fill={color+'20'} stroke={color} strokeWidth="1.8"/>
          <path d="M2 14H42" stroke={color+'60'} strokeWidth="1"/>
        </svg>
      </div>
      <div className="folder-card-name">{folder.name}</div>
      <div className="folder-card-desc">{folder.desc ? folder.desc.slice(0,55) + (folder.desc.length > 55 ? '...' : '') : ''}</div>
      <div className="folder-card-footer">
        <span className="folder-file-pill" style={{ background: color+'18', color }}>
          {fileCount} file{fileCount !== 1 ? 's' : ''}
        </span>
      </div>
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function AddFileModal({ folder, section, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('pdf');
  const [tags, setTags] = useState('');
  const fileRef = useRef();

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: 'f' + Date.now(),
      name: name.trim().endsWith('.' + type) ? name.trim() : name.trim() + '.' + type,
      type,
      size: '--',
      modified: new Date().toISOString().slice(0, 10),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div className="modal-title">
            <span style={{marginRight:'8px', fontSize:'16px'}}>+</span> Add File
            <span className="modal-title-sub"> &middot; {folder?.name}</span>
          </div>
          <button className="modal-x" onClick={onClose}><CloseIcon /></button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <label className="modal-label">File Name</label>
          <input className="modal-input" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Formulation Study v2" autoFocus/>

          <label className="modal-label">File Type</label>
          <select className="modal-input" value={type} onChange={e => setType(e.target.value)}>
            <option value="pdf">PDF Document</option>
            <option value="docx">Word Document (.docx)</option>
            <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
            <option value="pptx">PowerPoint (.pptx)</option>
          </select>

          <label className="modal-label">Tags <span style={{color:'#9ca3af',fontWeight:400}}>(comma separated)</span></label>
          <input className="modal-input" value={tags} onChange={e => setTags(e.target.value)}
            placeholder="e.g. formulation, trial, batch"/>

          <div
            className="modal-dropzone"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) setName(f.name.replace(/\.[^.]+$/, ''));
            }}
          >
            <input ref={fileRef} type="file" hidden onChange={e => {
              if (e.target.files[0]) setName(e.target.files[0].name.replace(/\.[^.]+$/, ''));
            }}/>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{marginBottom:'8px'}}>
              <rect x="4" y="2" width="18" height="24" rx="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
              <path d="M14 2V9H22" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 14H18M8 18H14" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <div className="modal-dropzone-text">Click to browse or drag &amp; drop a file</div>
            <div className="modal-dropzone-sub">File name will be auto-filled</div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Add File</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddFolderModal({ section, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: section.id + '-' + Date.now(),
      name: name.trim(), desc: desc.trim(), files: [],
      access: { admin: 3, nutra_lead: 1, pc_lead: 1, reg_lead: 1, pmo: 1, rd_member: 1 },
    });
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div className="modal-title">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{marginRight:'7px',verticalAlign:'middle'}}>
              <path d="M1.5 4C1.5 3.2 2.2 2.5 3 2.5H7L8.5 4H13C13.8 4 14.5 4.7 14.5 5.5V12C14.5 12.8 13.8 13.5 13 13.5H3C2.2 13.5 1.5 12.8 1.5 12V4Z" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            New Folder <span className="modal-title-sub">&middot; {section?.name}</span>
          </div>
          <button className="modal-x" onClick={onClose}><CloseIcon /></button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <label className="modal-label">Folder Name</label>
          <input className="modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Clinical Studies" autoFocus/>
          <label className="modal-label">Description <span style={{color:'#9ca3af',fontWeight:400}}>(optional)</span></label>
          <input className="modal-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description of this folder's contents"/>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Create Folder</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileDetailModal({ file, section, folder, canEditFolder, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box file-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div className="modal-title" style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <FileTypeIcon name={file.name} size={18}/>
            <span style={{ fontSize:'14px' }}>{file.name}</span>
          </div>
          <button className="modal-x" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body">
          <div className="file-detail-grid">
            {[
              ['Section', section?.name],
              ['Folder',  folder?.name],
              ['Size',    file.size],
              ['Modified',file.modified],
            ].filter(([,v]) => v).map(([k, v]) => (
              <div key={k} className="file-detail-row">
                <span className="file-detail-label">{k}</span>
                <span className="file-detail-val">{v}</span>
              </div>
            ))}
            {(file.tags || []).length > 0 && (
              <div className="file-detail-row">
                <span className="file-detail-label">Tags</span>
                <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                  {file.tags.map(t => <span key={t} className="file-tag">#{t}</span>)}
                </div>
              </div>
            )}
          </div>
          <div className="modal-actions" style={{ marginTop:'20px' }}>
            <button className="btn btn-primary">Open File</button>
            {canEditFolder && <button className="btn btn-ghost">Download</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FileExplorer({
  section, sections, currentUser, accessMatrix,
  activeFolder, onFolderClick, onBack, onAddFolder,
}) {
  const [showAddFile,   setShowAddFile]   = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [localFiles,    setLocalFiles]    = useState({});
  const [localFolders,  setLocalFolders]  = useState([]);
  const [selectedFile,  setSelectedFile]  = useState(null);

  if (!section) {
    return (
      <div className="explorer-empty">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{marginBottom:'14px',opacity:0.4}}>
          <path d="M6 14C6 11.8 7.8 10 10 10H22L27 14H44C46.2 14 48 15.8 48 18V40C48 42.2 46.2 44 44 44H10C7.8 44 6 42.2 6 40V14Z" stroke="#9ca3af" strokeWidth="2"/>
        </svg>
        <p>Pick a section from the nav to start browsing.</p>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const allFolders = [
    ...(section.folders || []).filter(f => canView(currentUser.id, f.id, accessMatrix) || isAdmin),
    ...localFolders,
  ];

  const handleNewFolder = (f) => {
    setLocalFolders(p => [...p, f]);
    if (onAddFolder) onAddFolder(f);
  };

  const handleNewFile = (f) => {
    if (!activeFolder) return;
    setLocalFiles(p => ({ ...p, [activeFolder.id]: [...(p[activeFolder.id] || []), f] }));
  };

  if (!activeFolder) {
    return (
      <div className="file-explorer">
        <div className="explorer-header">
          <div className="explorer-breadcrumb">
            <span className="explorer-section-name" style={{ color: section.color }}>{section.name}</span>
            <span className="explorer-sep"> / </span>
            <span className="explorer-crumb-dim">Folders</span>
          </div>
          <div className="explorer-actions">
            {isAdmin && (
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddFolder(true)}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{marginRight:'5px'}}>
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                New Folder
              </button>
            )}
            <span className="explorer-count">{allFolders.length} folder{allFolders.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {allFolders.length === 0 ? (
          <div className="explorer-empty">
            <svg width="48" height="48" viewBox="0 0 52 52" fill="none" style={{marginBottom:'12px',opacity:0.35}}>
              <path d="M6 14C6 11.8 7.8 10 10 10H22L27 14H44C46.2 14 48 15.8 48 18V40C48 42.2 46.2 44 44 44H10C7.8 44 6 42.2 6 40V14Z" stroke="#9ca3af" strokeWidth="2"/>
            </svg>
            <p>No folders accessible here.</p>
            {isAdmin && <button className="btn btn-primary" style={{marginTop:'12px'}} onClick={() => setShowAddFolder(true)}>Create First Folder</button>}
          </div>
        ) : (
          <div className="folder-grid">
            {allFolders.map(f => (
              <FolderCard3D key={f.id} folder={f} section={section} onClick={() => onFolderClick(f)} />
            ))}
            {isAdmin && (
              <button className="folder-card folder-card-ghost" onClick={() => setShowAddFolder(true)}>
                <div style={{ fontSize:'28px', marginBottom:'8px', color:'var(--text-muted)' }}>+</div>
                <div className="folder-card-name" style={{ color:'var(--text-muted)' }}>New Folder</div>
              </button>
            )}
          </div>
        )}

        {showAddFolder && <AddFolderModal section={section} onClose={() => setShowAddFolder(false)} onAdd={handleNewFolder}/>}
      </div>
    );
  }

  const folder = activeFolder;
  const canEditFolder = canEdit(currentUser.id, folder.id, accessMatrix) || isAdmin;
  const files = [...(folder.files || []), ...(localFiles[folder.id] || [])];

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <div className="explorer-breadcrumb">
          <button className="breadcrumb-link" onClick={onBack}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{marginRight:'4px',verticalAlign:'middle'}}>
              <path d="M9 3L4.5 7L9 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {section.name}
          </button>
          <span className="explorer-sep"> / </span>
          <span className="explorer-crumb-active">{folder.name}</span>
        </div>
        <div className="explorer-actions">
          {canEditFolder && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddFile(true)}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{marginRight:'5px'}}>
                <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
              Add File
            </button>
          )}
        </div>
      </div>

      {folder.desc && (
        <div className="folder-desc-bar">{folder.desc}</div>
      )}

      {files.length === 0 ? (
        <div className="explorer-empty">
          <svg width="44" height="44" viewBox="0 0 44 52" fill="none" style={{marginBottom:'12px',opacity:0.35}}>
            <path d="M5 5C5 3.3 6.3 2 8 2H28L40 14V46C40 47.7 38.7 49 37 49H8C6.3 49 5 47.7 5 46V5Z" stroke="#9ca3af" strokeWidth="2"/>
            <path d="M28 2V14H40" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <p>No files in this folder yet.</p>
          {canEditFolder && (
            <button className="btn btn-primary" style={{marginTop:'12px'}} onClick={() => setShowAddFile(true)}>
              Add First File
            </button>
          )}
        </div>
      ) : (
        <div className="file-grid">
          {files.map((file, i) => (
            <div
              key={file.id || i}
              className="file-grid-card"
              onClick={() => setSelectedFile(file)}
            >
              <div className="file-gc-top">
                <FileTypeIcon name={file.name} size={24}/>
                <div className="file-gc-btns" onClick={e => e.stopPropagation()}>
                  <button className="file-action-btn" title="View" onClick={() => setSelectedFile(file)}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M1 7C1 7 3.5 3 7 3C10.5 3 13 7 13 7C13 7 10.5 11 7 11C3.5 11 1 7 1 7Z" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  </button>
                  <button className="file-action-btn" title="Download">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1V9M7 9L4.5 6.5M7 9L9.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="file-gc-name">{file.name}</div>
              {(file.tags || []).length > 0 && (
                <div className="file-gc-tags">
                  {file.tags.slice(0, 3).map(t => <span key={t} className="file-tag">#{t}</span>)}
                </div>
              )}
              <div className="file-gc-meta">
                {file.size && file.size !== '--' && <span>{file.size}</span>}
                {file.modified && <span>{file.modified}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddFile && (
        <AddFileModal folder={folder} section={section} onClose={() => setShowAddFile(false)} onAdd={handleNewFile}/>
      )}
      {selectedFile && (
        <FileDetailModal
          file={selectedFile} section={section} folder={folder}
          canEditFolder={canEditFolder} onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}
