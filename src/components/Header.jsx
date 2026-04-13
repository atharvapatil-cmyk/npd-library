import { useState } from 'react';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 1V2.5M8 13.5V15M1 8H2.5M13.5 8H15M3.1 3.1L4.2 4.2M11.8 11.8L12.9 12.9M3.1 12.9L4.2 11.8M11.8 4.2L12.9 3.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3c0-.4 0-.8.1-1.2A6 6 0 1 0 14.2 9.9 5.5 5.5 0 0 1 13 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1C4.1 1 1 3.8 1 7.2c0 1.9.9 3.6 2.4 4.8L3 15l3.3-1.7c.5.1 1.1.2 1.7.2 3.9 0 7-2.8 7-6.3C15 3.8 11.9 1 8 1Z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 7H11M5 9.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header({
  currentUser, view, activeSection, activeFolder,
  searchQuery, onSearchChange, onToggleSidebar,
  darkMode, onDarkToggle, onUpload, onNavigate, onAskLib, chatOpen,
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [uploadPulse,   setUploadPulse]   = useState(false);

  const crumbs = (() => {
    if (view === 'settings') return [{ label: 'Access Control' }];
    if (view === 'section' && activeSection) {
      const c = [{ label: activeSection.name, onClick: () => {} }];
      if (activeFolder) c.push({ label: activeFolder.name });
      return c;
    }
    return [{ label: 'Dashboard' }];
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
          placeholder="Search files, folders, tags..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchQuery && (
          <button className="hdr-search-clear" onClick={() => onSearchChange('')}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="header-right">
        {/* Ask Lib button - top right beside search */}
        <button
          className={`ask-lib-hdr-btn${chatOpen ? ' active' : ''}`}
          onClick={onAskLib}
          title="Ask Lib - your Document Librarian"
        >
          <ChatIcon />
          <span>Ask Lib</span>
          {!chatOpen && <span className="ask-lib-pulse" />}
        </button>

        <button className="hdr-icon-btn" onClick={onDarkToggle} title={darkMode ? 'Light mode' : 'Dark mode'}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
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
