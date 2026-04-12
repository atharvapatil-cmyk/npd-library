import { useState, useRef } from 'react';
import { FOLDER_TREE } from '../data/data.js';

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
      ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
       'application/vnd.openxmlformats-officedocument.presentationml.presentation',
       'application/vnd.ms-excel', 'text/plain'].includes(f.type) || f.name.match(/\.(pdf|docx|xlsx|pptx|xls|txt)$/i)
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
        <div className="modal-panel" onClick={e => e.stopPropagation()}>
          <div className="upload-success">
            <div className="upload-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="upload-success-title">{files.length} file{files.length > 1 ? 's' : ''} uploaded!</div>
            <div className="upload-success-sub">
              {(activeSec || {}).name} / {(editableFolders.find(f => f.id === folder) || {}).name}
              {description && <div className="upload-success-tag">Tag: {description}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Upload Files</div>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="upload-body">
          <div className="upload-targets">
            <div className="upload-target-group">
              <label className="upload-label">SECTION</label>
              <select className="upload-select" value={section} onChange={handleSectionChange}>
                {editableSections.length === 0 && <option value="">No sections available</option>}
                {editableSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="upload-target-group">
              <label className="upload-label">FOLDER</label>
              <select className="upload-select" value={folder} onChange={e => setFolder(e.target.value)}>
                {editableFolders.length === 0 && <option value="">No folders available</option>}
                {editableFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>

          <div
            className={'dropzone' + (dragging ? ' dropzone-active' : '')}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.xlsx,.pptx,.xls,.txt" style={{ display: 'none' }} onChange={e => addFiles(e.target.files)}/>
            <div className="dropzone-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div className="dropzone-text">{dragging ? 'Drop files here' : 'Drop files here or click to browse'}</div>
            <div className="dropzone-hint">PDF, DOCX, XLSX, PPTX supported</div>
          </div>

          {files.length > 0 && (
            <div className="upload-file-list">
              {files.map((f, i) => (
                <div key={i} className="upload-file-row">
                  <div className="upload-file-ext">{getFileExt(f.name)}</div>
                  <div className="upload-file-name">{f.name}</div>
                  <div className="upload-file-size">{fmtSize(f.size)}</div>
                  <button className="upload-file-remove" onClick={() => removeFile(i)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="upload-tag-group">
            <label className="upload-label">DESCRIPTION / TAGS <span className="upload-label-opt">(optional)</span></label>
            <textarea
              className="upload-tag-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="Write a brief description so Lib (the librarian bot) can find this file when people search..."
            />
            <div className="upload-tag-count">{description.length}/200</div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!files.length || !section || !folder || uploading}
          >
            {uploading ? (
              <span className="btn-spinner"/>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            )}
            {uploading ? 'Uploading...' : 'Upload ' + (files.length > 0 ? files.length + ' File' + (files.length > 1 ? 's' : '') : 'Files')}
          </button>
        </div>
      </div>
    </div>
  );
}
