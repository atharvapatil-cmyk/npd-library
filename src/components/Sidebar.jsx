import { FOLDER_TREE, canView } from '../data/data.js';

const DOT_COLORS = {
  'Nutraceuticals': '#16a34a',
  'Personal Care': '#2563eb',
  'Regulatory & Compliance': '#d97706',
  'Testing & Records': '#dc2626',
  'Projects (Active/Archive)': '#7c3aed',
  'PMO (Monday.com)': '#0f172a',
  'Miscellaneous': '#9333ea',
};

export default function Sidebar({
  currentUser,
  sections,
  accessMatrix,
  activeSection,
  view,
  onSectionClick,
  onDashboard,
  onSettings,
}) {
  const accessible = (sections || FOLDER_TREE).filter(sec =>
    sec.folders && sec.folders.some(f => canView(currentUser.id, f.id, accessMatrix))
  );

  const getLead = (sec) => {
    const folder = sec.folders && sec.folders[0];
    return folder && folder.lead ? folder.lead : '';
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">M</div>
        <div className="brand-text">
          <div className="brand-name">NPD Central</div>
          <div className="brand-sub">DOCUMENT LIBRARY</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        <button
          className={`nav-item${view === 'dashboard' ? ' active' : ''}`}
          onClick={onDashboard}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          Dashboard
        </button>

        <div className="nav-section-label" style={{marginTop:'16px'}}>Sections</div>
        {accessible.map(sec => {
          const lead = getLead(sec);
          const color = DOT_COLORS[sec.name] || '#16a34a';
          const isActive = activeSection && activeSection.name === sec.name && view === 'section';
          return (
            <button
              key={sec.name}
              className={`nav-item${isActive ? ' active' : ''}`}
              onClick={() => onSectionClick(sec)}
            >
              <span className="nav-dot" style={{ background: color }} />
              <span className="nav-label">{sec.name}</span>
              {lead && <span className="nav-badge">{lead}</span>}
            </button>
          );
        })}

        <div className="nav-section-label" style={{marginTop:'16px'}}>Admin</div>
        <button
          className={`nav-item${view === 'settings' ? ' active' : ''}`}
          onClick={onSettings}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.2 3.4L11 3.8L9 5.8L9.4 8.6L7 7.4L4.6 8.6L5 5.8L3 3.8L5.8 3.4L7 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          Access Control
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser.name}</div>
            <div className="sidebar-user-role">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
