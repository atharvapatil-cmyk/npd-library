import { useState } from 'react';

export default function Header({
  currentUser, view, activeSection, activeFolder,
  searchQuery, onSearchChange, onToggleSidebar,
  darkMode, onDarkToggle, onUpload, onNavigate,
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [uploadPulse,   setUploadPulse]   = useState(false);

  const crumbs = (() => {
    if (view === 'settings') return [{ label: 'ð Access Control' }];
    if (view === 'section' && activeSection) {
      const c = [{ label: activeSection.name, onClick: () => {} }];
      if (activeFolder) c.push({ label: activeFolder.name });
      return c;
    }
    return [{ label: 'ð Dashboard' }];
  })();

  const handleUploadClick = () => {
    setUploadPulse(true);
    setTimeout(() => setUploadPulse(false), 600);
    onUpload();
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="hdr-hamburger" onClick={onToggleSidebar} title="Toggle sidebar">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M2 4H15M2 8.5H15M2 13H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
          </svg>
        </button>

        <nav className="hdr-breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i} className="hdr-crumb">
              {i > 0 && <span className="hdr-sep">/</span>}
              {c.onClick
                ? <button className="hdr-crumb-link" onClick={c.onClick}>{c.label}</button>
                : <span className={`hdr-crumb-text${i === crumbs.length - 1 ? ' current' : ''}`}>{c.label}</span>
              }
            </span>
          ))}
        </nav>
      </div>

      <div className={`hdr-search${searchFocused ? ' focused' : ''}`}>
        <svg className="hdr-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          className="hdr-search-input"
          placeholder="Search files, folders, tagsâ¦"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchQuery && (
          <button className="hdr-search-clear" onClick={() => onSearchChange('')}>â</button>
        )}
      </div>

      <div className="header-right">
        <button className="hdr-icon-btn" onClick={onDarkToggle} title={darkMode ? 'Light mode' : 'Dark mode'}>
          {darkMode ? 'âï¸' : 'ð'}
        </button>

        <button
          className={`upload-cta${uploadPulse ? ' pulse' : ''}`}
          onClick={handleUploadClick}
        >
          <div className="upload-cta-icon">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V9M7 1L4 4M7 1L10 4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.5 11C1.5 11 1.5 13 7 13C12.5 13 12.5 11 12.5 11" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </div>
          <span>Upload</span>
          <div className="upload-cta-shine"/>
        </button>

        <div className="hdr-user">
          <div className="hdr-avatar">
            {currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
          </div>
          <span className="hdr-user-name">{currentUser.name.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
}
