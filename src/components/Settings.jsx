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
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^+|-$)/g, '');
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
            <input type="color" className="modal-input" value={color} onChange={e => setColor(e.target.value)} style={{ width:'60px', height:'44px', padding:'4px', cursor:'color' }}/>
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
   �
