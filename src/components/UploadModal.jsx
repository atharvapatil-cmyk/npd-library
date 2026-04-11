import { useState, useRef } from 'react';
import { FOLDER_TREE, canEdit } from '../data/data.js';

export default function UploadModal({ currentUser, activeSection, activeFolder, accessMatrix, onClose }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [targetSection, setTargetSection] = useState(activeSection || '');
  const [targetFolder, setTargetFolder] = useState(activeFolder || '');
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef(null);
  const isAdmin = currentUser.role === 'admin';

  const section = FOLDER_TREE.find(s => s.id === targetSection);
  const availableFolders = section?.folders.filter(f =>
    isAdmin || canEdit(currentUser.id, f.id, accessMatrix)
  ) || [];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped]);
  };

  const handleFileInput = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = () => {
    if (!files.length || !targetFolder) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setDone(true);
    }, 1500);
  };

  const FILE_ICONS = { pdf: '#ef4444', docx: '#3b82f6', xlsx: '#22c55e', pptx: '#f97316' };

  const getExt = (name) => name.split('.').pop().toLowerCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Upload Files</div>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>

        {done ? (
          <div className="upload-success">
            <div className="upload-success-icon">OK</div>
            <div className="upload-success-title">Upload Complete</div>
            <div className="upload-success-sub">{files.length} file{files.length > 1 ? 's' : ''} uploaded to {section?.name} âº {availableFolders.find(f => f.id === targetFolder)?.name}</div>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="upload-targets">
              <div className="upload-target-group">
                <label className="upload-label">Section</label>
                <select
                  className="upload-select"
                  value={targetSection}
                  onChange={e => { setTargetSection(e.target.value); setTargetFolder(''); }}
                >
                  <option value="">Select section...</option>
                  {FOLDER_TREE.filter(s =>
                    isAdmin || s.folders.some(f => canEdit(currentUser.id, f.id, accessMatrix))
                  ).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              {targetSection && (
                <div className="upload-target-group">
                  <label className="upload-label">Folder</label>
                  <select
                    className="upload-select"
                    value={targetFolder}
                    onChange={e => setTargetFolder(e.target.value)}
                  >
                    <option value="">Select folder...</option>
                    {availableFolders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div
              className={`upload-dropzone ${dragOver ? 'dragover' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileInput} />
              <div className="dropzone-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4V22M8 12L16 4L24 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 26H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="dropzone-text">Drop files here or click to browse</div>
              <div className="dropzone-hint">PDF, DOCX, XLSX, PPTX supported</div>
            </div>

            {files.length > 0 && (
              <div className="upload-file-list">
                {files.map((f, i) => {
                  const ext = getExt(f.name);
                  const color = FILE_ICONS[ext] || '#6b7280';
                  return (
                    <div key={i} className="upload-file-row">
                      <div className="upload-file-icon" style={{ color }}>
                        {ext.toUpperCase()}
                      </div>
                      <div className="upload-file-name">{f.name}</div>
                      <div className="upload-file-size">{(f.size / 1024 / 1024).toFixed(1)} MB</div>
                      <button className="upload-file-remove" onClick={() => removeFile(i)}>x</button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={!files.length || !targetFolder || uploading}
                onClick={handleUpload}
              >
                {uploading ? 'Uploading...' : `Upload ${files.length || ''} File${files.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
