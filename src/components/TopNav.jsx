import { useState, useRef, useEffect } from 'react';
import { canView } from '../data/data.js';

const SECTION_COLORS = {
  nutraceuticals: '#16a34a',
  'personal-care': '#2563eb',
  regulatory: '#d97706',
  testing: '#ea580c',
  projects: '#6b7280',
  pmo: '#334155',
  miscellaneous: '#7c3aed',
};

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
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1V9M7 1L4 4M7 1L10 4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.5 11C1.5 11 1.5 13 7 13C12.5 13 12.5 11 12.5 11" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function FolderSmIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 3.5C1.5 3 1.9 2.5 2.5 2.5H5L6 3.5H10C10.6 3.5 11 4 11 4.5V9C11 9.6 10.6 10 10 10H2.5C1.9 10 1.5 9.6 1.5 9V3.5Z" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.3 3.3L4.4 4.4M10.6 10.6L11.7 11.7M3.3 11.7L4.4 10.6M10.6 4.4L11.7 3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="9" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="8.5" cy="14.5" r="1.6" fill="currentColor"/>
      <circle cx="15.5" cy="14.5" r="1.6" fill="currentColor"/>
      <path d="M9 18.5c.9 1 5.1 1 6 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M8.5 9V7M15.5 9V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="6" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="3.2" r="1.2" fill="currentColor"/>
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

export default function TopNav({
  currentUser, sections, accessMatrix,
  activeSection, activeFolder,
  view, darkMode,
  searchQuery, onSearchChange,
  chatOpen,
  onSectionClick, onFolderClick, onDashboard, onSettings,
  onDarkToggle, onUpload, onAskLib,
  onLogout,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef();
  const userMenuRef = useRef();

  const accessible = (sections || []).filter(sec =>
    sec.folders && sec.folders.some(f => canView(currentUser.id, f.id, accessMatrix))
  );

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSectionClick = (sec) => {
    onSectionClick(sec);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleFolderClick = (sec, folder) => {
    onFolderClick(sec, folder);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="app-topnav" ref={navRef}>
      {/* Brand */}
      <button className="tnav-brand" onClick={onDashboard}>
        <div className="tnav-logo">M</div>
        <div className="tnav-brand-text">
          <div className="tnav-brand-name">NPD Central</div>
          <div className="tnav-brand-sub">MOSAIC WELLNESS</div>
        </div>
      </button>

      <div className="tnav-separator" />

      {/* Nav items (desktop) */}
      <div className="tnav-items">
        <button
          className={`tnav-item${view === 'dashboard' ? ' active' : ''}`}
          onClick={onDashboard}
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </button>

        {accessible.map(sec => {
          const isActive = activeSection?.id === sec.id && view === 'section';
          const color = SECTION_COLORS[sec.id] || sec.color || '#16a34a';
          const accessibleFolders = (sec.folders || []).filter(f =>
            canView(currentUser.id, f.id, accessMatrix)
          );
          const isOpen = openDropdown === sec.id;

          return (
            <div
              key={sec.id}
              className="tnav-dropdown-wrap"
              onMouseEnter={() => setOpenDropdown(sec.id)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`tnav-item${isActive ? ' active' : ''}`}
                style={isActive ? { color, borderBottomColor: color } : {}}
                onClick={() => handleSectionClick(sec)}
              >
                <span>{sec.name}</span>
                {accessibleFolders.length > 0 && (
                  <span className={`tnav-chevron${isOpen ? ' open' : ''}`}><ChevronDown /></span>
                )}
              </button>

              {isOpen && accessibleFolders.length > 0 && (
                <div className="tnav-dropdown">
                  <div className="tnav-dd-section-label" style={{ color }}>
                    {sec.name}
                  </div>
                  {accessibleFolders.map(folder => {
                    const isFolderActive = activeFolder?.id === folder.id && isActive;
                    return (
                      <button
                        key={folder.id}
                        className={`tnav-dd-item${isFolderActive ? ' active' : ''}`}
                        style={isFolderActive ? { color, background: color + '12' } : {}}
                        onClick={() => handleFolderClick(sec, folder)}
                      >
                        <span className="tnav-dd-icon"><FolderSmIcon /></span>
                        <span className="tnav-dd-name">{folder.name}</span>
                        <span className="tnav-dd-count">{(folder.files || []).length}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <button
          className={`tnav-item${view === 'settings' ? ' active' : ''}`}
          onClick={() => { onSettings(); setMobileMenuOpen(false); }}
        >
          <SettingsIcon />
          <span>Settings</span>
        </button>
      </div>

      {/* Right: search + actions */}
      <div className="tnav-right">
        <div className={`tnav-search${searchFocused ? ' focused' : ''}`}>
          <span className="tnav-search-icon"><SearchIcon /></span>
          <input
            className="tnav-search-input"
            placeholder="Search files, tags..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <button className="tnav-search-clear" onClick={() => onSearchChange('')}>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <button className="tnav-icon-btn" onClick={onDarkToggle} title={darkMode ? 'Light mode' : 'Dark mode'}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        <button className="tnav-upload-btn" onClick={onUpload}>
          <UploadIcon />
          <span>Upload</span>
        </button>

        <button
          className={`tnav-asklib-btn${chatOpen ? ' active' : ''}`}
          onClick={onAskLib}
          title="Ask Lib - your Document Librarian"
        >
          <BotIcon />
          <span>Ask Lib</span>
          {!chatOpen && <span className="tnav-asklib-pulse" />}
        </button>

        <div className="tnav-user-wrap" ref={userMenuRef}>
          <button
            className="tnav-user-btn"
            onClick={() => setUserMenuOpen(o => !o)}
            title={currentUser.name}
          >
            <div className="tnav-avatar">
              {currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <span className="tnav-user-name">{currentUser.name.split(' ')[0]}</span>
            <ChevronDown />
          </button>
          {userMenuOpen && (
            <div className="tnav-user-menu">
              <div className="tnav-user-menu-info">
                <div className="tnav-user-menu-name">{currentUser.name}</div>
                <div className="tnav-user-menu-role">{currentUser.role}</div>
              </div>
              <div className="tnav-user-menu-divider" />
              {onLogout && (
                <button className="tnav-user-menu-item" onClick={() => { setUserMenuOpen(false); onLogout(); }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 12H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2M9.5 10L12 7l-2.5-3M12 7H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign out
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile hamburger */}
      <button className="tnav-mobile-ham" onClick={() => setMobileMenuOpen(o => !o)}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="tnav-mobile-menu">
          <button className={`tnav-mob-item${view === 'dashboard' ? ' active' : ''}`} onClick={() => { onDashboard(); setMobileMenuOpen(false); }}>
            Dashboard
          </button>
          {accessible.map(sec => (
            <button
              key={sec.id}
              className={`tnav-mob-item${activeSection?.id === sec.id && view === 'section' ? ' active' : ''}`}
              onClick={() => { handleSectionClick(sec); }}
            >
              {sec.name}
            </button>
          ))}
          <button className={`tnav-mob-item${view === 'settings' ? ' active' : ''}`} onClick={() => { onSettings(); setMobileMenuOpen(false); }}>
            Settings
          </button>
        </div>
      )}
    </nav>
  );
}
