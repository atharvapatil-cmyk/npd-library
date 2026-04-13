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

const STORAGE_KEY_USERS = 'npd_extra_users';

function loadExtraUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
  } catch { return []; }
}

function saveExtraUsers(users) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

export default function App() {
  const [currentUser,      setCurrentUser]      = useState(null);
  const [chatOpen,         setChatOpen]         = useState(false);
  const [darkMode,         setDarkMode]         = useState(false);
  const [view,             setView]             = useState('dashboard');
  const [activeSection,    setActiveSection]    = useState(null);
  const [activeFolder,     setActiveFolder]     = useState(null);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [showUpload,       setShowUpload]       = useState(false);
  const [sidebarOpen,      setSidebarOpen]      = useState(true);
  const [accessMatrix,     setAccessMatrix]     = useState({});
  const [recentUploads,    setRecentUploads]    = useState([]);
  const [sections,         setSections]         = useState(FOLDER_TREE);
  const [expandedSection,  setExpandedSection]  = useState(null);
  const [extraUsers,       setExtraUsers]       = useState(loadExtraUsers);

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

  const handleAddUser = (newUser) => {
    const updated = [...extraUsers.filter(u => u.id !== newUser.id), newUser];
    setExtraUsers(updated);
    saveExtraUsers(updated);
    // Init their access matrix row
    setAccessMatrix(prev => ({
      ...prev,
      [newUser.id]: prev[newUser.id] || {}
    }));
  };

  const handleRemoveUser = (userId) => {
    const updated = extraUsers.filter(u => u.id !== userId);
    setExtraUsers(updated);
    saveExtraUsers(updated);
  };

  if (!currentUser) {
    return (
      <Login
        users={USERS}
        extraUsers={extraUsers}
        onLogin={setCurrentUser}
      />
    );
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
          onAskLib={() => setChatOpen(o => !o)}
          chatOpen={chatOpen}
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
              extraUsers={extraUsers}
              sections={sections}
              accessMatrix={accessMatrix}
              onMatrixChange={setAccessMatrix}
              currentUser={currentUser}
              onAddSection={handleAddSection}
              onAddFolder={handleAddFolder}
              onAddUser={handleAddUser}
              onRemoveUser={handleRemoveUser}
            />
          )}
        </main>
      </div>

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
  
  }
