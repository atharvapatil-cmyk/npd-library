import { useState, useEffect, useRef } from 'react';
import { canView } from '../data/data.js';

const STAT_CONFIGS = [
  { key: 'folders', label: 'Folders Accessible', sub: 'All active', color: '#16a34a', icon: 'ð', emoji: true },
  { key: 'files',   label: 'Files Available',    sub: 'Your access', color: '#2563eb', icon: 'ð', emoji: true },
  { key: 'members', label: 'Team Members',        sub: 'All active',  color: '#7c3aed', icon: 'ð¥', emoji: true },
  { key: 'uploads', label: 'Recent Uploads',      sub: 'This session',color: '#d97706', icon: 'ð', emoji: true },
];

function StatCard({ cfg, value, index, onClick }) {
  const ref = useRef();
  const [tilt, setTilt] = useState('');
  const [glow, setGlow] = useState(false);

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt(`perspective(700px) rotateY(${x}deg) rotateX(${y}deg) scale(1.04)`);
    setGlow(true);
  };
  const onMouseLeave = () => { setTilt(''); setGlow(false); };

  return (
    <div
      ref={ref}
      className="stat-card"
      style={{
        animationDelay: `${index * 0.1}s`,
        transform: tilt,
        transition: tilt ? 'none' : 'transform 0.5s cubic-bezier(.23,1,.32,1)',
        '--card-color': cfg.color,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="stat-card-shine" style={{ opacity: glow ? 1 : 0 }}/>
      <div className="stat-card-top">
        <div className="stat-icon-wrap" style={{ background: cfg.color + '18' }}>
          <span style={{ fontSize: '18px' }}>{cfg.icon}</span>
        </div>
        <span className="stat-sub-label">{cfg.sub}</span>
      </div>
      <div className="stat-value" style={{ color: cfg.color }}>{value}</div>
      <div className="stat-label">{cfg.label}</div>
      <div className="stat-progress">
        <div className="stat-progress-bar" style={{ width: `${Math.min(100, value * 6 + 20)}%`, background: cfg.color }}/>
      </div>
    </div>
  );
}

function QuickSectionCard({ sec, folderCount, onClick, index }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      className="quick-card"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ animationDelay: `${index * 0.06}s`, '--sec-c': sec.color || '#16a34a' }}
    >
      <div className="quick-card-bar" style={{ background: sec.color || '#16a34a' }}/>
      <div className="quick-card-body">
        <div className="quick-card-name">{sec.name}</div>
        <div className="quick-card-meta">{folderCount} folder{folderCount !== 1 ? 's' : ''}</div>
      </div>
      <div className="quick-card-arrow" style={{ color: sec.color || '#16a34a', transform: hover ? 'translateX(4px)' : '' }}>âº</div>
    </button>
  );
}

function ActivityRow({ file, index }) {
  const ext = (file.name || '').split('.').pop().toLowerCase();
  const colors = { pdf: '#ef4444', xlsx: '#22c55e', xls: '#22c55e', docx: '#3b82f6', doc: '#3b82f6' };
  const c = colors[ext] || '#6b7280';
  return (
    <div className="activity-row" style={{ animationDelay: `${index * 0.04}s` }}>
      <div className="activity-file-dot" style={{ background: c + '22', color: c }}>
        <svg width="12" height="14" viewBox="0 0 14 16" fill="none">
          <path d="M2 2C2 1.4 2.4 1 3 1H9L13 5V14C13 14.6 12.6 15 12 15H3C2.4 15 2 14.6 2 14V2Z" fill={c + '25'} stroke={c} strokeWidth="1.3"/>
          <path d="M9 1V5H13" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="activity-row-info">
        <div className="activity-row-name">{file.name}</div>
        <div className="activity-row-path">{file.section}{file.folder ? ` âº ${file.folder}` : ''}</div>
      </div>
      <div className="activity-row-tags">
        {(file.tags || []).slice(0, 2).map(t => (
          <span key={t} className="activity-tag">#{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ currentUser, sections, accessMatrix, recentUploads, onSectionClick }) {
  const [greeting, setGreeting] = useState('');
  const canvasRef = useRef();

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Animated canvas dots on hero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const dots = Array.from({ length: 18 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: ['#16a34a','#2563eb','#7c3aed','#d97706','#ea580c'][Math.floor(Math.random()*5)],
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color + '55';
        ctx.fill();
      });
      // Draw lines between nearby dots
      dots.forEach((a, i) => dots.slice(i+1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(22,163,74,${0.12 * (1 - dist/100)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const userSections = sections.filter(sec =>
    sec.folders && sec.folders.some(f => canView(currentUser.id, f.id, accessMatrix))
  );

  const totalFolders = userSections.reduce((acc, s) =>
    acc + (s.folders || []).filter(f => canView(currentUser.id, f.id, accessMatrix)).length, 0
  );

  const allAccessibleFiles = userSections.flatMap(s =>
    (s.folders || [])
      .filter(f => canView(currentUser.id, f.id, accessMatrix))
      .flatMap(f => (f.files || []).map(file => ({
        ...file, section: s.name, folder: f.name, sectionColor: s.color
      })))
  );

  const recentActivity = [
    ...recentUploads.map(u => ({ name: u.name, section: u.section, folder: u.folder, tags: u.tags || [] })),
    ...allAccessibleFiles,
  ].slice(0, 10);

  const stats = [totalFolders, allAccessibleFiles.length, 6, recentUploads.length];

  return (
    <div className="dashboard">
      {/* Hero Banner */}
      <div className="dash-hero">
        <canvas ref={canvasRef} className="dash-hero-canvas"/>
        <div className="dash-hero-content">
          <div className="dash-hero-eyebrow">â¦ {greeting}</div>
          <div className="dash-hero-name">{currentUser.name}</div>
          <div className="dash-hero-sub">NPD Team Central Â· Document Library v2.7</div>
        </div>
        <div className="dash-hero-badge">
          <span className="dash-hero-badge-dot"/>
          <span>{userSections.length} sections Â· {allAccessibleFiles.length} files</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        {STAT_CONFIGS.map((cfg, i) => (
          <StatCard key={cfg.key} cfg={cfg} value={stats[i]} index={i} />
        ))}
      </div>

      {/* Two-column grid */}
      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="dash-panel">
          <div className="dash-panel-hd">
            <span className="dash-panel-title">ð Recent Activity</span>
            <span className="dash-panel-count">{recentActivity.length}</span>
          </div>
          <div className="activity-scroll">
            {recentActivity.length === 0 ? (
              <div className="dash-empty-state">
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>ð­</div>
                <div>No activity yet â start browsing or uploading files!</div>
              </div>
            ) : recentActivity.map((f, i) => (
              <ActivityRow key={i} file={f} index={i} />
            ))}
          </div>
        </div>

        {/* Quick Jump */}
        <div className="dash-panel">
          <div className="dash-panel-hd">
            <span className="dash-panel-title">â¡ Quick Jump</span>
          </div>
          <div className="quick-cards-list">
            {userSections.map((sec, i) => {
              const folderCount = (sec.folders || []).filter(f => canView(currentUser.id, f.id, accessMatrix)).length;
              return (
                <QuickSectionCard
                  key={sec.id}
                  sec={sec}
                  folderCount={folderCount}
                  onClick={() => onSectionClick(sec)}
                  index={i}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
