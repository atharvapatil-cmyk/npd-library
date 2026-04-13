import { useState } from 'react';

const LEVELS = [
  { label: 'No Access', icon: 'ð«', bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
  { label: 'View',      icon: 'ð',  bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  { label: 'Edit',      icon: 'âï¸',  bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  { label: 'Admin',     icon: 'â­',  bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
];

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
          <div className="modal-title">â New Section</div>
          <button className="modal-x" onClick={onClose}>â</button>
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

export default function Settings({ users, sections, accessMatrix, onMatrixChange, currentUser, onAddSection, onAddFolder }) {
  const [showAddSection, setShowAddSection] = useState(false);
  const [filterUser, setFilterUser] = useState('all');
  const isAdmin = currentUser?.role === 'admin';

  const cycle = (userId, folderId) => {
    if (!isAdmin) return;
    const cur = accessMatrix?.[userId]?.[folderId] ?? 0;
    const next = (cur + 1) % 4;
    onMatrixChange({
      ...accessMatrix,
      [userId]: { ...(accessMatrix?.[userId] || {}), [folderId]: next },
    });
  };

  const filteredUsers = filterUser === 'all' ? users : users.filter(u => u.id === filterUser);

  return (
    <div className="settings-page">
      {/* Hero */}
      <div className="settings-hero">
        <div>
          <div className="settings-hero-title">ð Access Control</div>
          <div className="settings-hero-sub">
            Click any cell to cycle: <strong>No Access</strong> â <strong>View</strong> â <strong>Edit</strong> â <strong>Admin</strong>
          </div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddSection(true)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{marginRight:'6px'}}>
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            New Section
          </button>
        )}
      </div>

      {/* User filter chips */}
      <div className="settings-filter">
        <span className="settings-filter-label">Filter:</span>
        <div className="settings-filter-chips">
          <button className={`filter-chip${filterUser === 'all' ? ' active' : ''}`} onClick={() => setFilterUser('all')}>
            All Users
          </button>
          {users.map(u => (
            <button
              key={u.id}
              className={`filter-chip${filterUser === u.id ? ' active' : ''}`}
              onClick={() => setFilterUser(u.id)}
            >
              <span className="filter-chip-av">{u.avatar}</span>
              {u.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="settings-legend">
        {LEVELS.map(l => (
          <div key={l.label} className="legend-item">
            <div className="access-badge" style={{ background: l.bg, color: l.color, border: `1px solid ${l.border}` }}>
              <span>{l.icon}</span> <span>{l.label}</span>
            </div>
          </div>
        ))}
        <div style={{ marginLeft:'auto', fontSize:'12px', color:'var(--text-muted)', alignSelf:'center' }}>
          {isAdmin ? 'ð Click any badge to change access' : 'ð View only â admin access required to change'}
        </div>
      </div>

      {/* Sections */}
      <div className="access-sections">
        {sections.map(section => {
          const folders = section.folders || [];
          if (!folders.length) return (
            <div key={section.id} className="access-section-card">
              <div className="access-sec-header" style={{ '--sc': section.color || '#16a34a' }}>
                <div className="accest-sec-dot" style={{ background: section.color }}/>
                <span className="access-sec-name">{section.name}</span>
                {isAdmin && (
                  <button className="access-add-folder-btn" onClick={() => {
                    const name = window.prompt(`New folder name for "${section.name}":`);
                    if (name?.trim()) onAddFolder?.(section.id, {
                      id: section.id + '-' + Date.now(),
                      name: name.trim(), desc: '', files: [],
                      access: { admin: 3, nutra_lead: 1, pc_lead: 1, reg_lead: 1, pmo: 1, rd_member: 1 },
                    });
                  }}>+ Folder</button>
                )}
              </div>
              <div style={{ padding:'16px', color:'var(--text-muted)', fontSize:'13px' }}>No folders yet.</div>
            </div>
          );
          return (
            <div key={section.id} className="accest-section-card">
              <div className="access-sec-header" style={{ '--sc': section.color || '#16a34a' }}>
                <div className="access-sec-dot" style={{ background: section.color }}/>
                <span className="access-sec-name">{section.name}</span>
                <span className="accest-sec-count">{folders.length} folder{folders.length !== 1 ? 's' : ''}</span>
                {isAdmin && (
                  <button className="access-add-folder-btn" onClick={() => {
                    const name = window.prompt(`New folder name for "${section.name}":`);
                    if (name?.trim()) onAddFolder?.(section.id, {
                      id: section.id + '-' + Date.now(),
                      name: name.trim(), desc: '', files: [],
                      access: { admin: 3, nutra_lead: 1, pc_lead: 1, reg_lead: 1, pmo: 1, rd_member: 1 },
                    });
                  }}>+ Folder</button>
                )}
              </div>

              {/* Matrix header */}
              <div className="access-matrix">
                <div className="access-matrix-head">
                  <div className="am-cell am-folder-col">Folder</div>
                  {filteredUsers.map(u => (
                    <div key={u.id} className="am-cell am-user-col">
                      <div className="am-user-av">{u.avatar}</div>
                      <div className="am-user-name">{u.name.split(' ')[0]}</div>
                    </div>
                  ))}
                </div>

                {folders.map(folder => (
                  <div key={folder.id} className="access-matrix-row">
                    <div className="am-cell am-folder-col">
                      <div className="am-folder-name">{folder.name}</div>
                      {folder.desc && <div className="am-folder-desc">{folder.desc.slice(0, 48)}{folder.desc.length > 48 ? 'â¦' : ''}</div>}
                    </div>
                    {filteredUsers.map(u => {
                      const level = accessMatrix?.[u.id]?.[folder.id] ?? 0;
                      const lv = LEVELS[level];
                      return (
                        <div
                          key={u.id}
                          className={`am-cell am-badge-cell${isAdmin ? ' clickable' : ''}`}
                          onClick={() => cycle(u.id, folder.id)}
                          title={isAdmin ? `Click to change ${u.name.split(' ')[0]}'s access` : ''}
                        >
                          <div className="access-badge" style={{ background: lv.bg, color: lv.color, border: `1px solid ${lv.border}`, cursor: isAdmin ? 'pointer' : 'default' }}>
                            <span className="ab-icon">{lv.icon}</span>
                            <span className="ab-label">{lv.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showAddSection && (
        <AddSectionModal onClose={() => setShowAddSection(false)} onAdd={onAddSection}/>
      )}
    </div>
  );
}
