import { useState } from 'react';

const LEVELS = [
  { label: 'No Access', short: 'None', bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
  { label: 'View',      short: 'View', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  { label: 'Edit',      short: 'Edit', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  { label: 'Admin',     short: 'Admin',bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
];

const ROLES = ['admin', 'nutra_lead', 'pc_lead', 'reg_lead', 'pmo', 'rd_member'];

function AddSectionModal({ onClose, onAdd }) {
  const [name, setName]   = useState('');
  const [tag,  setTag]    = useState('');
  const [color, setColor] = useState('#6b7280');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    onAdd({ id, name: name.trim(), tag: tag.trim() || name.slice(0,4).toUpperCase(), color, folders: [] });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div className="modal-title">New Section</div>
          <button className="modal-x" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <label className="modal-label">Section Name</label>
          <input className="modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Clinical Trials" autoFocus/>
          <label className="modal-label">Short Tag <span style={{color:'#9ca3af',fontWeight:400}}>(max 6 chars)</span></label>
          <input className="modal-input" value={tag} onChange={e => setTag(e.target.value)} placeholder="e.g. CLIN" maxLength={6}/>
          <label className="modal-label">Color</label>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <input type="color" className="modal-input" value={color} onChange={e => setColor(e.target.value)} style={{ width:'60px', height:'44px', padding:'4px', cursor:'pointer' }}/>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background: color, border:'2px solid #e5e7eb' }}/>
            <span style={{ color:'var(--text-muted)', fontSize:'13px' }}>{color}</span>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Create Section</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onAdd, existingIds }) {
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [role,  setRole]  = useState('rd_member');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const id = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    onAdd({ id, name: name.trim(), email: email.trim().toLowerCase(), role });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div className="modal-title">Add Team Member</div>
          <button className="modal-x" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <label className="modal-label">Full Name</label>
          <input className="modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Sharma" autoFocus/>
          <label className="modal-label">Gmail / Work Email</label>
          <input className="modal-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="priya@mosaicwellness.in"/>
          <label className="modal-label">Role</label>
          <select className="modal-input" value={role} onChange={e => setRole(e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim() || !email.trim()}>Add Member</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AccessBadge({ level, onClick }) {
  const cfg = LEVELS[level] || LEVELS[0];
  return (
    <button
      className="access-badge"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
      onClick={onClick}
      title={`Click to change: ${cfg.label}`}
    >
      {cfg.short}
    </button>
  );
}

function UserRow({ user, sections, matrix, onMatrixChange, onRemove, isCurrentUser }) {
  const [expanded, setExpanded] = useState(false);

  const allFolders = sections.flatMap(s =>
    (s.folders || []).map(f => ({ ...f, sectionName: s.name, sectionId: s.id, sectionColor: s.color || '#6b7280' }))
  );

  const cycleAccess = (folderId) => {
    const cur = matrix[user.id]?.[folderId] || 0;
    const next = (cur + 1) % LEVELS.length;
    onMatrixChange(prev => ({
      ...prev,
      [user.id]: { ...(prev[user.id] || {}), [folderId]: next }
    }));
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colorMap = { admin: '#15803d', nutra_lead: '#1d4ed8', pc_lead: '#7c3aed', reg_lead: '#d97706', pmo: '#334155', rd_member: '#6b7280' };
  const avatarColor = colorMap[user.role] || '#6b7280';

  return (
    <div className="user-row-card">
      <div className="user-row-header" onClick={() => setExpanded(!expanded)}>
        <div className="user-row-info">
          <div className="user-row-avatar" style={{ background: avatarColor + '22', color: avatarColor, border: `1.5px solid ${avatarColor}44` }}>
            {initials}
          </div>
          <div>
            <div className="user-row-name">{user.name} {isCurrentUser && <span className="you-badge">You</span>}</div>
            <div className="user-row-meta">{user.role}{user.email ? ` · ${user.email}` : ''}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {user.role !== 'admin' && !isCurrentUser && (
            <button
              className="btn btn-ghost"
              style={{ fontSize:'12px', padding:'4px 10px' }}
              onClick={e => { e.stopPropagation(); onRemove(user.id); }}
            >Remove</button>
          )}
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: expanded ? 'rotate(180deg)' : '', transition: 'transform 0.2s', color: 'var(--text-muted)' }}
          >
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="user-access-grid">
          {sections.map(sec => {
            const folders = (sec.folders || []);
            if (folders.length === 0) return null;
            return (
              <div key={sec.id} className="user-access-section">
                <div className="user-access-section-name" style={{ color: sec.color || '#16a34a' }}>
                  {sec.name}
                </div>
                <div className="user-access-folders">
                  {folders.map(f => (
                    <div key={f.id} className="user-access-folder-row">
                      <span className="user-access-folder-name">{f.name}</span>
                      {user.role === 'admin' ? (
                        <span className="access-badge" style={{ background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0' }}>Admin</span>
                      ) : (
                        <AccessBadge
                          level={matrix[user.id]?.[f.id] || 0}
                          onClick={() => cycleAccess(f.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Settings({
  users, sections, accessMatrix, onMatrixChange,
  currentUser, onAddSection, onAddFolder, extraUsers, onAddUser, onRemoveUser,
}) {
  const [tab,           setTab]           = useState('access');
  const [filterUser,    setFilterUser]    = useState('all');
  const [showNewSec,    setShowNewSec]    = useState(false);
  const [showNewUser,   setShowNewUser]   = useState(false);

  const allUsers = [...(users || []), ...(extraUsers || [])];

  // Access Control Tab
  const displayUsers = filterUser === 'all' ? allUsers : allUsers.filter(u => u.id === filterUser);

  const handleAddSection = (sec) => {
    onAddSection(sec);
    // init access for all users
    onMatrixChange(prev => {
      const next = { ...prev };
      allUsers.forEach(u => { next[u.id] = { ...(next[u.id] || {}) }; });
      return next;
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-title-row">
          <div>
            <h2 className="settings-title">Access Control</h2>
            <p className="settings-subtitle">Manage team members and their folder-level permissions</p>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            {tab === 'access' && currentUser.role === 'admin' && (
              <button className="btn btn-ghost" onClick={() => setShowNewSec(true)}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{marginRight:'5px'}}>
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                New Section
              </button>
            )}
            {tab === 'users' && currentUser.role === 'admin' && (
              <button className="btn btn-primary" onClick={() => setShowNewUser(true)}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{marginRight:'5px'}}>
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                Add Member
              </button>
            )}
          </div>
        </div>


const LEVELS = [
  { label: 'No Access', short: 'None', bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
  { label: 'View',      short: 'View', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  { label: 'Edit',      short: 'Edit', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  { label: 'Admin',     short: 'Admin',bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
];

const ROLES = ['admin', 'nutra_lead', 'pc_lead', 'reg_lead', 'pmo', 'rd_member'];

function AddSectionModal({ onClose, onAdd }) {
  const [name, setName]   = useState('');
  const [tag,  setTag]    = useState('');
  const [color, setColor] = useState('#6b7280');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    onAdd({ id, name: name.trim(), tag: tag.trim() || name.slice(0,4).toUpperCase(), color, folders: [] });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
  #     <div className="modal-hd">
          <div className="modal-title">New Section</div>
          <button className="modal-x" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <label className="modal-label">Section Name</label>
          <input className="modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Clinical Trials" autoFocus/>
          <label className="modal-label">Short Tag <span style={{color:'#9ca3af',fontWeight:400}}>(max 6 chars)</span></label>
          <input className="modal-input" value={tag} onChange={e => setTag(e.target.value)} placeholder="e.g. CLIN" maxLength={6}/>
          <label className="modal-label">Color</label>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <input type="color" className="modal-input" value={color} onChange={e => setColor(e.target.value)} style={{ width:'60px', height:'44px', padding:'4px', cursor:'pointer' }}/>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background: color, border:'2px solid #e5e7eb' }}/>
            <span style={{ color:'var(--text-muted)', fontSize:'13px' }}>{color}</span>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Create Section</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onAdd, existingIds }) {
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [role,  setRole]  = useState('rd_member');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const id = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    onAdd({ id, name: name.trim(), email: email.trim().toLowerCase(), role });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div className="modal-title">Add Team Member</div>
          <button className="modal-x" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <label className="modal-label">Full Name</label>
          <input className="modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Sharma" autoFocus/>
          <label className="modal-label">Gmail / Work Email</label>
          <input className="modal-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="priya@mosaicwellness.in"/>
          <label className="modal-label">Role</label>
          <select className="modal-input" value={role} onChange={e => setRole(e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim() || !email.trim()}>Add Member</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AccessBadge({ level, onClick }) {
  const cfg = LEVELS[level] || LEVELS[0];
  return (
    <button
      className="access-badge"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
      onClick={onClick}
      title={`Click to change: ${cfg.label}`}
    >
      {cfg.short}
    </button>
  );
}

function UserRow({ user, sections, matrix, onMatrixChange, onRemove, isCurrentUser }) {
  const [expanded, setExpanded] = useState(false);

  const allFolders = sections.flatMap(s =>
    (s.folders || []).map(f => ({ ...f, sectionName: s.name, sectionId: s.id, sectionColor: s.color || '#6b7280' }))
  );

  const cycleAccess = (folderId) => {
    const cur = matrix[user.id]?.[folderId] || 0;
    const next = (cur + 1) % LEVELS.length;
    onMatrixChange(prev => ({
      ...prev,
      [user.id]: { ...(prev[user.id] || {}), [folderId]: next }
    }));
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colorMap = { admin: '#15803d', nutra_lead: '#1d4ed8', pc_lead: '#7c3aed', reg_lead: '#d97706', pmo: '#334155', rd_member: '#6b7280' };
  const avatarColor = colorMap[user.role] || '#6b7280';

  return (
    <div className="user-row-card">
      <div className="user-row-header" onClick={() => setExpanded(!expanded)}>
        <div className="user-row-info">
          <div className="user-row-avatar" style={{ background: avatarColor + '22', color: avatarColor, border: `1.5px solid ${avatarColor}44` }}>
            {initials}
          </div>
          <div>
            <div className="user-row-name">{user.name} {isCurrentUser && <span className="you-badge">You</span>}</div>
            <div className="user-row-meta">{user.role}{user.email ? ` · ${user.email}` : ''}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {user.role !== 'admin' && !isCurrentUser && (
            <button
              className="btn btn-ghost"
              style={{ fontSize:'12px', padding:'4px 10px' }}
              onClick={e => { e.stopPropagation(); onRemove(user.id); }}
            >Remove</button>
          )}
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: expanded ? 'rotate(180deg)' : '', transition: 'transform 0.2s', color: 'var(--text-muted)' }}
          >
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="user-access-grid">
          {sections.map(sec => {
            const folders = (sec.folders || []);
            if (folders.length === 0) return null;
            return (
              <div key={sec.id} className="user-access-section">
                <div className="user-access-section-name" style={{ color: sec.color || '#16a34a' }}>
                  {sec.name}
                </div>
                <div className="user-access-folders">
                  {folders.map(f => (
                    <div key={f.id} className="user-access-folder-row">
                      <span className="user-access-folder-name">{f.name}</span>
                      {user.role === 'admin' ? (
                        <span className="access-badge" style={{ background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0' }}>Admin</span>
                      ) : (
                        <AccessBadge
                          level={matrix[user.id]?.[f.id] || 0}
                          onClick={() => cycleAccess(f.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Settings({
  users, sections, accessMatrix, onMatrixChange,
  currentUser, onAddSection, onAddFolder, extraUsers, onAddUser, onRemoveUser,
}) {
  const [tab,           setTab]           = useState('access');
  const [filterUser,    setFilterUser]    = useState('all');
  const [showNewSec,    setShowNewSec]    = useState(false);
  const [showNewUser,   setShowNewUser]   = useState(false);

  const allUsers = [...(users || []), ...(extraUsers || [])];

  // Access Control Tab
  const displayUsers = filterUser === 'all' ? allUsers : allUsers.filter(u => u.id === filterUser);

  const handleAddSection = (sec) => {
    onAddSection(sec);
    // init access for all users
    onMatrixChange(prev => {
      const next = { ...prev };
      allUsers.forEach(u => { next[u.id] = { ...(next[u.id] || {}) }; });
      return next;
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-title-row">
          <div>
            <h2 className="settings-title">Access Control</h2>
            <p className="settings-subtitle">Manage team members and their folder-level permissions</p>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            {tab === 'access' && currentUser.role === 'admin' && (
              <button className="btn btn-ghost" onClick={() => setShowNewSec(true)}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{marginRight:'5px'}}>
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                New Section
              </button>
            )}
            {tab === 'users' && currentUser.role === 'admin' && (
              <button className="btn btn-primary" onClick={() => setShowNewUser(true)}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{marginRight:'5px'}}>
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                Add Member
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          <button className={`settings-tab${tab === 'access' ? ' active' : ''}`} onClick={() => setTab('access')}>
            Folder Access Matrix
          </button>
          <button className={`settings-tab${tab === 'users' ? ' active' : ''}`} onClick={() => setTab('users')}>
            Team Members
            <span className="settings-tab-count">{allUsers.length}</span>
          </button>
        </div>
      </div>

      {/* ACCESS MATRIX TAB */}
      {tab === 'access' && (
        <div className="settings-body">
          {/* User filter chips */}
          <div className="user-filter-chips">
            <button
              className={`filter-chip${filterUser === 'all' ? ' active' : ''}`}
              onClick={() => setFilterUser('all')}
            >All members</button>
            {allUsers.map(u => (
              <button
                key={u.id}
                className={`filter-chip${filterUser === u.id ? ' active' : ''}`}
                onClick={() => setFilterUser(u.id)}
              >
                {u.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="access-legend">
            {LEVELS.map((l, i) => (
              <span key={i} className="access-badge" style={{ background: l.bg, color: l.color, border: `1px solid ${l.border}`, cursor:'default' }}>
                 {l.short}
              </span>
            ))}
            <span style={{ color:'var(--text-muted)', fontSize:'12px', marginLeft:'4px' }}>
              Click any badge to cycle through access levels
            </span>
          </div>

          {/* Matrix table */}
          <div className="matrix-table-wrap">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="matrix-th-user">Member</th>
                  {sections.flatMap(s => (s.folders || []).map(f => (
                    <th key={f.id} className="matrix-th-folder">
                      <div className="matrix-folder-label">
                        <span style={{ color: s.color || '#16a34a', fontSize:'10px', fontWeight:700, letterSpacing:'0.05em' }}>{s.name.slice(0,4).toUpperCase()}</span>
                        <span>{f.name}</span>
                      </div>
                    </th>
                  )))}
                </tr>
              </thead>
              <tbody>
                {displayUsers.map(u => (
                  <tr key={u.id} className="matrix-row">
    0               <td className="matrix-td-user">
                      <div className="matrix-user-cell">
                        <div className="matrix-user-initials">
                          {u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
                        </div>
                        <div>
                          <div className="matrix-user-name">{u.name.split(' ')[0]}</div>
                          <div className="matrix-user-role">{u.role}</div>
                        </div>
                      </div>
                    </td>
                    {sections.flatMap(s => (s.folders || []).map(f => (
                      <td key={f.id} className="matrix-td-access">
                        {u.role === 'admin' ? (
                          <span className="access-badge" style={{ background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0', cursor:'default' }}>Admin</span>
                        ) : (
                          <AccessBadge
                            level={accessMatrix[u.id]?.[f.id] || 0}
                            onClick={() => onMatrixChange(prev => ({
                              ...prev,
                              [u.id]: { ...(prev[u.id] || {}), [f.id]: ((accessMatrix[u.id]?.[f.id] || 0) + 1) % LEVELS.length }
                            }))}
                          />
                        )}
                      </td>
                    )))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEAM MEMBERS TAB */}
      {tab === 'users' && (
        <div className="settings-body">
          <div className="users-list">
            {allUsers.map(u => (
              <UserRow
                key={u.id}
                user={u}
                sections={sections}
                matrix={accessMatrix}
                onMatrixChange={onMatrixChange}
                onRemove={id => onRemoveUser && onRemoveUser(id)}
                isCurrentUser={u.id === currentUser.id}
              />
            ))}
            {allUsers.length === 0 && (
              <div className="dash-empty-state">No team members found.</div>
            )}
          </div>
     0  </div>
      )}

      {showNewSec && <AddSectionModal onClose={() => setShowNewSec(false)} onAdd={handleAddSection} />}
      {showNewUser && (
        <AddUserModal
          onClose={() => setShowNewUser(false)}
          onAdd={u => onAddUser && onAddUser(u)}
          existingIds={allUsers.map(u => u.id)}
        />
      )}
    </div>
  );
}
