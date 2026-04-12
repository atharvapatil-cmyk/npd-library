import { useState } from 'react';
import { FOLDER_TREE, USERS } from '../data/data.js';

const LEVELS = [
  { value: 0, label: 'No Access', short: 'None', cls: 'acc-none' },
  { value: 1, label: 'View Only', short: 'View', cls: 'acc-view' },
  { value: 2, label: 'Can Edit', short: 'Edit', cls: 'acc-edit' },
  { value: 3, label: 'Admin', short: 'Admin', cls: 'acc-admin' }
];

function cycleLevel(current) {
  return (current + 1) % 4;
}

export default function Settings({ currentUser, accessMatrix, onAccessChange }) {
  const user = currentUser || {};
  const isAdmin = user.role === 'admin';

  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedUserId, setSelectedUserId] = useState((USERS || [])[0]?.id || '');

  if (!isAdmin) {
    return (
      <div className="settings-page">
        <div className="settings-denied">
          <div className="settings-denied-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div className="settings-denied-title">Admin Access Required</div>
          <div className="settings-denied-sub">Contact your administrator to manage access settings.</div>
        </div>
      </div>
    );
  }

  const selectedUser = (USERS || []).find(u => u.id === selectedUserId) || {};
  const userMatrix = (accessMatrix || {})[selectedUserId] || {};

  function setLevel(folderId, level) {
    onAccessChange && onAccessChange(selectedUserId, folderId, level);
  }

  function setAllForUser(level) {
    (FOLDER_TREE || []).forEach(sec => {
      (sec.folders || []).forEach(folder => {
        onAccessChange && onAccessChange(selectedUserId, folder.id, level);
      });
    });
  }

  function setAllForSection(secFolders, level) {
    secFolders.forEach(folder => {
      onAccessChange && onAccessChange(selectedUserId, folder.id, level);
    });
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Access Control Matrix</h1>
        <p className="settings-sub">Manage per-user, per-folder permissions across all sections</p>
      </div>

      <div className="settings-tabs">
        <button className={'settings-tab' + (activeTab === 'matrix' ? ' active' : '')} onClick={() => setActiveTab('matrix')}>Access Matrix</button>
        <button className={'settings-tab' + (activeTab === 'profiles' ? ' active' : '')} onClick={() => setActiveTab('profiles')}>User Profiles</button>
      </div>

      {activeTab === 'matrix' && (
        <div className="access-matrix-layout">
          <div className="access-legend">
            {LEVELS.map(l => (
              <div key={l.value} className="legend-item">
                <span className={'legend-pill ' + l.cls}>{l.short}</span>
                <span className="legend-label">{l.label}</span>
              </div>
            ))}
            <div className="legend-hint">Click any permission pill to cycle through levels</div>
          </div>

          <div className="access-matrix-body">
            <div className="user-selector">
              {(USERS || []).map(u => {
                const rawInitials = (u.avatar || (u.name || 'U').substring(0, 2)).toString();
                const initials = rawInitials.replace(/[^\x20-\x7E]/g, '').substring(0, 2).toUpperCase() || 'U';
                return (
                  <button
                    key={u.id}
                    className={'user-chip' + (u.id === selectedUserId ? ' active' : '')}
                    onClick={() => setSelectedUserId(u.id)}
                  >
                    <div className="user-chip-avatar" style={{ background: u.color || '#6b7280' }}>{initials}</div>
                    <div className="user-chip-info">
                      <div className="user-chip-name">{u.name}</div>
                      <div className="user-chip-role">{u.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="matrix-panel">
              <div className="matrix-user-header">
                <div className="matrix-user-avatar" style={{ background: selectedUser.color || '#6b7280' }}>
                  {((selectedUser.avatar || (selectedUser.name || 'U').substring(0,2)).toString().replace(/[^\x20-\x7E]/g,'').substring(0,2).toUpperCase()) || 'U'}
                </div>
                <div>
                  <div className="matrix-user-name">{selectedUser.name}</div>
                  <div className="matrix-user-role">{selectedUser.role}</div>
                </div>
                <div className="matrix-bulk-actions">
                  <span className="matrix-bulk-label">Set all:</span>
                  {LEVELS.map(l => (
                    <button key={l.value} className={'matrix-bulk-btn ' + l.cls} onClick={() => setAllForUser(l.value)}>{l.short}</button>
                  ))}
                </div>
              </div>

              <div className="matrix-sections">
                {(FOLDER_TREE || []).map(sec => (
                  <div key={sec.id} className="matrix-section">
                    <div className="matrix-section-header">
                      <div className="matrix-section-dot" style={{ background: sec.color || '#16a34a' }}/>
                      <div className="matrix-section-name">{sec.name}</div>
                      <div className="matrix-section-owner">{sec.owner}</div>
                      <div className="matrix-section-bulk">
                        {LEVELS.map(l => (
                          <button key={l.value} className={'matrix-bulk-btn ' + l.cls} onClick={() => setAllForSection(sec.folders || [], l.value)}>{l.short}</button>
                        ))}
                      </div>
                    </div>
                    <div className="matrix-folder-list">
                      {(sec.folders || []).map(folder => {
                        const currentLevel = userMatrix[folder.id] || 0;
                        const currentLevelObj = LEVELS[currentLevel];
                        return (
                          <div key={folder.id} className="matrix-folder-row">
                            <div className="matrix-folder-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                            </div>
                            <div className="matrix-folder-name">{folder.name}</div>
                            <div className="matrix-access-btns">
                              {LEVELS.map(l => (
                                <button
                                  key={l.value}
                                  className={'matrix-access-btn ' + l.cls + (currentLevel === l.value ? ' active' : '')}
                                  onClick={() => setLevel(folder.id, l.value)}
                                  title={l.label}
                                >{l.short}</button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="profiles-grid">
          {(USERS || []).map(u => {
            const rawInitials = (u.avatar || (u.name || 'U').substring(0, 2)).toString();
            const initials = rawInitials.replace(/[^\x20-\x7E]/g, '').substring(0, 2).toUpperCase() || 'U';
            const userAccess = (accessMatrix || {})[u.id] || {};
            const accessCount = Object.values(userAccess).filter(v => v > 0).length;
            const adminCount = Object.values(userAccess).filter(v => v === 3).length;
            return (
              <div key={u.id} className="profile-card">
                <div className="profile-avatar" style={{ background: u.color || '#6b7280' }}>{initials}</div>
                <div className="profile-name">{u.name}</div>
                <div className="profile-role">{u.role}</div>
                <div className="profile-stats">
                  <div className="profile-stat"><span className="profile-stat-val">{accessCount}</span><span className="profile-stat-label">folders</span></div>
                  <div className="profile-stat"><span className="profile-stat-val">{adminCount}</span><span className="profile-stat-label">admin</span></div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedUserId(u.id); setActiveTab('matrix'); }}>Edit Access</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
