import { FOLDER_TREE } from '../data/data.js';

export default function Header({
  currentUser, view, activeSection, activeFolder,
  searchQuery, onSearchChange, onToggleSidebar,
  onToggleChat, onViewChange, onNavigate
}) {
  const section = FOLDER_TREE.find(s => s.id === activeSection);
  const folder = section?.folders?.find(f => f.id === activeFolder);

  const breadcrumbs = [];
  if (view === 'files' && section) {
    breadcrumbs.push({ label: section.name, onClick: () => onNavigate(section.id) });
    if (folder) breadcrumbs.push({ label: folder.name, onClick: null });
  } else if (view === 'settings') {
    breadcrumbs.push({ label: 'Settings', onClick: null });
  } else {
    breadcrumbs.push({ label: 'Dashboard', onClick: null });
  }

  return (
    <header className="app-header">
      <button className="header-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="4" width="14" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="8.25" width="10" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="12.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
        </svg>
      </button>

      <nav className="header-breadcrumb">
        <span className="breadcrumb-home" onClick={() => onViewChange('dashboard')}>Home</span>
        {breadcrumbs.map((b, i) => (
          <span key={i} className="breadcrumb-item">
            <span className="breadcrumb-sep">/</span>
            <span
              className={`breadcrumb-label ${b.onClick ? 'clickable' : 'current'}`}
              onClick={b.onClick || undefined}
            >
              {b.label}
            </span>
          </span>
        ))}
      </nav>

      <div className="header-search">
        <svg className="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search files, folders..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearchChange('')}>x</button>
        )}
      </div>

      <div className="header-actions">
        <button className="header-btn" onClick={onToggleChat} title="Team Chat">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V10C14 10.55 13.55 11 13 11H5L2 14V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="header-btn" onClick={() => onViewChange('settings')} title="Settings">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.05 3.05L4.11 4.11M11.89 11.89L12.95 12.95M3.05 12.95L4.11 11.89M11.89 4.11L12.95 3.05" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="header-user-chip">
          <div className="header-avatar" style={{ background: `linear-gradient(135deg, ${currentUser.color || '#16a34a'}88, ${currentUser.color || '#16a34a'})` }}>
            {currentUser.avatar}
          </div>
          <span className="header-user-name">{currentUser.name.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
}
