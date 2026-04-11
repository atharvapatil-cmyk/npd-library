import { useState, useEffect, useRef } from 'react';

export default function Login({ users, onLogin }) {
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const NODE_COUNT = 60;
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    nodesRef.current = nodes;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const ns = nodesRef.current;

      ns.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x;
          const dy = ns[i].y - ns[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(74,222,128,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(ns[i].x, ns[i].y);
            ctx.lineTo(ns[j].x, ns[j].y);
            ctx.stroke();
          }
        }
      }

      ns.forEach(n => {
        const glow = Math.sin(n.pulse) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,222,128,${0.4 + glow * 0.4})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSelect = (user) => {
    setSelected(user.id);
    setTimeout(() => onLogin(user), 300);
  };

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="login-canvas" />
      <div className="login-container">
        <div className="login-logo">
          <div className="login-logo-icon">M</div>
          <div>
            <div className="login-logo-title">Mosaic Wellness</div>
            <div className="login-logo-sub">NPD Team Central</div>
          </div>
        </div>
        <h1 className="login-heading">Document Library</h1>
        <p className="login-sub">Select your profile to continue</p>
        <div className="login-user-grid">
          {users.map(user => (
            <div
              key={user.id}
              className={`login-user-card ${selected === user.id ? 'selected' : ''} ${hoveredId === user.id ? 'hovered' : ''}`}
              onClick={() => handleSelect(user)}
              onMouseEnter={() => setHoveredId(user.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ '--card-color': user.color || '#16a34a' }}
            >
              <div className="login-avatar" style={{ background: `linear-gradient(135deg, ${user.color || '#16a34a'}88, ${user.color || '#16a34a'})` }}>
                {user.avatar}
              </div>
              <div className="login-user-name">{user.name}</div>
              <div className="login-user-role">{user.department || user.role}</div>
              <div className="login-card-shine" />
            </div>
          ))}
        </div>
        <div className="login-footer">
          Mosaic Wellness NPD Platform v2.7
        </div>
      </div>
    </div>
  );
}
