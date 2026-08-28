import { ChevronsLeft, ChevronsRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ADDULogo from '../../assets/ADDULogo.jpg';
import { OfficerBadge } from './OfficerBadge';

export const TOPBAR_HEIGHT = 58;

const C = {
  navy:   '#09107a',
  navyDk: '#09107a',
  blue:   '#09107a',
  gold:   '#c9a227',
} as const;

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeView: string;
  onNavigate: (view: any) => void;
  userRole: 'alumni' | 'admin';
}

export function TopBar({ sidebarOpen, onToggleSidebar, activeView, onNavigate, userRole }: TopBarProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  const [profileImageUrl, setProfileImageUrl] = useState(localStorage.getItem('userProfileImage') || '');
  const [isOfficer, setIsOfficer] = useState(false);

  useEffect(() => {
    const fetchOfficerStatus = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setIsOfficer(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(email)}`);
        if (response.ok) {
          const data = await response.json();
          setIsOfficer(Boolean(data.is_officer));
        }
      } catch (error) {
        console.error('Error fetching officer status:', error);
      }
    };

    const sync = () => {
      setUserName(localStorage.getItem('userName') || 'User');
      setProfileImageUrl(localStorage.getItem('userProfileImage') || '');
      fetchOfficerStatus();
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('userProfileUpdated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('userProfileUpdated', sync);
    };
  }, []);

  const initials = (() => {
    const parts = userName.split(' ').filter((n) => n.length > 0);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0];
    return parts[0][0] + parts[parts.length - 1][0];
  })();

  const roleLabel = userRole === 'admin' ? 'Admin' : 'Alumni';

  return (
    <header
      style={{
        height: TOPBAR_HEIGHT,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: C.navyDk,
        boxShadow: '0 2px 18px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 60,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&display=swap');
      `}</style>
      {/* ── Left: toggle + logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Hide navigation menu' : 'Show navigation menu'}
          title={sidebarOpen ? 'Hide menu' : 'Show menu'}
          style={{
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            color: '#fff',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          {sidebarOpen ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <img
            src={ADDULogo}
            alt="ADDU Logo"
            style={{ width: 34, height: 34, objectFit: 'contain', flexShrink: 0, borderRadius: '50%' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, minWidth: 0 }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 16, fontWeight: 700, color: '#fff',
              letterSpacing: '0.03em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              ADDU Alumni
            </span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 10.5, fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              Ateneo de Davao University
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: profile + sign out ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button
          onClick={() => onNavigate('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: activeView === 'profile' ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            padding: '5px 12px 5px 5px',
            borderRadius: 100,
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseOut={(e) => (e.currentTarget.style.background = activeView === 'profile' ? 'rgba(255,255,255,0.1)' : 'transparent')}
          title="View my profile"
        >
          <div style={{
            width: 32, height: 32,
            borderRadius: '50%',
            background: activeView === 'profile' ? 'rgba(201,162,39,0.3)' : 'rgba(255,255,255,0.15)',
            border: activeView === 'profile' ? `1.5px solid ${C.gold}` : '1.5px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12.5, fontWeight: 700,
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25, textAlign: 'left' }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
              {userName.split(' ')[0]}
              {isOfficer && <OfficerBadge size={13} />}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {roleLabel}
            </span>
          </div>
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            navigate('/');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 100,
            padding: '8px 18px',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.03em',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </header>
  );
}
