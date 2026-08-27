import {
  Home,
  Newspaper,
  Users,
  Calendar,
  ClipboardList,
  Briefcase,
  FileText,
  Heart,
  CreditCard,
  ClipboardCheck,
  BarChart3,
  UserCog,
} from 'lucide-react';
import { TOPBAR_HEIGHT } from './TopBar';

export const SIDEBAR_WIDTH = 240;

const C = {
  navy:   '#09107a',
  navyDk: '#09107a',
  blue:   '#09107a',
  gold:   '#c9a227',
} as const;

interface SidebarProps {
  activeView: string;
  onNavigate: (view: any) => void;
  userRole: 'alumni' | 'admin';
  open: boolean;
}

export function Sidebar({ activeView, onNavigate, userRole, open }: SidebarProps) {
  const baseMenuItems = [
    { id: 'home',        label: 'Home',                 icon: Home },
    { id: 'news',        label: 'News & Updates',       icon: Newspaper },
    { id: 'directory',   label: 'Alumni Chapters',       icon: Users },
    { id: 'events',      label: 'Engagement',           icon: Calendar },
    { id: 'surveys',     label: 'Tracer & Surveys',     icon: ClipboardList },
    { id: 'careers',     label: 'Careers',              icon: Briefcase },
    { id: 'internships', label: 'Hiring Requests',      icon: FileText },
    { id: 'give',        label: 'Give Back',            icon: Heart },
  ];

  const adminMenuItems = [
    { id: 'users',         label: 'Users',               icon: UserCog },
    { id: 'payments',      label: 'Payments',             icon: CreditCard },
    { id: 'registrations', label: 'Registrations',       icon: ClipboardCheck },
    { id: 'analytics',     label: 'Analytics',           icon: BarChart3 },
  ];

  const menuItems = userRole === 'admin'
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  return (
    <aside
      style={{
        width: SIDEBAR_WIDTH,
        height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
        position: 'fixed',
        top: TOPBAR_HEIGHT,
        left: 0,
        background: C.navy,
        boxShadow: '2px 0 24px rgba(0,0,0,0.14)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        fontFamily: "'DM Sans', sans-serif",
        overflow: 'hidden',
        transform: open ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`,
        transition: 'transform 0.22s ease',
      }}
    >
      <nav style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '18px 12px',
        overflowY: 'auto',
      }}>
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                border: 'none',
                borderLeft: isActive ? `4px solid ${C.gold}` : '4px solid transparent',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: 10,
                cursor: 'pointer',
                padding: '14px 14px',
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '0.01em',
                textAlign: 'left',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.72)',
                transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = isActive ? '#fff' : 'rgba(255,255,255,0.72)';
                e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'transparent';
              }}
            >
              <Icon size={19} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
