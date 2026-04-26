import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function TracerSurveyPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail') || '';
  const tracerBaseUrl = 'http://localhost:8002';

  useEffect(() => {
    if (userRole === 'admin') {
      const params = new URLSearchParams({
        email: userEmail,
        role: 'admin',
      });
      window.location.href = `${tracerBaseUrl}/admin?${params.toString()}`;
    }
  }, [userRole, userEmail]);

  if (userRole === 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF1FF] via-[#F8FAFC] to-[#F8FAFC] p-8">
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-4rem)] flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003087] via-[#0046B8] to-[#0052CC] shadow-xl shadow-blue-900/20 px-7 py-6">
          <div className="absolute -right-14 -top-16 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute -left-10 -bottom-16 w-44 h-44 rounded-full bg-[#FF9F1A]/20" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-white/15 text-[#FFE6BF] text-xs font-bold tracking-wider uppercase">
                Tracer Study
              </div>
              <h1 className="text-3xl font-bold text-white leading-tight">Graduate Tracer Survey</h1>
              <p className="text-blue-100 text-sm mt-1">Complete your survey response and help improve future alumni programs.</p>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#003087] rounded-lg hover:bg-[#F3F7FF] transition-colors font-semibold text-sm shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border-2 border-blue-400 shadow-lg shadow-slate-200/60 overflow-hidden">
          <iframe
            src={tracerBaseUrl}
            title="Graduate Tracer Survey"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
}
