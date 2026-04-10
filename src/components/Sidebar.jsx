import { useState } from 'react';
import { FOLDER_TREE, ROLE_META, canView } from '../data/data';

export default function Sidebar({ user, currentFolderId, onFolderClick, onHomeClick, files, onSettingsClick, activePage }) {
  const [collapsed, setCollapsed] = useState({});

  const toggleSection = (id) => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  const fileCountForFolder = (fid) => files.filter(f => f.folderId === fid).length;

  return (
    <aside style={{
      position:'fixed', top:'var(--header-height)', left:0,
      width:'var(--sidebar-width)', height:'calc(100vh - var(--header-height))',
      background:'var(--bg-card)', borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column', zIndex:50, overflowY:'auto',
    }}>
      {/* Home */}
      <div style={{ padding:'12px 8px 8px' }}>
        <button
          onClick={onHomeClick}
          className={`sidebar-item ${!currentFolderId && activePage === 'library' ? 'active' : ''}`}
          style={{
            width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
            borderRadius:10, cursor:'pointer', background:'none', border:'none', textAlign:'left',
          }}
        >
          <span style={{ fontSize:16 }}>ð </span>
          <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>Dashboard</span>
        </button>
      </div>

      {/* Divider */}
      <div style={{ height:1, background:'var(--border)', margin:'4px 12px' }} />

      {/* Folder tree */}
      <div style={{ flex:1, padding:'8px 8px' }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.8px', padding:'4px 12px 8px', textTransform:'uppercase' }}>Sections</div>

        {FOLDER_TREE.map(section => {
          const isOpen = !collapsed[section.id];
          const accessibleFolders = section.folders.filter(f => canView(user?.role, f));

          return (
            <div key={section.id} style={{ marginBottom:4 }}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 12px',
                  borderRadius:10, cursor:'pointer', background:'none', border:'none', textAlign:'left',
                  transition:'background var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.background='var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background='none'}
              >
                <span style={{ fontSize:15 }}>{section.emoji}</span>
                <span style={{ flex:1, fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>{section.name}</span>
                {accessibleFolders.length === 0 && <span style={{ fontSize:10 }}>ð</span>}
                <span style={{ fontSize:10, color:'var(--text-muted)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition:'transform .2s' }}>â¶</span>
              </button>

              {/* Folders */}
              {isOpen && (
                <div style={{ paddingLeft:8 }}>
                  {section.folders.map(folder => {
                    const hasAccess = canView(user?.role, folder);
                    const isActive = currentFolderId === folder.id && activePage === 'library';
                    const count = fileCountForFolder(folder.id);

                    return (
                      <button
                        key={folder.id}
                        onClick={() => hasAccess && onFolderClick(folder)}
                        className={`sidebar-item ${isActive ? 'active' : ''}`}
                        style={{
                          width:'100%', display:'flex', alignItems:'center', gap:8, padding:'7px 10px 7px 14px',
                          borderRadius:8, cursor: hasAccess ? 'pointer' : 'not-allowed',
                          background:'none', border:'none', textAlign:'left',
                          opacity: hasAccess ? 1 : 0.4,
                        }}
                      >
                        <span style={{ fontSize:12 }}>{hasAccess ? 'ð' : 'ð'}</span>
                        <span style={{ flex:1, fontSize:12, color: isActive ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isActive ? 700 : 500, lineHeight:1.3 }}>
                          {folder.name}
                        </span>
                        {hasAccess && count > 0 && (
                          <span style={{
                            fontSize:10, fontWeight:700, minWidth:18, height:18, borderRadius:6,
                            background: isActive ? 'var(--accent)' : 'var(--bg-surface)',
                            color: isActive ? 'white' : 'var(--text-muted)',
                            display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px',
                          }}>{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User card at bottom */}
      <div style={{ padding:12, borderTop:'1px solid var(--border)' }}>
        <button onClick={onSettingsClick} style={{
          width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
          borderRadius:12, background:'var(--bg-surface)', border:'1px solid var(--border)',
          cursor:'pointer', textAlign:'left',
        }}>
          <div style={{
            width:32, height:32, borderRadius:9, flexShrink:0,
            background:`linear-gradient(135deg,${ROLE_META[user?.role]?.color || '#16a34a'}cc,${ROLE_META[user?.role]?.color || '#16a34a'}66)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:11, fontWeight:800, color:'white',
          }}>{user?.avatar}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize:10, color:ROLE_META[user?.role]?.color, fontWeight:600 }}>{ROLE_META[user?.role]?.label}</div>
          </div>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>âï¸</span>
        </button>
      </div>
    </aside>
  );
}
