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
  const [view, setView] = useState('dashboard');
  const [activeSection, setActiveSection] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const [accessMatrix, setAccessMatrix] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setAccessMatrix(getAccessMatrix ? getAccessMatrix() : {});
    }
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  function handleLogin(user) {
    setCurrentUser(user);
    setView('dashboard');
  }

  function handleLogout() {
    setCurrentUser(null);
    setView('dashboard');
    setActiveSection(null);
    setActiveFolder(null);
    setChatOpen(false);
  }

  function handleNavigate({ section, folder } = {}) {
    if (section !== undefined) setActiveSection(section);
    if (folder !== undefined) setActiveFolder(folder);
    if (section || folder) setView('explorer');
  }

  function handleAccessChange(userId, folderId, level) {
    setAccessMatrix(prev => ({
      ...prev,
      [userId]: { ...(prev[userId] || {}), [folderId]: level }
    }));
  }

  if (!currentUser) {
    return <Login users={USERS || []} onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        currentUser={currentUser}
        accessMatrix={accessMatrix}
        activeSection={activeSection}
        activeFolder={activeFolder}
        view={view}
        onNavigate={handleNavigate}
        onViewChange={setView}
        onLogout={handleLogout}
      />

      <Header
        currentUser={currentUser}
        view={view}
        activeSection={activeSection}
        activeFolder={activeFolder}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onChatToggle={() => setChatOpen(o => !o)}
        chatOpen={chatOpen}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
        onMenuToggle={() => setSidebarOpen(o => !o)}
        onLogout={handleLogout}
      />

      <main className={'main-content' + (chatOpen ? ' main-with-chat' : '')}>
        {view === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            accessMatrix={accessMatrix}
            onNavigate={handleNavigate}
            onUpload={() => setUploadOpen(true)}
          />
        )}
        {view === 'explorer' && (
          <FileExplorer
            currentUser={currentUser}
            accessMatrix={accessMatrix}
            activeSection={activeSection}
            activeFolder={activeFolder}
            onNavigate={handleNavigate}
            onUpload={() => setUploadOpen(true)}
            searchQuery={searchQuery}
          />
        )}
        {view === 'settings' && (
          <Settings
            currentUser={currentUser}
            accessMatrix={accessMatrix}
            onAccessChange={handleAccessChange}
          />
        )}
      </main>

      {chatOpen && (
        <ChatPanel
          currentUser={currentUser}
          activeSection={activeSection ? (FOLDER_TREE || []).find(s => s.id === activeSection)?.name : null}
          onClose={() => setChatOpen(false)}
        />
      )}

      {uploadOpen && (
        <UploadModal
          currentUser={currentUser}
          accessMatrix={accessMatrix}
          defaultSection={activeSection}
          defaultFolder={activeFolder}
          onClose={() => setUploadOpen(false)}
        />
      )}
    </div>
  );
}
