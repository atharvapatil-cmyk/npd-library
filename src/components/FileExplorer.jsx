import { useState } from 'react';
import { FOLDER_TREE, canView, canEdit, getFileType } from '../data/data.js';

const TYPE_COLORS = {
  pdf: '#dc2626',
  excel: '#16a34a',
  word: '#2563eb',
  image: '#7c3aed',
  default: '#6b7280',
};

function FileIcon({ name }) {
  const ext = (name || '').split('.').pop().toLowerCase();
  const color = ext === 'pdf' ? TYPE_COLORS.pdf
    : ['xlsx','xls','csv'].includes(ext) ? TYPE_COLORS.excel
    : ['doc','docx'].includes(ext) ? TYPE_COLORS.word
    : ['png','jpg','jpeg','gif'].includes(ext) ? TYPE_COLORS.image
    : TYPE_COLORS.default;

  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
      <path d="M3 3C3 1.9 3.9 1 5 1H13L19 7V21C19 22.1 18.1 23 17 23H5C3.9 23 3 22.1 3 21V3Z" fill={color + '20'} stroke={color} strokeWidth="1.4"/>
      <path d="M13 1V7H19" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
      <text x="10" y="17" textAnchor="middle" fill={color} fontSize="5.5" fontWeight="700" fontFamily="sans-serif">
        {ext.toUpperCase().slice(0,3)}
      </text>
    </svg>
  );
}

function FolderIcon({ color }) {
  return (
    <svg width="40" height="34" viewBox="0 0 40 34" fill="none">
      <path d="M2 8C2 6.34 3.34 5 5 5H15L18 8H35C36.66 8 38 9.34 38 11V29C38 30.66 36.66 32 35 32H5C3.34 32 2 30.66 2 29V8Z" fill={(color || '#16a34a') + '20'} stroke={color || '#16a34a'} strokeWidth="1.6"/>
    </svg>
  );
}

export default function FileExplorer({
  section,
  currentUser,
  accessMatrix,
  activeFolder,
  onFolderClick,
  onBack,
}) {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!section) {
    return (
      <div className="explorer-empty">
        <div className="explorer-empty-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M6 12C6 9.8 7.8 8 10 8H20L24 12H38C40.2 12 42 13.8 42 16V36C42 38.2 40.2 40 38 40H10C7.8 40 6 38.2 6 36V12Z" stroke="#d1d5db" strokeWidth="2"/>
          </svg>
        </div>
        <p>Select a section from the sidebar to browse files.</p>
      </div>
    );
  }

  const allFolders = (section.folders || []).filter(f =>
    canView(currentUser.id, f.id, accessMatrix)
  );

  if (!activeFolder) {
    return (
      <div className="file-explorer">
        <div className="explorer-header">
          <div className="explorer-title">
            <span className="explorer-dot" style={{ background: section.color || '#16a34a' }}/>
            <span className="explorer-folder-name">{section.name}</span>
            <span className="explorer-sep">/</span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Folders</span>
          </div>
          <div className="explorer-actions">
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>
              {allFolders.length} folder{allFolders.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {allFolders.length === 0 ? (
          <div className="explorer-empty">
            <p>No folders accessible in this section.</p>
          </div>
        ) : (
          <div className="folder-grid">
            {allFolders.map(folder => (
              <button
                key={folder.id}
                className="folder-card"
                onClick={() => onFolderClick(folder)}
              >
                <div className="folder-card-icon">
                  <FolderIcon color={section.color} />
                </div>
                <div className="folder-card-name">{folder.name}</div>
                <div className="folder-card-meta">
                  {(folder.files || []).length} file{(folder.files || []).length !== 1 ? 's' : ''}
                  {folder.lead && <span> &middot; {folder.lead}</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const folder = activeFolder;
  const canEditFolder = canEdit(currentUser.id, folder.id, accessMatrix);
  const files = folder.files || [];

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <div className="explorer-title">
          <button className="back-btn" onClick={onBack} title="Back to folders">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="explorer-dot" style={{ background: section.color || '#16a34a' }}/>
          <span className="explorer-folder-name">{section.name}</span>
          <span className="explorer-sep">/</span>
          <span className="explorer-folder-name">{folder.name}</span>
        </div>
        <div className="explorer-actions">
          {canEditFolder && (
            <button className="btn btn-primary btn-sm">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{marginRight:'4px'}}>
                <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              Add File
            </button>
          )}
        </div>
      </div>

      {files.length === 0 ? (
        <div className="explorer-empty">
          <p>No files in this folder yet.</p>
        </div>
      ) : (
        <div className="file-list">
          {files.map((file, i) => (
            <div key={i} className="file-card" onClick={() => setSelectedFile(file)}>
              <div className="file-card-icon">
                <FileIcon name={file.name} />
              </div>
              <div className="file-card-info">
                <div className="file-card-name">{file.name}</div>
                <div className="file-card-meta">
                  {folder.name}
                  {file.tag && <><span className="meta-sep">Â·</span>{file.tag}</>}
                </div>
              </div>
              <div className="file-card-actions">
                <button className="file-action-btn" title="View" onClick={e => { e.stopPropagation(); setSelectedFile(file); }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1 7C1 7 3 3 7 3C11 3 13 7 13 7C13 7 11 11 7 11C3 11 1 7 1 7Z" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                </button>
                {canEditFolder && (
                  <button className="file-action-btn" title="Download" onClick={e => e.stopPropagation()}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1V9M7 9L4 6M7 9L10 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFile && (
        <div className="file-detail-overlay" onClick={() => setSelectedFile(null)}>
          <div className="file-detail-panel" onClick={e => e.stopPropagation()}>
            <div className="file-detail-header">
              <div className="file-detail-title">{selectedFile.name}</div>
              <button className="file-detail-close" onClick={() => setSelectedFile(null)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="file-detail-body">
              <div className="file-detail-row">
                <span className="file-detail-label">Section</span>
                <span>{section.name}</span>
              </div>
              <div className="file-detail-row">
                <span className="file-detail-label">Folder</span>
                <span>{folder.name}</span>
              </div>
              {selectedFile.tag && (
                <div className="file-detail-row">
                  <span className="file-detail-label">Tags</span>
                  <span>{selectedFile.tag}</span>
                </div>
              )}
            </div>
            <div className="file-detail-actions">
              <button className="btn btn-primary">Open File</button>
              {canEditFolder && <button className="btn btn-ghost">Download</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
