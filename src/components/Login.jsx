import { useState, useEffect, useRef } from 'react';

// Set your Google OAuth Client ID here (or in VITE_GOOGLE_CLIENT_ID env var)
// Get one at: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = typeof import.meta !== 'undefined'
  ? (import.meta.env?.VITE_GOOGLE_CLIENT_ID || '')
  : '';

function useParticleCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1.5 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(22,163,74,0.3)';
        ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(22,163,74,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [canvasRef]);
}

export default function Login({ users, extraUsers, onLogin }) {
  const canvasRef  = useRef();
  const googleBtnRef = useRef();
  const [error, setError]   = useState('');
  const [mode,  setMode]    = useState(GOOGLE_CLIENT_ID ? 'google' : 'picker'); // 'google' | 'picker'
  const [googleReady, setGoogleReady] = useState(false);

  useParticleCanvas(canvasRef);

  const allUsers = [...(users || []), ...(extraUsers || [])];

  // Load Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || mode !== 'google') return;

    const existing = document.getElementById('gsi-script');
    if (existing) {
      initGoogle();
      return;
    }

    const script = document.createElement('script');
    script.id = 'gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, [mode]);

  const initGoogle = () => {
    if (!window.google?.accounts) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
    });
    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 300,
        text: 'signin_with',
        shape: 'rectangular',
      });
    }
    setGoogleReady(true);
  };

  const handleGoogleCredential = (response) => {
    try {
      // Decode the JWT payload
      const parts = response.credential.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const email = payload.email?.toLowerCase();
      const name  = payload.name;

      const matchedUser = allUsers.find(u =>
        u.email?.toLowerCase() === email
      );

      if (matchedUser) {
        setError('');
        onLogin(matchedUser);
      } else {
        setError(`${email} is not approved. Ask your admin to add you in Settings > Team Members.`);
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  const handlePickerLogin = (user) => {
    setError('');
    onLogin(user);
  };

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="login-canvas"/>

      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">M</div>
            <div>
              <div className="login-logo-name">Mosaic Wellness</div>
              <div className="login-logo-sub">NPD Team Central</div>
            </div>
          </div>

          <h1 className="login-title">Document Library</h1>
          <p className="login-subtitle">
            {mode === 'google'
              ? 'Sign in with your Mosaic Wellness Google account'
              : 'Select your profile to continue'}
          </p>

          {/* Google sign-in mode */}
          {mode === 'google' && (
            <div className="login-google-section">
              <div ref={googleBtnRef} className="login-google-btn-wrap"/>
              {!googleReady && (
                <div className="login-google-loading">
                  <div className="login-spinner"/>
                  Loading Google Sign-In...
                </div>
              )}
              {error && (
                <div className="login-error">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0}}>
                    <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.4"/>
                    <path d="M7 4V7M7 10H7.01" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}
              <div className="login-mode-switch">
                <button onClick={() => { setMode('picker'); setError(''); }}>
                  Use profile picker instead
                </button>
              </div>
            </div>
          )}

          {/* Profile picker mode */}
          {mode === 'picker' && (
            <>
              <div className="login-grid">
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    className="login-user-card"
                    onClick={() => handlePickerLogin(user)}
                  >
                    <div className="login-user-avatar">
                      {user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="login-user-name">{user.name}</div>
                    <div className="login-user-role">{user.role}</div>
                  </button>
                ))}
              </div>
              {GOOGLE_CLIENT_ID && (
                <div className="login-mode-switch">
                  <button onClick={() => { setMode('google'); setError(''); }}>
                    Sign in with Google instead
                  </button>
                </div>
              )}
            </>
          )}

          <div className="login-footer">Mosaic Wellness NPD Platform v2.7</div>
        </div>
      </div>
    </div>
  );
}
