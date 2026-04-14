import { useState, useRef } from 'react';
import { FOLDER_TREE } from '../data/data.js';

function CloudUploadIcon({ size = 40, color = '#16a34a' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill={color + '14'}/>
      <path d="M32 28C34.2 26.6 36 24.2 36 21.5C36 17.4 32.6 14 28.5 14C27.9 14 27.4 14.1 26.9 14.2C25.7 11.7 23.1 10 20 10C15.6 10 12 13.6 12 18C12 18.4 12 18.8 12.1 19.2C10.3 20.2 9 22.2 9 24.5C9 27.8 11.7 30.5 15 30.5H16" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 26L24 22L28 26" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 22V36" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="28" fill="#f0fdf4"/>
      <circle cx="28" cy="28" r="20" fill="#dcfce7"/>
      <path d="M18 28L24 34L38 20" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FileTypeChip({ ext }) {
  const map = { PDF:'#ef4444', DOCX:'#3b82f6', DOC:'#3b82f6', XLSX:'#22c55e', XLS:'#22c55e', PPTX:'#f59e0b', TXT:'#6b7280' };
  const color = map[ext] || '#6b7280';
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700, padding: '2px 7px',
      borderRadius: '5px', background: color + '18', color,
      letterSpacing: '0.04em', flexShrink: 0,
    }}>
      {ext}
    </span>
  );
}

export default function UploadModal({ currentUser, accessMatrix, defaultSection, defaultFolder, onClose }) {
  const user = currentUser || {};
  const matrix = (accessMatrix || {})[user.id] || {};

  const editableSections = (FOLDER_TREE || []).filter(sec =>
    (sec.folders || []).some(f => (matrix[f.id] || 0) >= 2)
  );

  const [section, setSection] = useState(defaultSection || (editableSections[0] || {}).id || '');
  const [folder, setFolder] = useState(() => {
    const sec = editableSections.find(s => s.id === (defaultSection || (editableSections[0] || {}).id));
    const folders = (sec ? sec.folders : []).filter(f => (matrix[f.id] || 0) >= 2);
    const match = folders.find(f => f.id === defaultFolder);
    return match ? match.id : (folders[0] || {}).id || '';
  });
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const activeSec = editableSections.find(s => s.id === section);
  const editableFolders = ((activeSec || {}).folders || []).filter(f => (matrix[f.id] || 0) >= 2);

  function handleSectionChange(e) {
    const newSec = e.target.value;
    setSection(newSec);
    const sec = editableSections.find(s => s.id === newSec);
    const folders = ((sec || {}).folders || []).filter(f => (matrix[f.id] || 0) >= 2);
    setFolder((folders[0] || {}).id || '');
  }

  function addFiles(newFiles) {
    const arr = Array.from(newFiles).filter(f =>
      ['application/pdf',
       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
       'application/vnd.openxmlformats-officedocument.presentationml.presentation',
       'application/vnd.ms-excel', 'text/plain'].includes(f.type) ||
      f.name.match(/\.(pdf|docx|xlsx|pptx|xls|txt)$/i)
    );
    setFiles(prev => [...prev, ...arr]);
  }

  function removeFile(i) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function handleUpload() {
    if (!files.length || !section || !folder) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setTimeout(() => { onClose && onClose(); }, 2000);
    }, 1500);
  }

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function getFileExt(name) {
    return (name.split('.').pop() || '').toUpperCase();
  }

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="upload-modal-panel" onClick={e => e.stopPropagation()}>
          <div className="upload-success-screen">
            <CheckCircleIcon />
            <div className="upload-success-title">
              {files.length} file{files.length > 1 ? 's' : ''} uploaded successfully
            </div>
            <div className="upload-success-path">
              {(activeSec || {}).name} &rsaquo; {(editableFolders.find(f => f.id === folder) || {}).name}
            </div>
            {description && (
              <div className="upload-success-tag">Tagged: {description}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upload-modal-panel" onClick={e => e.stopPropagation()}>

        <div className="upload-modal-header">
          <div className="upload-modal-header-left">
            <div className="upload-modal-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <div className="upload-modal-title">Upload Files</div>
              <div className="upload-modal-subtitle">Add documents to the NPD Library</div>
            </div>
          </div>
          <button className="upload-modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="upload-modal-body">
          <div className="upload-dest-row">
            <div className="upload-dest-group">
              <label className="upload-dest-label">Section</label>
              <div className="upload-select-wrap">
                <select className="upload-dest-select" value={section} onChange={handleSectionChange}>
                  {editableSections.length === 0 && <option value="">No sections available</option>}
                  {editableSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <svg className="upload-select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="upload-dest-divider">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="upload-dest-group">
              <label className="upload-dest-label">Folder</label>
              <div className="upload-select-wrap">
                <select className="upload-dest-select" value={folder} onChange={e => setFolder(e.target.value)}>
                  {editableFolders.length === 0 && <option value="">No folders available</option>}
                  {editableFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <svg className="upload-select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div
            className={`upload-dropzone${dragging ? ' dragover' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.pptx,.xls,.txt"
              style={{ display: 'none' }}
              onChange={e => addFiles(e.target.files)}
            />
            <CloudUploadIcon size={48} color={dragging ? '#16a34a' : '#94a3b8'}/>
            <div className="upload-dropzone-text">
              {dragging ? 'Drop your files here' : 'Drag & drop files here, or click to browse'}
            </div>
            <div className="upload-dropzone-hint">
              Supported formats: PDF &nbsp;&bull;&nbsp; DOCX &nbsp;&bull;&nbsp; XLSX &nbsp;&bull;&nbsp; PPTX
            </div>
          </div>

          {files.length > 0 && (
            <div className="upload-file-list">
              <div className="upload-file-list-header">
                <span>{files.length} file{files.length > 1 ? 's' : ''} selected</span>
              </div>
              {files.map((f, i) => (
                <div key={i} className="upload-file-row">
                  <FileTypeChip ext={getFileExt(f.name)} />
                  <div className="upload-file-info">
                    <span className="upload-file-name">{f.name}</span>
                    <span className="upload-file-size">{fmtSize(f.size)}</span>
                  </div>
                  <button className="upload-file-remove" onClick={() => removeFile(i)} title="Remove">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M1 1L12 12M12 1L1 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="upload-desc-group">
            <label className="upload-dest-label">
              Description &amp; Tags
              <span className="upload-optional-badge">optional</span>
            </label>
            <textarea
              className="upload-desc-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="Add a brief description or tags so Lib can surface this file when people search..."
            />
            <div className="upload-desc-count">{description.length}/200</div>
          </div>
        </div>

        <div className="upload-modal-footer">
          <button className="upload-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="upload-btn-primary"
            onClick={handleUpload}
            disabled={!files.length || !section || !folder || uploading}
          >
            {uploading ? (
              <>
                <span className="upload-btn-spinner"/>
                Uploading...
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload {files.length > 0 ? `${files.length} File${files.length > 1 ? 's' : ''}` : 'Files'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
