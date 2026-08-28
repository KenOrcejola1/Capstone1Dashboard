import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export function TracerSurveyPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const routeState = state as { email?: string; readOnly?: boolean } | null;
  const email = routeState?.email;
  const readOnly = routeState?.readOnly === true;

  useEffect(() => {
    const handleSurveyMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === 'survey-ready' && email) {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'survey-user', email, readOnly },
          'http://localhost:8002'
        );
        return;
      }
      if (event.data?.type === 'survey-completed') {
        if (event.data.email) {
          localStorage.setItem(`surveyCompleted:${event.data.email.toLowerCase().trim()}`, 'true');
        }
        navigate('/dashboard', { state: { view: 'surveys' } });
      }
    };

    window.addEventListener('message', handleSurveyMessage);
    return () => window.removeEventListener('message', handleSurveyMessage);
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen">
      <iframe
        ref={iframeRef}
        src="http://localhost:8002"
        title="Graduate Tracer Survey"
        className="flex-1 w-full border-none"
        onLoad={() => {
          if (email) {
            iframeRef.current?.contentWindow?.postMessage(
              { type: 'survey-user', email, readOnly },
              'http://localhost:8002'
            );
          }
        }}
      />
    </div>
  );
}
