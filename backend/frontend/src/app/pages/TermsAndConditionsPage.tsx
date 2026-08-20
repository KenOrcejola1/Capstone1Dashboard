import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScrollText } from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';
import campusNight from '../../assets/Roxas-Colored.jpg';

export function TermsAndConditionsPage() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(
    () => sessionStorage.getItem('termsAccepted') === 'true'
  );

  const handleCheckbox = (checked: boolean) => {
    setAgreed(checked);
    if (checked) {
      sessionStorage.setItem('termsAccepted', 'true');
    } else {
      sessionStorage.removeItem('termsAccepted');
    }
  };

  const handleAgree = () => {
    sessionStorage.setItem('termsAccepted', 'true');
    navigate('/register');
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center p-6 lg:p-12"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundImage: `linear-gradient(120deg, rgba(0,21,61,0.88) 0%, rgba(0,48,135,0.6) 55%, rgba(0,21,61,0.75) 100%), url(${campusNight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;700&display=swap');
      `}</style>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#001F5B] px-8 py-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={ADDULogo} alt="ADDU Logo" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <p className="text-[#C5A96A] text-xs font-medium tracking-widest uppercase">Ateneo de Davao University</p>
            <h1 className="text-white text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Data Privacy Act &amp; Terms and Conditions
            </h1>
          </div>
        </div>

        {/* Back link */}
        <div className="px-8 pt-6">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 text-[#003087] hover:text-[#00153D] transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6 text-gray-700 text-sm leading-relaxed">
          <div className="flex items-center gap-3 mb-2">
            <ScrollText className="w-5 h-5 text-[#003087] flex-shrink-0" />
            <h2 className="text-lg font-semibold text-[#003087]">Data Privacy Act &amp; Terms of Use</h2>
          </div>

          <p>
            Welcome to the Ateneo de Davao University Alumni Portal. By registering and using this
            platform — including its alumni directory, engagement and giveback programs, and the Graduate Tracer
            Study — you agree to be bound by the following Terms and Conditions and Data Privacy Notice. Please
            read them carefully before completing your registration. If you do not agree to these terms, you may
            not proceed with registration or use the platform.
          </p>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">1. Eligibility</h3>
            <p>
              This platform is intended for graduates and alumni of Ateneo de Davao University, as well as
              authorized university administrators. By registering, you confirm that the information you provide
              is your own and that you are a legitimate alumnus/alumna or authorized user of the system.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">2. Data Privacy Notice and Legal Basis</h3>
            <p>
              Ateneo de Davao University is committed to protecting your personal data in accordance with the
              Data Privacy Act of 2012 (R.A. 10173). By registering for and using the Alumni Portal —
              including participation in the Graduate Tracer Study — you agree to the collection and processing
              of your information as described in this notice.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">3. What Information We Collect</h3>
            <p>
              We collect personal and professional information necessary for your registration and continued use
              of the platform, including your contact details, educational background, employment status, and,
              where applicable, your feedback and responses submitted through the Graduate Tracer Study and other
              alumni engagement features.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">4. How Your Information Is Collected</h3>
            <p>
              Your information is collected only through this official Alumni Portal — during
              registration, profile updates, and your voluntary participation in surveys, events, and giveback
              programs — solely for academic quality assurance, institutional planning, accreditation, curriculum
              enhancement, graduate outcome assessment, and other legitimate educational purposes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">5. How Your Information Is Processed</h3>
            <p>
              Information provided by alumni is processed by the respective academic units as authorized by the
              Office of Strategic Management and Quality Assurance (OSMQA). Designated system administrators from
              the CS cluster who maintain this platform are bound by the University's data privacy and
              confidentiality policies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">6. How Your Information Is Used</h3>
            <p>
              Your information and responses are used exclusively for institutional research and reporting, to
              assess program quality, improve academic offerings, support alumni engagement, and fulfill
              government reporting requirements (e.g., CHED). Your information will not be used for commercial
              purposes or disclosed to unauthorized third parties unless required by law.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">7. Confidentiality and Anonymization of Reports</h3>
            <p>
              All responses are kept confidential. Reports, dashboards, statistical summaries, and research
              outputs generated from platform data — including the Graduate Tracer Study — will present only
              aggregated and anonymized data. Personally identifiable information, such as names and contact
              details, will not be disclosed in published reports and will not be publicly attributed to you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">8. Data Protection Measures</h3>
            <p>
              Appropriate administrative, organizational, technical, and physical safeguards are implemented to
              protect the confidentiality, integrity, and security of all information collected through this
              platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">9. Your Rights Under the Data Privacy Act</h3>
            <p>
              As a data subject, you retain your rights under the Data Privacy Act of 2012, including the right
              to be informed, to access your personal information, to request correction of inaccurate data, and
              to exercise other applicable rights in accordance with existing laws and University policies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">10. Accuracy of Information</h3>
            <p>
              You are responsible for ensuring that the information you submit during registration and while
              using the platform is true, accurate, and up to date. The University may request supporting
              documents to verify your identity and alumni status.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">11. Prohibited Conduct</h3>
            <p>
              You agree not to misuse the platform, including submitting false information, impersonating
              another person, attempting to access accounts or data that do not belong to you, or using the
              platform for any unlawful or unauthorized purpose.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">12. Account Verification and Approval</h3>
            <p>
              New alumni accounts are subject to review and approval by University administrators before full
              access is granted. The University reserves the right to request additional verification and to
              suspend or deny accounts that do not meet eligibility requirements.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">13. Amendments to Terms</h3>
            <p>
              Ateneo de Davao University reserves the right to amend these Terms and Conditions and this Data
              Privacy Notice at any time. Continued use of the platform after such changes constitutes your
              acceptance of the updated terms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">14. Governing Law</h3>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the
              Republic of the Philippines, including the Data Privacy Act of 2012 (R.A. 10173). By registering,
              you confirm that you have read, understood, and agree to be bound by all the provisions set forth
              herein.
            </p>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Checkbox Agreement */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => handleCheckbox(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                agreed ? 'bg-[#003D7A] border-[#003D7A]' : 'border-gray-400 group-hover:border-[#003D7A]'
              }`}>
                {agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-gray-700 text-sm leading-relaxed select-none">
              I have read and fully understood the Terms &amp; Conditions stated above. I agree to abide by all
              provisions set forth by the Ateneo de Davao University Alumni Portal.
            </span>
          </label>

          {/* Action Button */}
          <div className="pt-2 pb-4">
            <button
              onClick={handleAgree}
              disabled={!agreed}
              className={`w-full py-4 rounded-lg font-semibold text-base transition shadow-md ${
                agreed
                  ? 'bg-[#003D7A] text-white hover:bg-[#002855] cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {agreed ? 'Confirm & Return to Registration' : 'Please check the box above to continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
