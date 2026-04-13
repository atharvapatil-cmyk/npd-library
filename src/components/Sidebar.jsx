import { canView } from '../data/data.js';

const SECTION_ICONS = {
  nutraceuticals: ({ active, color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <ellipse cx="7.5" cy="5.5" rx="3.5" ry="3" stroke={active ? color : 'currentColor'} strokeWidth="1.4"/>
      <path d="M7.5 8.5V13" stroke={active ? color : 'currentColor'} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M5 11H10" stroke={active ? color : 'currentColor'} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  'personal-care': ({ active, color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5C7.5 1.5 3 4.5 3 8C3 10.5 5.1 12.5 7.5 12.5C9.9 12.5 12 10.5 12 8C12 4.5 7.5 1.5 7.5 1.5Z" stroke={active ? color : 'currentColor'} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M5.5 8C5.5 9.1 6.4 10 7.5 10" stroke={active ? color : 'currentColor'} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  regulatory: ({ active, color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2" y="1.5" width="11" height="12" rx="1.5" stroke={active ? color : 'currentColor'} strokeWidth="1.4"/>
      <path d="M5 5H10M5 7.5H10M5 10H8" stroke={active ? color : 'currentColor'} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  testing: ({ active, color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5.5 1.5V6.5L2.5 11.5C2 12.5 2.7 13.5 3.8 13.5H11.2C12.3 13.5 13 12.5 12.5 11.5L9.5 6.5V1.5" stroke={active ? color : 'currentColor'} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M4.5 5H10.5" stroke={active ? color : 'currentColor'} strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="9" cy="10.5" r="1" fill={active ? color : 'currentColor'} opacity="0.7"/>
    </svg>
  ),
  projects: ({ active, color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke={active ? color : 'currentColor'} strokeWidth="1.3"/>
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke={active ? color : 'currentColor'} strokeWidth="1.3"/>
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke={active ? color : 'currentColor'} strokeWidth="1.3"/>
      <path d="M8.5 11.5H14M11.5 8.5V14" stroke={active ? color : 'currentColor'} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  pmo: ({ active, color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke={active ? color : 'currentColor'} strokeWidth="1.4"/>
      <path d="M7.5 4V7.5L10 9.5" stroke={active ? color : 'currentColor'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  miscellaneous: ({ active, color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="1.8" fill={active ? color : 'currentColor'}/>
      <circle cx="2.5" cy="7.5" r="1.8" fill={active ? color : 'currentColor'} opacity="0.6"/>
      <circle cx="12.5" cy="7.5" r="1.8" fill={active ? color : 'currentColor'} opacity="0.6"/>
    </svg>
  ),
};

const DEFAULT_ICON = ({ active, color }) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M1.5 5.5C1.5 4.7 2.2 4 3 4H6.5L8 5.5H12C12.8 5.5 13.5 6.2 13.5 7V11.5C13.5 12.3 12.8 13 12 13H3C2.2 13 1.5 12.3 1.5 11.5V5.5Z" stroke={active ? color : 'currentColor'} strokeWidth="1.4"/>
  </svg>
);

function SubFolderIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 3.5C1.5 3 1.9 2.5 2.5 2.5H5L6 3.5H10C10.6 3.5 11 4 11 4.5V9C11 9.6 10.6 10 10 10H2.5C1.9 10 1.5 9.6 1.5 9V3.5Z" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

const SECTION_COLORS = {
  nutraceuticals: '#16a34a',
  'personal-care': '#2563eb',
  regulatory: '#d97706',
  testing: '#ea580c',
  projects: '#6b7280',
  pmo: '#334155',
  miscellaneous: '#7c3aed',
};

export default function Sidebar({
  currentUser, sections, accessMatrix,
  activeSection, activeFolder, expandedSection,
  view, onSectionClick, onFolderClick, onDashboard, onSettings,
}) {
  const accessible = (sections || []).filter(sec =>
    sec.folders && sec.folders.some(f => canView(currentUser.id, f.id, accessMatrix))
  );

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
          <span className="nav-icon">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          </span>
          <span className="nav-label">Dashboard</span>
        </button>

        <div className="nav-section-label" style={{marginTop:'16px'}}>Sections</div>

        {accessible.map(sec => {
          const isExpanded = expandedSection === sec.id;
          const isActive = activeSection?.id === sec.id && view === 'section';
          const color = SECTION_COLORS[sec.id] || sec.color || '#16a34a';
          const IconComp = SECTION_ICONS[sec.id] || DEFAULT_ICON;
          const accessibleFolders = (sec.folders || []).filter(f =>
            canView(currentUser.id, f.id, accessMatrix)
          );

          return (
            <div key={sec.id} className="nav-section-group">
              <button
                className={`nav-item${isActive ? ' active' : ''}`}
                onClick={() => onSectionClick(sec)}
                style={isActive ? { '--nav-accent': color } : {}}
              >
                <span className="nav-icon" style={isActive ? { color } : {}}>
                  <IconComp active={isActive} color={color} />
                </span>
                <span className="nav-label">{sec.name}</span>
                {accessibleFolders.length > 0 && (
                  <span className={`nav-chevron${isExpanded ? ' open' : ''}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>

              {isExpanded && (
                <div className="nav-sub-list">
                  {accessibleFolders.map(folder => {
                    const isFolderActive = activeFolder?.id === folder.id && isActive;
                    return (
                      <button
                        key={folder.id}
                        className={`nav-sub-item${isFolderActive ? ' active' : ''}`}
                        onClick={() => onFolderClick(sec, folder)}
                        style={isFolderActive ? { '--nav-accent': color, borderLeftColor: color } : {}}
                      >
                        <span className="nav-sub-icon"><SubFolderIcon /></span>
                        <span className="nav-sub-label">{folder.name}</span>
                        <span className="nav-sub-count">{(folder.files || []).length}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="nav-section-label" style={{marginTop:'16px'}}>Admin</div>
        <button
          className={`nav-item${view === 'settings' ? ' active' : ''}`}
          onClick={onSettings}
        >
          <span className="nav-icon">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.3 3.3L4.4 4.4M10.6 10.6L11.7 11.7M3.3 11.7L4.4 10.6M10.6 4.4L11.7 3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="nav-label">Access Control</span>
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
