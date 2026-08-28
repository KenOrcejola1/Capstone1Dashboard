import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ArrowRight, CheckCircle, FileText, Plus } from 'lucide-react';
import { Footer } from '../Footer';

interface Survey {
  id?: string;
  title: string;
  category?: string;
  description: string;
  dueDate?: string;
  completedDate?: string;
  responses?: string;
  isPriority?: boolean;
  questions_count?: number;
}

export function SurveysView({ userRole, userEmail }: { userRole: string; userEmail: string }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Available Surveys');
  const baseTabs = ['Available Surveys', 'Completed'];
  const tabs = baseTabs;
  const [availableSurveys, setAvailableSurveys] = useState<Survey[]>([]);
  const [completedSurveys, setCompletedSurveys] = useState<Survey[]>([]);
  const [surveysLoading, setSurveysLoading] = useState(true);
  const [completedLoading, setCompletedLoading] = useState(true);
  const [surveysError, setSurveysError] = useState('');
  const [completedError, setCompletedError] = useState('');
  const completionKey = `surveyCompleted:${userEmail.toLowerCase().trim()}`;
  const hasLocalCompletion = Boolean(userEmail && localStorage.getItem(completionKey));

  useEffect(() => {
    const loadAvailableSurveys = async () => {
      try {
        const response = await fetch(`/api/surveys?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) throw new Error('Unable to load surveys');
        const surveys = await response.json();
        setAvailableSurveys(hasLocalCompletion ? [] : surveys);
      } catch {
        setSurveysError('Unable to load surveys from the database.');
      } finally {
        setSurveysLoading(false);
      }
    };

    loadAvailableSurveys();
    window.addEventListener('focus', loadAvailableSurveys);

    return () => window.removeEventListener('focus', loadAvailableSurveys);
  }, [userEmail]);

  useEffect(() => {
    const loadCompletedSurveys = async () => {
      if (!userEmail) {
        setAvailableSurveys([]);
        setCompletedLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/surveys/completed?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) throw new Error('Unable to load completed surveys');
        const surveys = await response.json();
        setCompletedSurveys(
          surveys.length > 0 || !hasLocalCompletion
            ? surveys
            : [{
                id: 'local-completed-survey',
                title: 'Graduate Tracer Survey',
                category: 'Tracer Study',
                description: '',
                completedDate: new Date().toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                }),
              }]
        );
      } catch {
        setCompletedError('Unable to load completed surveys from the database.');
      } finally {
        setCompletedLoading(false);
      }
    };

    loadCompletedSurveys();
    window.addEventListener('focus', loadCompletedSurveys);

    return () => window.removeEventListener('focus', loadCompletedSurveys);
  }, [userEmail]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 p-8 space-y-8">
        {/* TITLE SECTION */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Tracer & Surveys Studies</h1>
            <p className="text-gray-500 text-sm mt-1">Participate in surveys and help us improve</p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={() => navigate('/surveymanagement')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a24d2] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Create Survey
            </button>
          )}
        </div>

        {/* HIGHLIGHTED ORANGE WELCOME BANNER */}
        {availableSurveys.length > 0 && (
        <div className="bg-orange-600 rounded-[24px] p-8 text-white text-left relative overflow-hidden shadow-lg shadow-orange-900/10">
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-xl font-bold mb-3">👋 New to the ADDU Alumni Portal?</h2>
              <p className="text-orange-50 text-sm leading-relaxed mb-6">
                Help us know you better! Complete the Graduate Tracer Survey to share your journey after ADDU. 
                Your insights help improve our programs and support future students.
              </p>
              {/* UPDATED BLUE BUTTON */}
              <button
                onClick={() => navigate('/survey/tracer', { state: { email: userEmail } })}
                className="bg-[#1a24d2] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#002566] transition-all flex items-center gap-2 shadow-md"
              >
                Take the Tracer Survey <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Subtle background decoration */}
            <ClipboardCheck className="absolute right-[-10px] bottom-[-10px] w-40 h-40 text-white/10 -rotate-12" />
        </div>
        )}

        {/* TABS */}
        <div className="flex gap-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[13px] font-bold transition-all relative ${
                activeTab === tab ? 'text-[#1a24d2]' : 'text-gray-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1a24d2]" />
              )}
            </button>
          ))}
        </div>

        {/* CONTENT LIST */}
        <div className="space-y-4">
            {activeTab === 'Available Surveys' ? (
            surveysLoading ? (
              <p className="text-sm text-gray-500">Loading surveys...</p>
            ) : surveysError ? (
              <p className="text-sm text-red-600">{surveysError}</p>
            ) : availableSurveys.length === 0 ? (
              <p className="text-sm text-gray-500">No surveys are currently available.</p>
            ) : availableSurveys.map((survey) => (
              <div key={survey.id ?? survey.title} className="rounded-[24px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left border transition-all bg-white text-gray-900 border-gray-100">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{survey.title}</h3>
                  </div>
                  <p className="text-sm max-w-2xl text-gray-500">{survey.description}</p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-[12px] font-medium">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {survey.questions_count} questions
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => navigate('/survey/tracer', { state: { email: userEmail } })}
                    className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm bg-[#1a24d2] text-white hover:bg-[#002566]"
                  >
                    Take Survey
                  </button>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => { window.location.href = 'http://localhost:8002/admin/responses'; }}
                      className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                    >
                      View Results
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : completedLoading ? (
            <p className="text-sm text-gray-500">Loading completed surveys...</p>
          ) : completedError ? (
            <p className="text-sm text-red-600">{completedError}</p>
          ) : completedSurveys.length === 0 ? (
            <p className="text-sm text-gray-500">You have not completed any surveys yet.</p>
          ) : (
            completedSurveys.map((survey) => (
              <div key={survey.id ?? survey.title} className="bg-white rounded-[24px] p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left hover:bg-gray-50/50 transition-colors">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">{survey.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{survey.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Completed on {survey.completedDate}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/survey/tracer', { state: { email: userEmail, readOnly: true } })}
                  className="w-full md:w-auto px-6 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  View Response
                </button>
              </div>
            ))
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}