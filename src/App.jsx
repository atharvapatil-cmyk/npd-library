import { useState, useEffect } from 'react';
import { USERS, FOLDER_TREE, getAccessMatrix } from './data/data.js';
import Login from './components/Login.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import FileExplorer from './components/FileExplorer.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import UploadModal from './components/UploadModal.jsx';
import Settings from './components/Settings.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState('dashboard');
  const [activeSection, setActiveSection] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accessMatrix, setAccessMatrix] = useState({});
  const [recentUploads, setRecentUploads] = useState([]);
  const [sections, setSections] = useState(FOLDER_TREE);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    if (currentUser) setAccessMatrix(getAccessMatrix());
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const goToSection = (section, folder = null) => {
    setActiveSection(section);
    setActiveFolder(folder);
    setView('section');
    setExpandedSection(section.id);
  };

  const goToDashboard = () => {
    setView('dashboard');
    setActiveSection(null);
    setActiveFolder(null);
  };

  const handleSidebarSectionClick = (section) => {
    if (expandedSection === section.id && activeSection?.id === section.id && view === 'section') {
      setExpandedSection(null);
    } else {
      setExpandedSection(section.id);
      goToSection(section);
    }
  };

  const handleSidebarFolderClick = (section, folder) => {
    goToSection(section, folder);
  };

  const handleAddSection = (newSection) => {
    setSections(prev => [...prev, newSection]);
  };

  const handleAddFolder = (sectionId, newFolder) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, folders: [...(s.folders || []), newFolder] } : s
    ));
    setAccessMatrix(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(uid => {
        updated[uid] = { ...updated[uid], [newFolder.id]: 1 };
      });
      return updated;
    });
  };

  if (!currentUser) {
    return <Login users={USERS} onLogin={setCurrentUser} />;
  }

  return (
    <div className={`app-layout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      <Sidebar
        currentUser={currentUser}
        sections={sections}
        accessMatrix={accessMatrix}
        activeSection={activeSection}
        activeFolder={activeFolder}
        expandedSection={expandedSection}
        view={view}
        onSectionClick={handleSidebarSectionClick}
        onFolderClick={handleSidebarFolderClick}
        onDashboard={goToDashboard}
        onSettings={() => setView('settings')}
      />
      <div className="main-area">
        <Header
          currentUser={currentUser}
          view={view}
          activeSection={activeSection}
          activeFolder={activeFolder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          darkMode={darkMode}
          onDarkToggle={() => setDarkMode(d => !d)}
          onUpload={() => setShowUpload(true)}
          onNavigate={goToDashboard}
        />
        <main className="main-content">
          {view === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              sections={sections}
              accessMatrix={accessMatrix}
              recentUploads={recentUploads}
              onSectionClick={handleSidebarSectionClick}
            />
          )}
          {view === 'section' && (
            <FileExplorer
              section={activeSection}
              sections={sections}
              currentUser={currentUser}
              accessMatrix={accessMatrix}
              activeFolder={activeFolder}
              onFolderClick={setActiveFolder}
              onBack={() => setActiveFolder(null)}
              onAddFolder={(f) => activeSection && handleAddFolder(activeSection.id, f)}
            />
          )}
          {view === 'settings' && (
            <Settings
              users={USERS}
              sections={sections}
              accessMatrix={accessMatrix}
              onMatrixChange={setAccessMatrix}
              currentUser={currentUser}
              onAddSection={handleAddSection}
              onAddFolder={handleAddFolder}
            />
          )}
        </main>
      </div>

      {/* Floating Chat Button - bottom left */}
      <button
        className={`chat-fab${chatOpen ? ' chat-fab-open' : ''}`}
        onClick={() => setChatOpen(o => !o)}
        title="Ask Lib â your Document Librarian"
      >
        {chatOpen ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        ) : (
          <>
            <span className="chat-fab-emoji">ð</span>
            <span className="chat-fab-label">Ask Lib</span>
            <span className="chat-fab-pulse"/>
          </>
        )}
      </button>

      {chatOpen && (
        <ChatPanel
          onClose={() => setChatOpen(false)}
          currentUser={currentUser}
          accessMatrix={accessMatrix}
          sections={sections}
        />
      )}

      {showUpload && (
        <UploadModal
          sections={sections}
          currentUser={currentUser}
          accessMatrix={accessMatrix}
          onClose={() => setShowUpload(false)}
          onUpload={fileData => {
            setRecentUploads(prev => [{
              name: fileData.name || 'Uploaded File',
              section: fileData.section || '',
              folder: fileData.folder || '',
              tags: [],
              uploadedBy: currentUser.name,
              uploadedAt: new Date().toISOString(),
            }, ...prev].slice(0, 100));
          }}
        />
      )}
    </div>
  );
}
