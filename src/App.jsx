import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { INITIAL_FILES, INITIAL_USERS, FOLDER_TREE, canView, getFolderById, getParentSection, fileTypeLabel, fileTypeColor } from './data/data';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileExplorer from './components/FileExplorer';
import ChatPanel from './components/ChatPanel';
import UploadModal from './components/UploadModal';
import FileDetail from './components/FileDetail';
import Settings from './components/Settings';

function AppInner() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activePage, setActivePage] = useState('library'); // 'library' | 'settings'

  const accessibleFiles = files.filter(f => {
    const folder = getFolderById(f.folderId);
    return folder ? canView(currentUser?.role, folder) : false;
  });

  const handleUpload = (fileObj) => setFiles(prev => [fileObj, ...prev]);

  const handleDelete = (fileId) => setFiles(prev => prev.filter(f => f.id !== fileId));

  const handleToggleStar = (fileId) =>
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, starred: !f.starred } : f));

  const handleFolderClick = (folder) => {
    if (!canView(currentUser?.role, folder)) return;
    setCurrentFolder(folder);
    setSearchQuery('');
    setActivePage('library');
  };

  const handleHomeClick = () => {
    setCurrentFolder(null);
    setSearchQuery('');
    setActivePage('library');
  };

  // Search filter
  const searchedFiles = searchQuery
    ? accessibleFiles.filter(f => {
        const q = searchQuery.toLowerCase();
        return f.name.toLowerCase().includes(q)
          || f.desc.toLowerCase().includes(q)
          || f.tags.some(t => t.includes(q))
          || users.find(u => u.id === f.uploadedBy)?.name.toLowerCase().includes(q);
      })
    : null;

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  const chatOffset = showChat ? 380 : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Header
        user={currentUser}
        fileCount={accessibleFiles.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        chatOpen={showChat}
        onChatToggle={() => setShowChat(p => !p)}
        onLogout={() => { setCurrentUser(null); setCurrentFolder(null); setShowChat(false); }}
        onSettingsClick={() => setActivePage('settings')}
      />

      <div style={{ paddingTop: 'var(--header-height)', display: 'flex' }}>
        <Sidebar
          user={currentUser}
          currentFolderId={currentFolder?.id}
          onFolderClick={handleFolderClick}
          onHomeClick={handleHomeClick}
          files={accessibleFiles}
          onSettingsClick={() => setActivePage('settings')}
          activePage={activePage}
        />

        <main style={{
          marginLeft: 'var(--sidebar-width)',
          marginRight: chatOffset,
          flex: 1,
          minHeight: 'calc(100vh - var(--header-height))',
          transition: 'margin-right 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden'
        }}>
          {activePage === 'settings' ? (
            <Settings user={currentUser} users={users} setUsers={setUsers} files={accessibleFiles} />
          ) : searchQuery ? (
            <SearchResults
              query={searchQuery}
              files={searchedFiles}
              user={currentUser}
              users={users}
              onFileClick={setSelectedFile}
            />
          ) : !currentFolder ? (
            <Dashboard
              user={currentUser}
              files={accessibleFiles}
              users={users}
              onFolderClick={handleFolderClick}
            />
          ) : (
            <FileExplorer
              user={currentUser}
              currentFolder={currentFolder}
              files={accessibleFiles}
              users={users}
              onUploadClick={() => setShowUpload(true)}
              onFileClick={setSelectedFile}
            />
          )}
        </main>

        {showChat && (
          <ChatPanel
            user={currentUser}
            files={accessibleFiles}
            users={users}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>

      {showUpload && (
        <UploadModal
          user={currentUser}
          currentFolder={currentFolder}
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
        />
      )}

      {selectedFile && (
        <FileDetail
          file={selectedFile}
          user={currentUser}
          users={users}
          onClose={() => setSelectedFile(null)}
          onDelete={(id) => { handleDelete(id); setSelectedFile(null); }}
          onToggleStar={handleToggleStar}
        />
      )}
    </div>
  );
}

// Inline SearchResults (simple, no extra file needed)
function SearchResults({ query, files, user, users, onFileClick }) {
  // helpers are imported at top of file
  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          Search Results
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
          {files.length} result{files.length !== 1 ? 's' : ''} for "{query}"
        </p>
      </div>
      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>ð</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>No files found</div>
          <div style={{ fontSize: 13 }}>Try different keywords or check your access permissions</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {files.map(f => {
            const folder = getFolderById(f.folderId);
            const parent = getParentSection(f.folderId);
            const uploader = users.find(u => u.id === f.uploadedBy);
            const color = fileTypeColor(f.type);
            return (
              <div key={f.id} onClick={() => onFileClick(f)} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {parent?.emoji} {parent?.name} âº {folder?.name}
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, borderTop: `3px solid ${color}`, transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color, background: color + '18', padding: '3px 8px', borderRadius: 6 }}>{fileTypeLabel(f.type)}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{f.version}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{f.desc}</div>
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                    {uploader?.name} Â· {new Date(f.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
