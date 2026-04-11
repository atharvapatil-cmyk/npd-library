import { useState } from 'react';
import { FOLDER_TREE, ACCESS, ACCESS_LABEL } from '../data/data.js';

export default function Settings({ currentUser, users, accessMatrix, onMatrixUpdate }) {
  const [selectedUser, setSelectedUser] = useState(users[0]?.id || null);
  const [activeTab, setActiveTab] = useState('access');

  const isAdmin = currentUser.role === 'admin';
  if (!isAdmin) {
    return (
      <div className="settings-denied">
        <div className="settings-denied-icon">L</div>
        <div className="settings-denied-title">Access Restricted</div>
        <div className="settings-denied-sub">Only administrators can manage access control.</div>
      </div>
    );
  }

  const targetUser = users.find(u => u.id === selectedUser);

  const getLevel = (userId, folderId) => {
    return (accessMatrix[userId] && accessMatrix[userId][folderId] !== undefined)
      ? accessMatrix[userId][folderId]
      : ACCESS.NONE;
  };

  const cycleAccess = (userId, folderId) => {
    const current = getLevel(userId, folderId);
    const next = (current + 1) % 4;
    onMatrixUpdate(userId, folderId, next);
  };

  const setAllForUser = (userId, level) => {
    FOLDER_TREE.forEach(section => {
      section.folders.forEach(folder => {
        onMatrixUpdate(userId, folder.id, level);
      });
    });
  };

  const setAllForFolder = (folderId, level) => {
    users.forEach(u => {
      onMatrixUpdate(u.id, folderId, level);
    });
  };

  const levelColors = ['#4b7c5e', '#3b82f6', '#f59e0b', '#4ade80'];
  const levelBg = ['rgba(75,124,94,0.1)', 'rgba(59,130,246,0.12)', 'rgba(245,158,11,0.12)', 'rgba(74,222,128,0.12)'];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Access Control Matrix</h2>
        <p className="settings-sub">Manage per-user, per-folder permissions across all sections</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'access' ? 'active' : ''}`}
          onClick={() => setActiveTab('access')}
        >
          Access Matrix
        </button>
        <button
          className={`settings-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Profiles
        </button>
      </div>

      {activeTab === 'access' && (
        <div className="access-matrix-wrapper">
          <div className="access-legend">
            {ACCESS_LABEL.map((label, i) => (
              <div key={i} className="legend-item">
                <div className="legend-dot" style={{ background: levelColors[i] }} />
                <span>{label}</span>
              </div>
            ))}
            <div className="legend-hint">Click any cell to cycle access level</div>
          </div>

          <div className="user-selector">
            {users.map(u => (
              <div
                key={u.id}
                className={`user-selector-chip ${selectedUser === u.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(u.id)}
              >
                <div className="user-chip-avatar" style={{ background: `linear-gradient(135deg, ${u.color || '#16a34a'}88, ${u.color || '#16a34a'})` }}>
                  {u.avatar}
                </div>
                {u.name.split(' ')[0]}
              </div>
            ))}
          </div>

          {targetUser && (
            <div className="matrix-user-panel">
              <div className="matrix-user-header">
                <div className="matrix-user-avatar" style={{ background: `linear-gradient(135deg, ${targetUser.color || '#16a34a'}88, ${targetUser.color || '#16a34a'})` }}>
                  {targetUser.avatar}
                </div>
                <div>
                  <div className="matrix-user-name">{targetUser.name}</div>
                  <div className="matrix-user-role">{targetUser.role}</div>
                </div>
                <div className="matrix-bulk-actions">
                  <span className="matrix-bulk-label">Set all:</span>
                  {ACCESS_LABEL.map((label, i) => (
                    <button
                      key={i}
                      className="matrix-bulk-btn"
                      style={{ color: levelColors[i], borderColor: levelColors[i] + '44' }}
                      onClick={() => setAllForUser(targetUser.id, i)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {FOLDER_TREE.map(section => (
                <div key={section.id} className="matrix-section">
                  <div className="matrix-section-title" style={{ color: section.color }}>
                    <div className="matrix-section-dot" style={{ background: section.color }} />
                    {section.name}
                    {section.owner && <span className="matrix-section-owner">({section.owner})</span>}
                  </div>
                  <div className="matrix-folder-list">
                    {section.folders.map(folder => {
                      const level = getLevel(targetUser.id, folder.id);
                      return (
                        <div key={folder.id} className="matrix-folder-row">
                          <div className="matrix-folder-name">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M1 3C1 2.45 1.45 2 2 2H4.5L5.5 3H10C10.55 3 11 3.45 11 4V9C11 9.55 10.55 10 10 10H2C1.45 10 1 9.55 1 9V3Z" stroke="currentColor" strokeWidth="1.1"/>
                            </svg>
                            {folder.name}
                          </div>
                          <div className="matrix-access-buttons">
                            {ACCESS_LABEL.map((label, i) => (
                              <button
                                key={i}
                                className={`matrix-access-btn ${level === i ? 'active' : ''}`}
                                style={level === i ? { background: levelBg[i], color: levelColors[i], borderColor: levelColors[i] + '66' } : {}}
                                onClick={() => onMatrixUpdate(targetUser.id, folder.id, i)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-grid">
          {users.map(u => (
            <div key={u.id} className="user-profile-card">
              <div className="user-profile-avatar" style={{ background: `linear-gradient(135deg, ${u.color || '#16a34a'}88, ${u.color || '#16a34a'})` }}>
                {u.avatar}
              </div>
              <div className="user-profile-name">{u.name}</div>
              <div className="user-profile-role">{u.role}</div>
              {u.department && <div className="user-profile-dept">{u.department}</div>}
              <div className="user-profile-access">
                {FOLDER_TREE.reduce((count, section) =>
                  count + section.folders.filter(f =>
                    getLevel(u.id, f.id) > ACCESS.NONE
                  ).length, 0
                )} folders accessible
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
