import { useState } from 'react';
import { ROLE_META, FOLDER_TREE } from '../data/data';

const TABS = ['Access Management', 'Folder Permissions', 'Activity Log', 'General'];

export default function Settings({ user, users, setUsers, files }) {
  const [activeTab, setActiveTab] = useState('Access Management');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('rd_member');
  const [added, setAdded] = useState(false);
  const isAdmin = user?.role === 'admin';

  const addUser = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const initials = newName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const newUser = { id: 'u' + Date.now(), name: newName.trim(), email: newEmail.trim(), role: newRole, avatar: initials };
    setUsers(p => [...p, newUser]);
    setNewName(''); setNewEmail(''); setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const updateRole = (uid, role) => {
    if (!isAdmin) return;
    setUsers(p => p.map(u => u.id === uid ? { ...u, role } : u));
  };

  const removeUser = (uid) => {
    if (!isAdmin || uid === user.id) return;
    setUsers(p => p.filter(u => u.id !== uid));
  };

  // Fake activity log
  const activityLog = [
    { action: 'Uploaded', file: 'Ashwagandha Brief v2.3', by: 'Priya Sharma', time: '2 hours ago' },
    { action: 'Starred', file: 'Q2 Stage Gate Tracker', by: 'Vikram Joshi', time: '4 hours ago' },
    { action: 'Updated', file: 'FSSAI Compliance Checklist', by: 'Sneha Pillai', time: '1 day ago' },
    { action: 'Uploaded', file: 'ManFuel Launch Checklist', by: 'Pooja Bhatt', time: '2 days ago' },
    { action: 'Deleted', file: 'Old Concept Brief', by: 'Rahul Desai', time: '3 days ago' },
    { action: 'Uploaded', file: 'Zinc Picolinate COA', by: 'Deepa Nair', time: '3 days ago' },
  ];

  return (
    <div style={{ padding:28 }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:'var(--text-primary)', margin:'0 0 6px' }}>âï¸ Settings</h2>
        <p style={{ fontSize:13, color:'var(--text-muted)', margin:0 }}>
          {isAdmin ? 'Manage access, permissions, and library configuration.' : 'View access levels and library settings.'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:'1px solid var(--border)', paddingBottom:0 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding:'9px 16px', border:'none', cursor:'pointer', fontSize:13, fontWeight:700,
              background:'none', transition:'all .15s',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom:-1,
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ACCESS MANAGEMENT */}
      {activeTab === 'Access Management' && (
        <div>
          {/* Add user form (admin only) */}
          {isAdmin && (
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:20, marginBottom:20 }}>
              <h4 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', margin:'0 0 16px' }}>Add New Member</h4>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full Name"
                  style={{ padding:'9px 12px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-primary)', fontSize:13 }} />
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email Address"
                  style={{ padding:'9px 12px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-primary)', fontSize:13 }} />
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <select value={newRole} onChange={e => setNewRole(e.target.value)}
                  style={{ flex:1, padding:'9px 12px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-surface)', color:'var(--text-primary)', fontSize:13 }}>
                  {Object.entries(ROLE_META).map(([k, v]) => (
                    <option key={k} value={k}>{v.emoji} {v.label}</option>
                  ))}
                </select>
                <button onClick={addUser}
                  className="btn-glow"
                  style={{ padding:'9px 20px', borderRadius:10, border:'none', cursor:'pointer', color:'white', fontSize:13, fontWeight:700 }}>
                  + Add Member
                </button>
                {added && <span style={{ fontSize:12, color:'var(--accent)', fontWeight:700 }}>â Added!</span>}
              </div>
            </div>
          )}

          {/* User list */}
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h4 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Team Members ({users.length})</h4>
              <span style={{ fontSize:11, color:'var(--text-muted)' }}>Files: {files.length} total</span>
            </div>
            <table className="tbl" style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign:'left' }}>Member</th>
                  <th style={{ textAlign:'left' }}>Role</th>
                  <th style={{ textAlign:'left' }}>Docs Accessible</th>
                  {isAdmin && <th style={{ textAlign:'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const rm = ROLE_META[u.role] || {};
                  const docCount = files.length; // simplified
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${rm.color || '#16a34a'}cc,${rm.color || '#16a34a'}66)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'white', flexShrink:0 }}>{u.avatar}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{u.name} {u.id === user.id && <span style={{ fontSize:10, color:'var(--accent)', fontWeight:600 }}>(you)</span>}</div>
                            <div style={{ fontSize:11, color:'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {isAdmin && u.id !== user.id ? (
                          <select value={u.role} onChange={e => updateRole(u.id, e.target.value)}
                            style={{ padding:'4px 8px', borderRadius:7, border:'1px solid var(--border)', background:`${rm.bg || '#f0fdf4'}`, color:rm.color, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                            {Object.entries(ROLE_META).map(([k, v]) => (
                              <option key={k} value={k}>{v.emoji} {v.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ fontSize:11, fontWeight:700, color:rm.color, background:`${rm.bg || '#f0fdf4'}`, padding:'3px 8px', borderRadius:7 }}>{rm.emoji} {rm.label}</span>
                        )}
                      </td>
                      <td style={{ fontSize:12, color:'var(--text-muted)' }}>{files.length} docs</td>
                      {isAdmin && (
                        <td style={{ textAlign:'right' }}>
                          {u.id !== user.id && (
                            <button onClick={() => removeUser(u.id)}
                              style={{ padding:'4px 12px', borderRadius:7, border:'1px solid #fecaca', background:'#fef2f2', cursor:'pointer', fontSize:11, fontWeight:700, color:'#dc2626' }}>
                              Remove
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOLDER PERMISSIONS */}
      {activeTab === 'Folder Permissions' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {FOLDER_TREE.map(section => (
            <div key={section.id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', background:`${section.color}0d`, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20 }}>{section.emoji}</span>
                <span style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)' }}>{section.name}</span>
              </div>
              <table className="tbl" style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign:'left' }}>Folder</th>
                    <th style={{ textAlign:'left' }}>Can View</th>
                    <th style={{ textAlign:'left' }}>Can Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {section.folders.map(f => (
                    <tr key={f.id}>
                      <td style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>ð {f.name}</td>
                      <td>
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                          {f.viewRoles.map(r => (
                            <span key={r} style={{ fontSize:10, fontWeight:700, color:ROLE_META[r]?.color, background:`${ROLE_META[r]?.bg}`, padding:'2px 7px', borderRadius:5 }}>{ROLE_META[r]?.label}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                          {f.editRoles.map(r => (
                            <span key={r} style={{ fontSize:10, fontWeight:700, color:ROLE_META[r]?.color, background:`${ROLE_META[r]?.bg}`, padding:'2px 7px', borderRadius:5 }}>{ROLE_META[r]?.label}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVITY LOG */}
      {activeTab === 'Activity Log' && (
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
            <h4 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', margin:0 }}>Recent Activity</h4>
          </div>
          <div style={{ padding:4 }}>
            {activityLog.map((a, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom: i < activityLog.length-1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'var(--bg-surface)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                  {a.action === 'Uploaded' ? 'â' : a.action === 'Starred' ? 'â' : a.action === 'Deleted' ? 'ð' : 'âï¸'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:'var(--text-primary)' }}>
                    <strong>{a.by}</strong> {a.action.toLowerCase()} <span style={{ color:'var(--accent)' }}>"{a.file}"</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GENERAL */}
      {activeTab === 'General' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:20 }}>
            <h4 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', margin:'0 0 16px' }}>Library Info</h4>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Library Name', value:'NPD Library' },
                { label:'Organization', value:'Mosaic Wellness' },
                { label:'Total Documents', value:`${files.length}` },
                { label:'Total Members', value:`${users.length}` },
                { label:'Active Sections', value:'5' },
                { label:'Total Folders', value:'16' },
              ].map(item => (
                <div key={item.label} style={{ padding:'12px 14px', borderRadius:10, background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.5px', textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:20 }}>
            <h4 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', margin:'0 0 4px' }}>Your Role</h4>
            <p style={{ fontSize:12, color:'var(--text-muted)', margin:'0 0 14px' }}>Current access level for this session.</p>
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:14, borderRadius:12, background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:32 }}>{ROLE_META[user?.role]?.emoji}</div>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)' }}>{ROLE_META[user?.role]?.label}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>
                  {user?.role === 'admin' ? 'Full access to all sections and admin controls.' :
                   user?.role === 'nutra_lead' ? 'Full access to Nutraceuticals; view PMO & Regulatory.' :
                   user?.role === 'pc_lead' ? 'Full access to Personal Care; view Regulatory.' :
                   user?.role === 'reg_lead' ? 'Full access to Regulatory; view relevant PC files.' :
                   user?.role === 'pmo' ? 'Full access to PMO; view Nutraceuticals stage gates.' :
                   'Access to R&D Lab; view Nutraceuticals & PC files.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
