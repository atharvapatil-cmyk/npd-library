import { useState } from 'react';

export default function Header({
  currentUser,
  view,
  activeSection,
  activeFolder,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
  onChatToggle,
  chatOpen,
  darkMode,
  onDarkToggle,
  onUpload,
  onNavigate,
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  const getBreadcrumb = () => {
    if (view === 'settings') return [{ label: 'Settings' }];
    if (view === 'section' && activeSection) {
      const crumbs = [{ label: 'Home', onClick: onNavigate }, { label: activeSection.name }];
      if (activeFolder) crumbs.push({ label: activeFolder.name });
      return crumbs;
    }
    return [{ label: 'Dashboard' }];
  };

  const crumbs = getBreadcrumb();

  return (
    <header className="app-header">
      <button className="header-menu-btn" onClick={onToggleSidebar} title="Toggle sidebar">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="4" width="14" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="8.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="12.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
        </svg>
      </button>

      <nav className="header-breadcrumb">
        {crumbs.map((c, i) => (
          <span key={i} className="breadcrumb-item">
            {i > 0 && <span className="breadcrumb-sep">/</span>}
            {c.onClick
              ? <button className="breadcrumb-link" onClick={c.onClick}>{c.label}</button>
              : <span className="breadcrumb-current">{c.label}</span>
            }
          </span>
        ))}
      </nav>

      <div className="header-right">
        <div className={`header-search${searchFocused ? ' focused' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search files, folders..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <button
          className={`header-btn${chatOpen ? ' active' : ''}`}
          title="Lib â Document Librarian"
          onClick={onChatToggle}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V10C14 10.55 13.55 11 13 11H5L2 14V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          className="header-btn"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onDarkToggle}
        >
          {darkMode ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
              <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="2.93" y1="2.93" x2="4.34" y2="4.34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="11.66" y1="11.66" x2="13.07" y2="13.07" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="2.93" y1="13.07" x2="4.34" y2="11.66" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="11.66" y1="4.34" x2="13.07" y2="2.93" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <button className="btn btn-primary" onClick={onUpload}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{marginRight:'6px'}}>
            <path d="M7 1L7 9M7 1L4 4M7 1L10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 11H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Upload File
        </button>

        <div className="user-avatar-wrap">
          <div className="user-avatar-badge">
            {currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
          </div>
          <span className="user-avatar-name">{currentUser.name.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
}
