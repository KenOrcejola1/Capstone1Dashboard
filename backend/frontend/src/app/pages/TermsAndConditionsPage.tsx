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
              Terms &amp; Conditions
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
            <h2 className="text-lg font-semibold text-[#003087]">Alumni Information System – Terms of Use</h2>
          </div>

          <p>
            Welcome to the Ateneo de Davao University Alumni Information System. By registering and using this
            platform, you agree to be bound by the following Terms and Conditions. Please read them carefully
            before completing your registration. If you do not agree to these terms, you may not proceed with
            registration or use the platform.
          </p>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">1. Eligibility</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
              et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">2. Collection and Use of Personal Information</h3>
            <p>
              Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
              Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit
              amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit
              amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae,
              ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci,
              sagittis tempus lacus enim ac dui.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">3. Accuracy of Information</h3>
            <p>
              Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus,
              tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi,
              tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh.
              Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida
              non, commodo a, sodales sit amet, nisi.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">4. Privacy and Data Security</h3>
            <p>
              Nullam eu ante vel est convallis dignissim. Fusce suscipit, wisi nec facilisis facilisis, est dui
              fermentum leo, quis tempor ligula erat quis odio. Nunc porta vulputate tellus. Nunc rutrum turpis
              sed pede. Sed bibendum. Aliquam posuere. Nunc aliquet, augue nec adipiscing interdum, lacus tellus
              malesuada massa, quis varius mi purus non odio. Pellentesque condimentum, magna ut suscipit
              hendrerit, ipsum augue ornare nulla, non luctus diam neque sit amet urna.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">5. Prohibited Conduct</h3>
            <p>
              Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer
              lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi.
              Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales
              libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac,
              ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">6. Account Verification and Approval</h3>
            <p>
              Sed pretium blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non,
              convallis id, sagittis at, neque. Nullam mauris orci, aliquet et, iaculis et, viverra vitae, ligula.
              Nulla ut felis in purus aliquam imperdiet. Maecenas aliquet mollis lectus. Vivamus consectetuer
              risus et tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet, tortor sed
              accumsan bibendum, erat ligula aliquet magna, vitae ornare odio metus a mi.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">7. Amendments to Terms</h3>
            <p>
              Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in,
              diam. Sed arcu. Cras consequat. Praesent dapibus, neque id cursus faucibus, tortor neque egestas
              augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan
              porttitor, facilisis luctus, metus. Ateneo de Davao University reserves the right to amend these
              Terms and Conditions at any time without prior notice.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">8. Governing Law</h3>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the
              Republic of the Philippines. Any dispute arising out of or relating to these terms shall be subject
              to the exclusive jurisdiction of the courts of Davao City. By registering, you confirm that you have
              read, understood, and agree to be bound by all the provisions set forth herein.
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
              provisions set forth by the Ateneo de Davao University Alumni Information System.
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
