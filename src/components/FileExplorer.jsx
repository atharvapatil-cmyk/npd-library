import { useState } from 'react';
import { FOLDER_TREE, canView, canEdit } from '../data/data.js';

const SAMPLE_FILES = {
  'formulations': [
    { id: 'f1', name: 'Ashwagandha Extract Specs v3.pdf', type: 'pdf', size: '2.4 MB', updated: '2 days ago', author: 'Darshani' },
    { id: 'f2', name: 'Collagen Peptides Research.docx', type: 'docx', size: '1.1 MB', updated: '5 days ago', author: 'Ritu' },
    { id: 'f3', name: 'Omega-3 Stability Data.xlsx', type: 'xlsx', size: '0.8 MB', updated: '1 week ago', author: 'Darshani' },
  ],
  'stability': [
    { id: 'f4', name: 'Stability Protocol 2025 Q1.pdf', type: 'pdf', size: '3.2 MB', updated: '3 days ago', author: 'Darshani' },
    { id: 'f5', name: 'Accelerated Study Results.xlsx', type: 'xlsx', size: '1.8 MB', updated: '1 week ago', author: 'Ritu' },
  ],
  'regulatory': [
    { id: 'f6', name: 'FSSAI Compliance Checklist.pdf', type: 'pdf', size: '0.9 MB', updated: '1 day ago', author: 'Priya' },
    { id: 'f7', name: 'Label Claims Matrix 2025.xlsx', type: 'xlsx', size: '1.4 MB', updated: '4 days ago', author: 'Priya' },
  ],
};

const FILE_ICONS = {
  pdf: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'PDF' },
  docx: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'DOC' },
  xlsx: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'XLS' },
  pptx: { bg: 'rgba(249,115,22,0.12)', color: '#f97316', label: 'PPT' },
  default: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', label: 'FILE' },
};

function FileCard({ file, onSelect }) {
  const icon = FILE_ICONS[file.type] || FILE_ICONS.default;
  return (
    <div className="file-card" onClick={() => onSelect(file)}>
      <div className="file-card-icon" style={{ background: icon.bg, color: icon.color }}>
        {icon.label}
      </div>
      <div className="file-card-info">
        <div className="file-card-name">{file.name}</div>
        <div className="file-card-meta">
          <span>{file.size}</span>
          <span className="meta-sep">Â·</span>
          <span>{file.updated}</span>
          <span className="meta-sep">Â·</span>
          <span>{file.author}</span>
        </div>
      </div>
      <div className="file-card-actions">
        <button className="file-action-btn" title="Download" onClick={e => e.stopPropagation()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V9M4 6L7 9L10 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 11H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function FileExplorer({
  currentUser, accessMatrix, activeSection, activeFolder,
  searchQuery, onNavigate, onUpload
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const isAdmin = currentUser.role === 'admin';

  const section = FOLDER_TREE.find(s => s.id === activeSection);
  if (!section) {
    return (
      <div className="explorer-empty">
        <div className="explorer-empty-icon">F</div>
        <div>Select a section from the sidebar</div>
      </div>
    );
  }

  const visibleFolders = activeFolder
    ? section.folders.filter(f => f.id === activeFolder)
    : section.folders.filter(f => isAdmin || canView(currentUser.id, f.id, accessMatrix));

  const getFiles = (folderId) => {
    const files = SAMPLE_FILES[folderId] || [
      { id: `${folderId}-1`, name: 'Document Overview.pdf', type: 'pdf', size: '1.2 MB', updated: '3 days ago', author: currentUser.name },
      { id: `${folderId}-2`, name: 'Reference Data.xlsx', type: 'xlsx', size: '0.6 MB', updated: '1 week ago', author: currentUser.name },
    ];
    if (!searchQuery) return files;
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const hasEdit = (folderId) => isAdmin || canEdit(currentUser.id, folderId, accessMatrix);

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <div className="explorer-title">
          <div className="explorer-dot" style={{ background: section.color }} />
          <h2>{section.name}</h2>
          {activeFolder && (
            <>
              <span className="explorer-sep">âº</span>
              <span className="explorer-folder-name">
                {section.folders.find(f => f.id === activeFolder)?.name}
              </span>
            </>
          )}
        </div>
        <div className="explorer-actions">
          {activeFolder && hasEdit(activeFolder) && (
            <button className="btn btn-primary btn-sm" onClick={onUpload}>
              Upload
            </button>
          )}
          {activeFolder && (
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate(activeSection)}>
              All Folders
            </button>
          )}
        </div>
      </div>

      {!activeFolder ? (
        <div className="folder-grid">
          {visibleFolders.map(folder => (
            <div
              key={folder.id}
              className="folder-card"
              onClick={() => onNavigate(activeSection, folder.id)}
              style={{ '--folder-color': section.color }}
            >
              <div className="folder-card-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M3 7C3 5.9 3.9 5 5 5H11L13 7H23C24.1 7 25 7.9 25 9V21C25 22.1 24.1 23 23 23H5C3.9 23 3 22.1 3 21V7Z"
                    fill={section.color + '22'} stroke={section.color} strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="folder-card-name">{folder.name}</div>
              <div className="folder-card-meta">
                {getFiles(folder.id).length} files
              </div>
            </div>
          ))}
          {visibleFolders.length === 0 && (
            <div className="explorer-empty">
              <div className="explorer-empty-icon">L</div>
              <div>No accessible folders in this section</div>
            </div>
          )}
        </div>
      ) : (
        <div className="file-list">
          {getFiles(activeFolder).map(file => (
            <FileCard key={file.id} file={file} onSelect={setSelectedFile} />
          ))}
          {getFiles(activeFolder).length === 0 && (
            <div className="explorer-empty">
              <div className="explorer-empty-icon">S</div>
              <div>No files match your search</div>
            </div>
          )}
        </div>
      )}

      {selectedFile && (
        <div className="file-detail-overlay" onClick={() => setSelectedFile(null)}>
          <div className="file-detail-panel" onClick={e => e.stopPropagation()}>
            <div className="file-detail-header">
              <div className="file-detail-title">{selectedFile.name}</div>
              <button className="file-detail-close" onClick={() => setSelectedFile(null)}>x</button>
            </div>
            <div className="file-detail-body">
              <div className="file-detail-row">
                <span className="file-detail-label">Type</span>
                <span>{selectedFile.type?.toUpperCase()}</span>
              </div>
              <div className="file-detail-row">
                <span className="file-detail-label">Size</span>
                <span>{selectedFile.size}</span>
              </div>
              <div className="file-detail-row">
                <span className="file-detail-label">Last Updated</span>
                <span>{selectedFile.updated}</span>
              </div>
              <div className="file-detail-row">
                <span className="file-detail-label">Author</span>
                <span>{selectedFile.author}</span>
              </div>
            </div>
            <div className="file-detail-actions">
              <button className="btn btn-primary">Download</button>
              {activeFolder && hasEdit(activeFolder) && (
                <button className="btn btn-ghost">Edit</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
