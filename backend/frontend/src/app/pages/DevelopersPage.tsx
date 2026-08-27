import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';

const C = {
  navy: '#09107a',
  navyDk: '#050a52',
  blue: '#1a24d2',
  gold: '#c9a227',
  bg: '#eef0fa',
} as const;

interface Member {
  name: string;
  role: string;
}

interface TeamSection {
  id: string;
  label: string;
  tagline: string;
  members: Member[];
}

// TODO: fill in the real rosters once each module's team is confirmed.
const sections: TeamSection[] = [
  {
    id: 'tracer',
    label: 'Tracer Study',
    tagline: 'The team behind the ADDU Graduate Tracer Study platform',
    members: [
      { name: 'Victoriano, O.', role: 'Project Lead' },
      { name: 'Vales, J.', role: 'Software Engineer' },
      { name: 'Lomanta, A.', role: 'Software Engineer' },
      { name: 'Bautista, J.', role: 'System & Data Analyst' },
      { name: 'Pelobello, N.', role: 'System & Data Analyst' },
    ],
  },
  {
    id: 'cms',
    label: 'Website CMS & Integration',
    tagline: 'The team behind Website CMS & System Integration',
    members: [
      { name: 'Orcejola, K.', role: 'Website CMS & System Integration' },
      { name: 'Orcine, J.', role: 'Website CMS & System Integration' },
      { name: 'Gatab, G.', role: 'Website CMS & System Integration' },
    ],
  },
  {
    id: 'alumni',
    label: 'Alumni Portal',
    tagline: 'The team behind Alumni Portal & Database',
    members: [
      { name: 'Gomez, A.', role: 'Alumni Portal & Database' },
      { name: 'Geralde, L.', role: 'Alumni Portal & Database' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects & Community',
    tagline: 'The team behind Projects & Community Engagement',
    members: [
      { name: 'Gallardo, A.', role: 'Projects & Community Engagement' },
      { name: 'Laviña, L.', role: 'Projects & Community Engagement' },
      { name: 'De Jesus, F.', role: 'Projects & Community Engagement' },
    ],
  },
  {
    id: 'events',
    label: 'Events, Jobs & Internships',
    tagline: 'The team behind Events, Jobs & Internships',
    members: [
      { name: 'Imperio, D.', role: 'Events, Jobs & Internships' },
      { name: 'Booc, J.', role: 'Events, Jobs & Internships' },
      { name: 'Urquia, J.', role: 'Events, Jobs & Internships' },
    ],
  },
];

function MemberCard({ name, role }: Member) {
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${C.navyDk} 0%, ${C.blue} 100%)`,
        borderRadius: 20,
        padding: '2.5rem 2rem',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(9,16,122,0.25)',
        width: 280,
        maxWidth: '100%',
        flex: '0 1 auto',
      }}
    >
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 21, fontWeight: 700, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        marginBottom: 12,
      }}>
        <span style={{ color: C.gold, fontSize: 14 }}>◆</span>
        {name}
      </div>
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: C.gold,
      }}>
        {role}
      </div>
    </div>
  );
}

function PlaceholderCard() {
  return (
    <div
      style={{
        border: `1.5px dashed rgba(9,16,122,0.3)`,
        background: 'rgba(9,16,122,0.03)',
        borderRadius: 20,
        padding: '2.5rem 2rem',
        textAlign: 'center',
        width: 280,
        maxWidth: '100%',
        flex: '0 1 auto',
      }}
    >
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 21, fontWeight: 700, color: 'rgba(9,16,122,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        marginBottom: 12,
      }}>
        <span style={{ color: 'rgba(201,162,39,0.5)', fontSize: 14 }}>◆</span>
        TBA
      </div>
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'rgba(201,162,39,0.5)',
      }}>
        Team Slot Open
      </div>
    </div>
  );
}

export function DevelopersPage() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(sections[0].id);
  const active = sections.find((s) => s.id === activeId)!;

  return (
    <div style={{
      minHeight: '100vh', width: '100%', background: C.bg, fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflowX: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
      `}</style>

      {/* Diamond grid background texture */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(9,16,122,0.06) 0px, rgba(9,16,122,0.06) 1px, transparent 1px, transparent 46px),
          repeating-linear-gradient(-45deg, rgba(9,16,122,0.06) 0px, rgba(9,16,122,0.06) 1px, transparent 1px, transparent 46px)
        `,
      }} />

      {/* Nav */}
      <header style={{
        position: 'relative', zIndex: 1,
        background: C.navy, minHeight: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 10,
        padding: '10px clamp(24px, 5.5vw, 110px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flexShrink: 1 }}>
          <img src={ADDULogo} alt="ADDU Seal" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />
          <div style={{ lineHeight: 1.3, minWidth: 0 }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              Ateneo de Davao University
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10.5, fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Graduate Tracer Study
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
            background: 'transparent', border: '2px solid rgba(255,255,255,0.8)', borderRadius: 10,
            padding: '7px 16px', cursor: 'pointer',
            color: '#fff', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700,
          }}
        >
          <ArrowLeft size={16} /> Home
        </button>
      </header>

      <main style={{ flex: 1, position: 'relative', zIndex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: 'clamp(3rem, 7vw, 5rem) clamp(1rem, 4vw, 2rem) clamp(3.5rem, 7vw, 6rem)', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(1.15rem, 4.2vw, 3.2rem)', fontWeight: 700,
          color: C.navy, marginBottom: 28, letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
        }}>
          The Minds Behind the Innovation
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap', padding: '0 1rem' }}>
          <span style={{ color: C.gold, fontSize: 13 }}>◆</span>
          <span style={{
            fontFamily: "'Cinzel', serif", fontSize: 12.5, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: C.gold,
          }}>
            {active.tagline}
          </span>
          <span style={{ color: C.gold, fontSize: 13 }}>◆</span>
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 44 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 100,
                border: `1.5px solid ${activeId === s.id ? C.navy : 'rgba(9,16,122,0.25)'}`,
                background: activeId === s.id ? C.navy : 'transparent',
                color: activeId === s.id ? '#fff' : C.navy,
                fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
                fontFamily: 'inherit', cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {active.members.length > 0
            ? active.members.map((m) => <MemberCard key={m.name} {...m} />)
            : [0, 1, 2].map((i) => <PlaceholderCard key={i} />)}
        </div>
      </main>

      {/* Footer bar */}
      <footer style={{
        position: 'relative', zIndex: 1,
        background: C.navy, padding: '18px clamp(24px, 5.5vw, 110px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
        }}>
          Ateneo Graduate Tracer Study
        </span>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff',
        }}>
          Strong in Faith That Does Justice
        </span>
      </footer>
    </div>
  );
}
