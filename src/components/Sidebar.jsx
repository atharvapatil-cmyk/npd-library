import { FOLDER_TREE, canView } from '../data/data.js';

export default function Sidebar({
  open, currentUser, accessMatrix, activeSection, activeFolder,
  view, onNavigate, onViewChange, onLogout
}) {
  const isAdmin = currentUser.role === 'admin';

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">M</div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">NPD Central</div>
            <div className="sidebar-brand-sub">Document Library</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">Navigation</div>
          <div
            className={`nav-item ${view === 'dashboard' && !activeSection ? 'active' : ''}`}
            onClick={() => { onViewChange('dashboard'); }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            Dashboard
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-label">Sections</div>
          {FOLDER_TREE.map(section => {
            const hasAccess = isAdmin || section.folders.some(f =>
              canView(currentUser.id, f.id, accessMatrix)
            );
            if (!hasAccess) return null;

            const sectionActive = activeSection === section.id;

            return (
              <div key={section.id}>
                <div
                  className={`nav-item ${sectionActive && view === 'files' ? 'active' : ''}`}
                  onClick={() => onNavigate(section.id)}
                  style={{ '--section-color': section.color }}
                >
                  <div className="nav-section-dot" style={{ background: section.color }} />
                  <span className="nav-item-label">{section.name}</span>
                  {section.owner && (
                    <span className="nav-item-owner">{section.owner.split(' ')[0]}</span>
                  )}
                </div>
                {sectionActive && view === 'files' && (
                  <div className="nav-section-folders">
                    {section.folders.map(folder => {
                      const fAccess = isAdmin || canView(currentUser.id, folder.id, accessMatrix);
                      if (!fAccess) return null;
                      return (
                        <div
                          key={folder.id}
                          className={`nav-folder-item ${activeFolder === folder.id ? 'active' : ''}`}
                          onClick={() => onNavigate(section.id, folder.id)}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1 3C1 2.45 1.45 2 2 2H4.5L5.5 3H10C10.55 3 11 3.45 11 4V9C11 9.55 10.55 10 10 10H2C1.45 10 1 9.55 1 9V3Z" stroke="currentColor" strokeWidth="1.1"/>
                          </svg>
                          {folder.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isAdmin && (
          <div className="nav-section">
            <div className="nav-section-label">Admin</div>
            <div
              className={`nav-item ${view === 'settings' ? 'active' : ''}`}
              onClick={() => onViewChange('settings')}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Access Control
            </div>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-card" onClick={onLogout} title="Click to logout">
          <div className="sidebar-avatar" style={{ background: `linear-gradient(135deg, ${currentUser.color || '#16a34a'}88, ${currentUser.color || '#16a34a'})` }}>
            {currentUser.avatar}
          </div>
          <div>
            <div className="sidebar-user-name">{currentUser.name}</div>
            <div className="sidebar-user-role">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
