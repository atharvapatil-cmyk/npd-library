import { FOLDER_TREE, USERS } from '../data/data.js';

const ICONS = {
  folders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  team: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  uploads: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
};

function StatCard({ icon, value, label, trend, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon" style={{ color: color || 'var(--accent)' }}>{icon}</div>
        <div className="stat-card-trend">{trend}</div>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

function SectionCard({ section, onNavigate }) {
  const folders = section.folders || [];
  const visibleFolders = folders.slice(0, 3);
  const moreCount = folders.length - 3;

  return (
    <div className="section-card" onClick={() => onNavigate && onNavigate(section.id)}>
      <div className="section-card-top">
        <div className="section-card-dot" style={{ background: section.color || '#16a34a' }}/>
        <div className="section-card-name">{section.name}</div>
        <div className="section-card-owner">{section.owner || ''}</div>
      </div>
      <div className="section-card-folders">
        {visibleFolders.map((f, i) => (
          <span key={i} className="section-folder-chip">{f.name}</span>
        ))}
        {moreCount > 0 && <span className="more">+{moreCount} more</span>}
      </div>
      <div className="section-card-meta">{folders.length} folder{folders.length !== 1 ? 's' : ''} accessible</div>
    </div>
  );
}

export default function Dashboard({ currentUser, accessMatrix, onNavigate, onUpload }) {
  const user = currentUser || {};

  const accessibleSections = (FOLDER_TREE || []).filter(sec => {
    const userAccess = (accessMatrix || {})[user.id] || {};
    return (sec.folders || []).some(folder => (userAccess[folder.id] || 0) > 0);
  });

  const totalFolders = (FOLDER_TREE || []).reduce((acc, s) => acc + (s.folders || []).length, 0);
  const totalMembers = (USERS || []).length;

  const firstName = (user.name || 'User').split(' ')[0];

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-welcome-title">Welcome back, <span className="accent">{firstName}</span></h1>
          <p className="dashboard-welcome-sub">NPD Team Central Document Library</p>
        </div>
        {onUpload && (
          <button className="btn btn-primary" onClick={onUpload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload File
          </button>
        )}
      </div>

      <div className="stat-cards">
        <StatCard
          icon={ICONS.folders}
          value={totalFolders}
          label="Total Folders"
          trend="+3 this month"
          color="#16a34a"
        />
        <StatCard
          icon={ICONS.projects}
          value="12"
          label="Active Projects"
          trend="+2 new"
          color="#2563eb"
        />
        <StatCard
          icon={ICONS.team}
          value={totalMembers}
          label="Team Members"
          trend="All active"
          color="#7c3aed"
        />
        <StatCard
          icon={ICONS.uploads}
          value="28"
          label="Recent Uploads"
          trend="Last 30 days"
          color="#d97706"
        />
      </div>

      <div className="dashboard-section-header">
        <div className="dashboard-section-title">Your Sections</div>
      </div>

      <div className="section-grid">
        {accessibleSections.map(sec => (
          <SectionCard
            key={sec.id}
            section={sec}
            onNavigate={() => onNavigate && onNavigate({ section: sec.id })}
          />
        ))}
        {accessibleSections.length === 0 && (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <p>No sections accessible. Contact your admin to request access.</p>
          </div>
        )}
      </div>
    </div>
  );
}
