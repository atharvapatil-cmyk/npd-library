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
    2 </div>
      <div className="folder-card-name">{folder.name}</div>
      <div className="folder-card-desc">{folder.desc ? folder.desc.slice(0,55) + (folder.desc.length > 55 ? 'â¦' : '') : ''}</div>
      <div className="folder-card-footer">
        <span className="folder-file-pill" style={{ background: color+'18', color }}>
          {fileCount} file{fileCount !== 1 ? 's' : ''}
        </span>
      </div>
    </button>
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
      size: 'â',
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
            <span style={{marginRight:'8px'}}>â</span> Add File
            <span className="modal-title-sub"> Â· {folder?.name}</span>
          </div>
          <button className="modal-x" onClick={onClose}>â</button>
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
            <div style={{ fontSize:'28px', marginBottom:'6px' }}>ð</div>
            <div className="modal-dropzone-text">Click to browse or drag & drop a file</div>
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
          <div className="modal-title">ð New Folder <span className="modal-title-sub">Â· {section?.name}</span></div>
          <button className="modal-x" onClick={onClose}>â</button>
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
          <button className="modal-x" onClick={onClose}>â</button>
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
            <button className="btn btn-primary">ð Open File</button>
            {canEditFolder && <button className="btn btn-ghost">â¬ Download</button>}
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
        <div style={{ fontSize:'52px', marginBottom:'14px' }}>ð</div>
        <p>Pick a section from the sidebar to start browsing.</p>
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

  // ââ FOLDER GRID ââ
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
       Ù]Ù]Ø[Û\Ë[ÝOOHÈ
]Û\ÜÓ[YOH^Ü\Y[\H]Ý[O^ÞÈÛÚ^NÍ	ËX\Ú[ÝÛNÌL	È_O¼'åà»î#ÏÙ]ÈÛ\ÈXØÙ\ÜÚXH\KÜÚ\ÐYZ[	]ÛÛ\ÜÓ[YOH\[X\HÝ[O^ÞÛX\Ú[ÜÌL	ß_HÛÛXÚÏ^Ê
HOÙ]ÚÝÐYÛ\YJ_OÜX]H\ÝÛ\Ø]ÛBÙ]
H
]Û\ÜÓ[YOHÛ\YÜYØ[Û\ËX\
O
Û\Ø\ÑÙ^O^ÙYHÛ\^ÙHÙXÝ[Û^ÜÙXÝ[ÛHÛÛXÚÏ^Ê
HOÛÛ\ÛXÚÊ_HÏ
J_BÚ\ÐYZ[	
]ÛÛ\ÜÓ[YOHÛ\XØ\Û\XØ\YÚÜÝÛÛXÚÏ^Ê
HOÙ]ÚÝÐYÛ\YJ_O]Ý[O^ÞÈÛÚ^NÌ	ËX\Ú[ÝÛNÎ	ËÛÛÜÝ\K]^[]]Y
IÈ_OÏÙ]]Û\ÜÓ[YOHÛ\XØ\[[YHÝ[O^ÞÈÛÛÜÝ\K]^[]]Y
IÈ_O]ÈÛ\Ù]Ø]Û
_BÙ]
_BÜÚÝÐYÛ\	YÛ\[Ù[ÙXÝ[Û^ÜÙXÝ[ÛHÛÛÜÙO^Ê
HOÙ]ÚÝÐYÛ\[ÙJ_HÛY^Ú[S]ÑÛ\KÏBÂöFcà¢°¢Ð ¢òò)H)HdÄRu$B)H)H ¢6öç7BföÆFW"Ò7FfTföÆFW#°¢6öç7B6äVFDföÆFW"Ò6äVFB7W'&VçEW6W"æBÂföÆFW"æBÂ66W74ÖG&ÇÂ4FÖã°¢6öç7BfÆW2Ò²âââföÆFW"æfÆW2ÇÂµÒÂâââÆö6ÄfÆW5¶föÆFW"æEÒÇÂµÒÓ° ¢&WGW&â¢ÆFb6Æ74æÖSÒ&fÆRÖWÆ÷&W"#à¢ÆFb6Æ74æÖSÒ&WÆ÷&W"ÖVFW"#à¢ÆFb6Æ74æÖSÒ&WÆ÷&W"Ö'&VF7'VÖ"#à¢Æ'WGFöâ6Æ74æÖSÒ&'&VF7'VÖ"ÖÆæ²"öä6Æ6³×¶öä&6·Óà¢Ç7frvGFÒ#2"VvCÒ#2"fWt&÷Ò#BB"fÆÃÒ&æöæR"7GÆS×·¶Ö&vå&vC¢sGrÇfW'F6ÄÆvã¢vÖFFÆRw×Óà¢ÇFCÒ$Ó4ÃBãRtÃ"7G&ö¶SÒ&7W'&VçD6öÆ÷""7G&ö¶UvGFÒ#ãb"7G&ö¶TÆæV6Ò'&÷VæB"7G&ö¶TÆæV¦öãÒ'&÷VæB"óà¢Â÷7fsà¢·6V7FöâææÖWÐ¢Âö'WGFöãà¢Ç7â6Æ74æÖSÒ&WÆ÷&W"×6W#âòÂ÷7ãà¢Ç7â6Æ74æÖSÒ&WÆ÷&W"Ö7'VÖ"Ö7FfR#ç¶föÆFW"ææÖWÓÂ÷7ãà¢ÂöFcà¢ÆFb6Æ74æÖSÒ&WÆ÷&W"Ö7Föç2#à¢¶6äVFDföÆFW"bb¢Æ'WGFöâ6Æ74æÖSÒ&'Fâ'Fâ×&Ö''Fâ×6Ò"öä6Æ6³×²Óâ6WE6÷tFDfÆRG'VRÓà¢Ç7frvGFÒ#"VvCÒ#"fWt&÷Ò#"""fÆÃÒ&æöæR"7GÆS×·¶Ö&vå&vC¢sWw×Óà¢ÇFCÒ$ÓbcÓd"7G&ö¶SÒ&7W'&VçD6öÆ÷""7G&ö¶UvGFÒ#ãr"7G&ö¶TÆæV6Ò'&÷VæB"óà¢Â÷7fsà¢FBfÆP¢Âö'WGFöãà¢Ð¢ÂöFcà¢ÂöFcà ¢¶föÆFW"æFW62bb¢ÆFb6Æ74æÖSÒ&föÆFW"ÖFW62Ö&"#ç¶föÆFW"æFW67ÓÂöFcà¢Ð ¢¶fÆW2æÆVæwFÓÓÒò¢ÆFb6Æ74æÖSÒ&WÆ÷&W"ÖV×G#à¢ÆFb7GÆS×·²föçE6¦S¢sCrÂÖ&vä&÷GFöÓ¢s'r×Óï	ù8CÂöFcà¢ÇäæòfÆW2âF2föÆFW"WBãÂ÷à¢¶6äVFDföÆFW"bb¢Æ'WGFöâ6Æ74æÖSÒ&'Fâ'Fâ×&Ö'"7GÆS×·¶Ö&våF÷¢s'w×Òöä6Æ6³×²Óâ6WE6÷tFDfÆRG'VRÓà¢FBf'7BfÆP¢Âö'WGFöãà¢Ð¢ÂöFcà¢¢¢ÆFb6Æ74æÖSÒ&fÆRÖw&B#à¢¶fÆW2æÖfÆRÂÓâ¢ÆF`¢¶W×¶fÆRæBÇÂÐ¢6Æ74æÖSÒ&fÆRÖw&BÖ6&B ¢öä6Æ6³×²Óâ6WE6VÆV7FVDfÆRfÆRÐ¢à¢ÆFb6Æ74æÖSÒ&fÆRÖv2×F÷#à¢ÄfÆUGT6öâæÖS×¶fÆRææÖWÒ6¦S×³#GÒóà¢ÆFb6Æ74æÖSÒ&fÆRÖv2Ö'Fç2"öä6Æ6³×¶RÓâRç7F÷&÷vFöâÓà¢Æ'WGFöâ6Æ74æÖSÒ&fÆRÖ7FöâÖ'Fâ"FFÆSÒ%fWr"öä6Æ6³×²Óâ6WE6VÆV7FVDfÆRfÆRÓà¢Ç7frvGFÒ#2"VvCÒ#2"fWt&÷Ò#BB"fÆÃÒ&æöæR#à¢Æ6&6ÆR7Ò#r"7Ò#r"#Ò#"ãR"7G&ö¶SÒ&7W'&VçD6öÆ÷""7G&ö¶UvGFÒ#ã2"óà¢ÇFCÒ$Ót3r2ãR2r43ãR22r2t32rãRr32ãRru¢"7G&ö¶SÒ&7W'&VçD6öÆ÷""7G&ö¶UvGFÒ#ã2"óà¢Â÷7fsà¢Âö'WGFöãà¢Æ'WGFöâ6Æ74æÖSÒ&fÆRÖ7FöâÖ'Fâ"FFÆSÒ$F÷væÆöB#à¢Ç7frvGFÒ#2"VvCÒ#2"fWt&÷Ò#BB"fÆÃÒ&æöæR#à¢ÇFCÒ$ÓrcÓrÃBãRbãTÓrÃãRbãR"7G&ö¶SÒ&7W'&VçD6öÆ÷""7G&ö¶UvGFÒ#ã2"7G&ö¶TÆæV6Ò'&÷VæB"7G&ö¶TÆæV¦öãÒ'&÷VæB"óà¢ÇFCÒ$Ó"$""7G&ö¶SÒ&7W'&VçD6öÆ÷""7G&ö¶UvGFÒ#ã2"7G&ö¶TÆæV6Ò'&÷VæB"óà¢Â÷7fsà¢Âö'WGFöãà¢ÂöFcà¢ÂöFcà¢ÆFb6Æ74æÖSÒ&fÆRÖv2ÖæÖR#ç¶fÆRææÖWÓÂöFcà¢²fÆRçFw2ÇÂµÒæÆVæwFâbb¢ÆFb6Æ74æÖSÒ&fÆRÖv2×Fw2#à¢¶fÆRçFw2ç6Æ6RÂ2æÖBÓâÇ7â¶W×·GÒ6Æ74æÖSÒ&fÆR×Fr#â7·GÓÂ÷7ãâÐ¢ÂöFcà¢Ð¢ÆFb6Æ74æÖSÒ&fÆRÖv2ÖÖWF#à¢¶fÆRç6¦RbbfÆRç6¦RÓÒ~(	BrbbÇ7ãç¶fÆRç6¦WÓÂ÷7ãçÐ¢¶fÆRæÖöFfVBbbÇ7ãç¶fÆRæÖöFfVGÓÂ÷7ãçÐ¢ÂöFcà¢ÂöFcà¢Ð¢ÂöFcà¢Ð ¢·6÷tFDfÆRbb¢ÄFDfÆTÖöFÂföÆFW#×¶föÆFW'Ò6V7Föã×·6V7FöçÒöä6Æ÷6S×²Óâ6WE6÷tFDfÆRfÇ6RÒöäFC×¶æFÆTæWtfÆWÒóà¢Ð¢·6VÆV7FVDfÆRbb¢ÄfÆTFWFÄÖöFÀ¢fÆS×·6VÆV7FVDfÆWÒ6V7Föã×·6V7FöçÒföÆFW#×¶föÆFW'Ð¢6äVFDföÆFW#×¶6äVFDföÆFW'Òöä6Æ÷6S×²Óâ6WE6VÆV7FVDfÆRçVÆÂÐ¢óà¢Ð¢ÂöFcà¢°§Ð
