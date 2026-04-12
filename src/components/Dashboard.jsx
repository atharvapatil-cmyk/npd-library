import { useMemo } from 'react';
import { FOLDER_TREE, USERS, canView } from '../data/data.js';

const FILE_ICONS = {
  pdf: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="1" width="12" height="16" rx="2" stroke="#dc2626" strokeWidth="1.4"/>
      <path d="M6 7h6M6 10h4" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M10 1v4h5" stroke="#dc2626" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  xlsx: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="1" width="12" height="16" rx="2" stroke="#16a34a" strokeWidth="1.4"/>
      <path d="M6 6l6 6M12 6l-6 6" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  default: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="1" width="12" height="16" rx="2" stroke="#2563eb" strokeWidth="1.4"/>
      <path d="M6 7h6M6 10h4M6 13h5" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

function getFileIcon(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return FILE_ICONS.pdf;
  if (['xlsx','xls','csv'].includes(ext)) return FILE_ICONS.xlsx;
  return FILE_ICONS.default;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STAT_ICONS = {
  folders: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 7C3 5.9 3.9 5 5 5H10L12 7H19C20.1 7 21 7.9 21 9V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  projects: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  members: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 20C3 17.2 5.7 15 9 15C12.3 15 15 17.2 15 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="17" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M21 20C21 17.8 19.2 16 17 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  uploads: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L12 15M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
};

export default function Dashboard({
  currentUser,
  sections,
  accessMatrix,
  recentUploads,
  onSectionClick,
}) {
  const srcSections = sections || FOLDER_TREE;

  const accessibleFolders = useMemo(() => {
    const all = [];
    srcSections.forEach(sec => {
      (sec.folders || []).forEach(f => {
        if (canView(currentUser.id, f.id, accessMatrix)) {
          all.push({ ...f, sectionName: sec.name, sectionColor: sec.color });
        }
      });
    });
    return all;
  }, [currentUser, accessMatrix, srcSections]);

  const accessibleFiles = useMemo(() => {
    const files = [];
    srcSections.forEach(sec => {
      (sec.folders || []).forEach(f => {
        if (canView(currentUser.id, f.id, accessMatrix)) {
          (f.files || []).forEach(file => {
            files.push({
              name: file.name,
              section: sec.name,
              folder: f.name,
              tag: file.tag || '',
              uploadedBy: f.lead || 'Team',
            });
          });
        }
      });
    });
    return files;
  }, [currentUser, accessMatrix, srcSections]);

  const userAccessibleSections = useMemo(() =>
    srcSections.filter(sec =>
      (sec.folders || []).some(f => canView(currentUser.id, f.id, accessMatrix))
    ),
    [currentUser, accessMatrix, srcSections]
  );

  const totalFolders = accessibleFolders.length;
  const totalFiles = accessibleFiles.length;
  const totalMembers = (USERS || []).length;
  const uploadCount = recentUploads.length;

  const activityFeed = useMemo(() => {
    const uploaded = (recentUploads || []).map(u => ({
      ...u,
      type: 'upload',
      time: u.uploadedAt,
    }));
    const existing = accessibleFiles.slice(0, Math.max(0, 12 - uploaded.length)).map((f, i) => ({
      ...f,
      type: 'existing',
      uploadedBy: f.uploadedBy || 'Team',
      time: null,
    }));
    return [...uploaded, ...existing].slice(0, 12);
  }, [recentUploads, accessibleFiles]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, <span className="dashboard-name">{currentUser.name.split(' ')[0]}</span>
          </h1>
          <p className="dashboard-sub">NPD Team Central Document Library</p>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon" style={{color:'#16a34a', background:'#dcfce7'}}>
            {STAT_ICONS.folders}
          </div>
          <div className="stat-body">
            <div className="stat-value">{totalFolders}</div>
            <div className="stat-label">Folders Accessible</div>
          </div>
          <div className="stat-badge">All active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{color:'#2563eb', background:'#dbeafe'}}>
            {STAT_ICONS.projects}
          </div>
          <div className="stat-body">
            <div className="stat-value">{totalFiles}</div>
            <div className="stat-label">Files Available</div>
          </div>
          <div className="stat-badge">Your access</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{color:'#7c3aed', background:'#ede9fe'}}>
            {STAT_ICONS.members}
          </div>
          <div className="stat-body">
            <div className="stat-value">{totalMembers}</div>
            <div className="stat-label">Team Members</div>
          </div>
          <div className="stat-badge">All active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{color:'#d97706', background:'#fef3c7'}}>
            {STAT_ICONS.uploads}
          </div>
          <div className="stat-body">
            <div className="stat-value">{uploadCount}</div>
            <div className="stat-label">Recent Uploads</div>
          </div>
          <div className="stat-badge">This session</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <span className="section-hint">Files you have access to</span>
          </div>

          {activityFeed.length === 0 ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="6" width="24" height="30" rx="3" stroke="#d1d5db" strokeWidth="2"/>
                <path d="M14 16h12M14 21h8M14 26h10" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No files accessible yet. Contact your admin for access.</p>
            </div>
          ) : (
            <div className="activity-list">
              {activityFeed.map((item, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-icon">
                    {getFileIcon(item.name)}
                  </div>
                  <div className="activity-info">
                    <div className="activity-name">{item.name}</div>
                    <div className="activity-meta">
                      <span className="activity-path">{item.section} / {item.folder}</span>
                      {item.tag && <span className="activity-tag">{item.tag}</span>}
                    </div>
                  </div>
                  <div className="activity-right">
                    <div className="activity-by">{item.uploadedBy}</div>
                    {item.time && <div className="activity-time">{timeAgo(item.time)}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-side">
          <div className="section-header">
            <h2 className="section-title">Your Sections</h2>
          </div>
          <div className="quick-sections">
            {userAccessibleSections.map(sec => {
              const accessCount = (sec.folders || []).filter(f =>
                canView(currentUser.id, f.id, accessMatrix)
              ).length;
              return (
                <button
                  key={sec.name}
                  className="quick-section-btn"
                  onClick={() => onSectionClick(sec)}
                >
                  <span
                    className="quick-section-dot"
                    style={{ background: sec.color || '#16a34a' }}
                  />
                  <span className="quick-section-name">{sec.name}</span>
                  <span className="quick-section-count">{accessCount} folders</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="quick-section-arrow">
                    <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
