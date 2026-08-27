import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Users, Sparkles, ArrowRight, Heart, LifeBuoy, Trophy, ExternalLink } from 'lucide-react';
import campusNight from '../../assets/Roxas-Colored.jpg';
import communityPhoto from '../../assets/_MG_1823.jpg';

const C = {
  navy: '#09107a',
  gold: '#c9a227',
  goldLt: '#f5b800',
  bg: '#f0f2f9',
  muted: '#475569',
} as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 26, height: 2, background: C.gold, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Cinzel', serif", color: C.gold, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {children}
      </span>
      <span style={{ width: 26, height: 2, background: C.gold, flexShrink: 0 }} />
    </span>
  );
}

const funFacts = [
  {
    icon: Landmark,
    n: '1948',
    label: 'The year it all began',
    text: 'A wooden building, a six-hectare lot in Matina, and 71 elementary students. That\'s where your Ateneo started.',
  },
  {
    icon: Users,
    n: '131',
    label: 'high schoolers on day one',
    text: 'The very first batch of Ateneans, back when the school offered only Grades V–VI and 1st–3rd year high school.',
  },
  {
    icon: Sparkles,
    n: '9',
    label: 'Ateneos in the Philippines',
    text: 'Only nine schools nationwide carry the Ateneo name, and you graduated from one of them.',
  },
];

const studentLifePillars = [
  {
    icon: Users,
    title: 'Belong',
    text: 'Friendships, community, and campus life built around student organizations, from SAMAHAN, the autonomous student government, to groups spanning academics, advocacy, culture, and service, like the Aerospace and Rocketry Team.',
  },
  {
    icon: Heart,
    title: 'Be Formed',
    text: 'Ignatian spirituality is the heartbeat of Atenean life, with retreats, recollections, and sacramental life coordinated by the Campus Ministry Office, and the annual Feast of St. Ignatius.',
  },
  {
    icon: LifeBuoy,
    title: 'Be Supported',
    text: 'Counseling, health services, financial aid, and career development form the support system behind every student, then and now.',
  },
  {
    icon: Trophy,
    title: 'Be Inspired',
    text: 'Board topnotchers, competition champions, and alumni success stories are the achievements that keep getting written into Ateneo history, including yours.',
  },
];

export function AboutHistoryPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease both; }

        .fact-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .fact-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(9,16,122,0.18);
        }

        .cta-btn {
          transition: background 0.2s, transform 0.15s;
        }
        .cta-btn:hover {
          background: ${C.goldLt};
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '78vh', minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${campusNight})`, backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(9,16,122,0.9) 0%, rgba(9,16,122,0.5) 55%, rgba(9,16,122,0.85) 100%)',
        }} />

        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: 28, left: 32, zIndex: 2,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 100, padding: '8px 18px', cursor: 'pointer',
            color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="fade-up" style={{ position: 'relative', zIndex: 2, maxWidth: 700, padding: '0 2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}><Eyebrow>Welcome Back, Atenean</Eyebrow></div>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontWeight: 700,
            fontSize: 'clamp(1.9rem, 5vw, 3.2rem)', lineHeight: 1.25,
            color: '#fff', marginBottom: 20,
          }}>
            Remember Where It All Began?
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
            Long before it was a university, the Ateneo de Davao was a small parochial school with big dreams. Here's a quick trip back through the story you're now a part of.
          </p>
        </div>
      </section>

      {/* ── DID YOU KNOW ─────────────────────────────────── */}
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Eyebrow>Did You Know?</Eyebrow></div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 500,
              fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)', color: C.navy,
            }}>
              A Few Fun Facts About Your Alma Mater
            </h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
            {funFacts.map(({ icon: Icon, n, label, text }) => (
              <div
                key={n}
                className="fact-card"
                style={{
                  background: C.bg, borderRadius: 20, padding: '2rem',
                  width: 300, textAlign: 'left',
                  border: '1px solid rgba(9,16,122,0.08)',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(9,16,122,0.08)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                }}>
                  <Icon size={20} color={C.navy} />
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '2.2rem', color: C.gold, lineHeight: 1, marginBottom: 6 }}>
                  {n}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.navy, marginBottom: 10 }}>
                  {label}
                </div>
                <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO BAND ───────────────────────────────────── */}
      <div style={{ height: 'clamp(200px, 28vw, 360px)', backgroundImage: `url(${communityPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

      {/* ── THE STORY ────────────────────────────────────── */}
      <section style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 2rem', background: C.bg }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ marginBottom: 20 }}><Eyebrow>The Full Story</Eyebrow></div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 500,
            fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: C.navy, lineHeight: 1.25, marginBottom: 22,
          }}>
            From a Wooden Building to a Legacy
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.9, marginBottom: 18 }}>
            It started in <strong style={{ color: C.navy }}>1948</strong>, when Bishop Luis del Rosario of the Archdiocese of Zamboanga asked a group of American Jesuits, led by Fr. Theodore Daigler, to take over St. Peter's Parochial School on Jacinto Street. They said yes, and the Ateneo de Davao was born.
          </p>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.9, marginBottom: 18 }}>
            There were no grand halls yet, just a wooden building on a six-hectare lot in Matina, and a handful of students who had no idea they were the first of what would become a global community of Ateneans.
          </p>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.9 }}>
            By <strong style={{ color: C.navy }}>1951</strong>, that small school had grown into a Liberal Arts college. Decade by decade, it became the university that shaped you, one of only nine schools in the country to carry the Ateneo name.
          </p>
        </div>
      </section>

      {/* ── VISION & MISSION ─────────────────────────────── */}
      <section style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Eyebrow>Still Guiding Us Today</Eyebrow></div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 500,
              fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: C.navy,
            }}>
              Our Vision &amp; Mission
            </h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', alignItems: 'stretch' }}>
            <div className="fact-card" style={{
              flex: '1 1 380px', maxWidth: 460, background: C.navy, borderRadius: 20, padding: '2.25rem',
            }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>
                Our Vision
              </div>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 1.9, marginBottom: 14 }}>
                A world of global citizens in solidarity and community, inspired by their faith, working for peace, social justice, democracy, and sustainable development.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 1.9, marginBottom: 14 }}>
                A nation rooted in God-centered values and empowering culture, with democratic leaders and engaged citizens forging a just, prosperous, sustainable, and peaceful society.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 1.9 }}>
                A Mindanao that enjoys sustainable peace and development, thriving in the diversity of its cultures and faith traditions.
              </p>
            </div>

            <div className="fact-card" style={{
              flex: '1 1 380px', maxWidth: 460, background: C.bg, borderRadius: 20, padding: '2.25rem', border: '1px solid rgba(9,16,122,0.08)',
            }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>
                Our Mission
              </div>
              <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.9, marginBottom: 14 }}>
                We in the Ateneo de Davao University educate students through excellent academic instruction, robust research and innovation, and vibrant community engagement and advocacy for social transformation.
              </p>
              <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.9, marginBottom: 14 }}>
                Our education is rooted in the formation of values that are based on our Christian, Catholic, Ignatian, and Jesuit tradition.
              </p>
              <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.9 }}>
                We aim to produce discerning leaders and citizens distinguished by their character, competence, compassion, conscience, courage, cultural-rootedness, and commitment to community and the common good.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STUDENT LIFE ─────────────────────────────────── */}
      <section style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 2rem', background: C.bg }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Eyebrow>Some Things Never Change</Eyebrow></div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 500,
              fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: C.navy, marginBottom: 14,
            }}>
              Student Life at the Ateneo
            </h2>
            <p style={{ fontSize: 16, color: C.muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
              This is still the same campus that shaped you, just with a few more student orgs, retreats, and traditions along the way.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
            {studentLifePillars.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="fact-card"
                style={{
                  background: '#fff', borderRadius: 20, padding: '2rem',
                  width: 260, textAlign: 'left',
                  border: '1px solid rgba(9,16,122,0.08)',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(9,16,122,0.08)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                }}>
                  <Icon size={20} color={C.navy} />
                </div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.navy, marginBottom: 10 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <a
              href="https://www.addu.edu.ph/student-life/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: C.navy, fontSize: 14.5, fontWeight: 700,
                textDecoration: 'none', borderBottom: `1.5px solid ${C.gold}`, paddingBottom: 2,
              }}
            >
              Curious what's changed? See campus life today <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── MOTTO ────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(3.5rem, 8vw, 5.5rem) 2rem', background: C.navy, textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500,
            fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: '#fff', lineHeight: 1.5, marginBottom: 14,
          }}>
            "Ad Majorem Dei Gloriam"
          </p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold }}>
            For the Greater Glory of God
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
            The words that guided every Jesuit who built this school, and every Atenean since.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: 'clamp(3rem, 7vw, 4.5rem) 2rem' }}>
        <p style={{ fontSize: 16, color: C.muted, marginBottom: 22 }}>
          You're part of this story too. Ready to catch up with your fellow Ateneans?
        </p>
        <button
          className="cta-btn"
          onClick={() => navigate('/login')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', background: C.gold, color: C.navy,
            border: 'none', borderRadius: 100, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
          }}
        >
          Continue Your Story <ArrowRight size={16} />
        </button>
        <p style={{ fontFamily: "'Cinzel', serif", color: C.navy, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', marginTop: 40 }}>
          Fortes in Fide: Strong in Faith
        </p>
      </div>
    </div>
  );
}
