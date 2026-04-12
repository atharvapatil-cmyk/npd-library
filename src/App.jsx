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

  useEffect(() => {
    if (currentUser) {
      setAccessMatrix(getAccessMatrix());
    }
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const goToSection = (section) => {
    setActiveSection(section);
    setActiveFolder(null);
    setView('section');
  };

  const goToDashboard = () => {
    setView('dashboard');
    setActiveSection(null);
    setActiveFolder(null);
  };

  if (!currentUser) {
    return <Login users={USERS} onLogin={setCurrentUser} />;
  }

  return (
    <div className={`app-layout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      <Sidebar
        currentUser={currentUser}
        sections={FOLDER_TREE}
        accessMatrix={accessMatrix}
        activeSection={activeSection}
        view={view}
        onSectionClick={goToSection}
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
          onChatToggle={() => setChatOpen(o => !o)}
          chatOpen={chatOpen}
          darkMode={darkMode}
          onDarkToggle={() => setDarkMode(d => !d)}
          onUpload={() => setShowUpload(true)}
          onNavigate={goToDashboard}
        />
        <main className="main-content">
          {view === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              sections={FOLDER_TREE}
              accessMatrix={accessMatrix}
              recentUploads={recentUploads}
              onSectionClick={goToSection}
            />
          )}
          {view === 'section' && (
            <FileExplorer
              section={activeSection}
              currentUser={currentUser}
              accessMatrix={accessMatrix}
              activeFolder={activeFolder}
              onFolderClick={setActiveFolder}
              onBack={() => setActiveFolder(null)}
            />
          )}
          {view === 'settings' && (
            <Settings
              users={USERS}
              sections={FOLDER_TREE}
              accessMatrix={accessMatrix}
              onMatrixChange={setAccessMatrix}
            />
          )}
        </main>
      </div>
      {chatOpen && (
        <ChatPanel
          onClose={() => setChatOpen(false)}
          currentUser={currentUser}
          accessMatrix={accessMatrix}
        />
      )}
      {showUpload && (
        <UploadModal
          sections={FOLDER_TREE}
          currentUser={currentUser}
          accessMatrix={accessMatrix}
          onClose={() => setShowUpload(false)}
          onUpload={fileData => {
            setRecentUploads(prev => [{
              name: fileData.name || 'Uploaded File',
              section: fileData.section || '',
              folder: fileData.folder || '',
              description: fileData.description || '',
              uploadedBy: currentUser.name,
              uploadedAt: new Date().toISOString(),
            }, ...prev].slice(0, 100));
          }}
        />
      )}
    </div>
  );
}
