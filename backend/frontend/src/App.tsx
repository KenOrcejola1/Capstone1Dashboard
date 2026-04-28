import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './app/pages/LandingPage';
import { LoginPage } from './app/pages/LoginPage';
import { RegisterPage } from './app/pages/RegisterPage';
import { Dashboard } from './app/pages/Dashboard';
import { TracerSurveyPage } from './app/pages/TracerSurveyPage';
import { TermsAndConditionsPage } from './app/pages/TermsAndConditionsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/survey/tracer" element={<TracerSurveyPage />} />
      </Routes>
    </BrowserRouter>
  );
}