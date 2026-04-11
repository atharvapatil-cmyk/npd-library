import { useState, useEffect } from 'react';
import { INITIAL_USERS, buildDefaultMatrix, FOLDER_TREE } from './data/data.js';
import Login from './components/Login.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import FileExplorer from './components/FileExplorer.jsx';
import Settings from './components/Settings.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import UploadModal from './components/UploadModal.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('dashboard'); // dashboard | files | settings
  const [activeSection, setActiveSection] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const [accessMatrix, setAccessMatrix] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Build default access matrix when user list is available
  useEffect(() => {
    const matrix = buildDefaultMatrix(INITIAL_USERS);
    setAccessMatrix(matrix);
  }, []);

  // Handle login
  const handleLogin = (user) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setView('dashboard');
    setActiveSection(null);
    setActiveFolder(null);
  };

  // Navigate to a section/folder
  const handleNavigate = (sectionId, folderId = null) => {
    setActiveSection(sectionId);
    setActiveFolder(folderId);
    setView('files');
  };

  // Update access matrix (admin only)
  const handleMatrixUpdate = (userId, folderId, level) => {
    setAccessMatrix(prev => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        [folderId]: level,
      },
    }));
  };

  if (!currentUser) {
    return (
      <>
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <Login users={INITIAL_USERS} onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <div className="bg-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

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
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          onToggleChat={() => setChatOpen(o => !o)}
          onViewChange={setView}
          onNavigate={handleNavigate}
        />

        <main className="main-content">
          {view === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              accessMatrix={accessMatrix}
              onNavigate={handleNavigate}
              onUpload={() => setUploadOpen(true)}
            />
          )}
          {view === 'files' && (
            <FileExplorer
              currentUser={currentUser}
              accessMatrix={accessMatrix}
              activeSection={activeSection}
              activeFolder={activeFolder}
              searchQuery={searchQuery}
              onNavigate={handleNavigate}
              onUpload={() => setUploadOpen(true)}
            />
          )}
          {view === 'settings' && (
            <Settings
              currentUser={currentUser}
              users={INITIAL_USERS}
              accessMatrix={accessMatrix}
              onMatrixUpdate={handleMatrixUpdate}
            />
          )}
        </main>
      </div>

      {chatOpen && (
        <ChatPanel
          currentUser={currentUser}
          activeSection={activeSection}
          activeFolder={activeFolder}
          onClose={() => setChatOpen(false)}
        />
      )}

      {uploadOpen && (
        <UploadModal
          currentUser={currentUser}
          activeSection={activeSection}
          activeFolder={activeFolder}
          accessMatrix={accessMatrix}
          onClose={() => setUploadOpen(false)}
        />
      )}
    </>
  );
}
