import { MapPin, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardNav } from '../DashboardNavContext';

export function Footer() {
  const navigate = useNavigate();
  const onNavigate = useDashboardNav();

  const quickLinks: { label: string; to?: string; view?: any }[] = [
    { label: 'About Us', to: '/about' },
    { label: 'Events Calendar', view: 'events' },
    { label: 'Alumni Careers', view: 'directory' },
    { label: 'Career Services', view: 'careers' },
    { label: 'Mentorship Program', view: 'careers' },
  ];

  const resources: { label: string; to?: string; view?: any }[] = [
    { label: 'Alumni Benefits', view: 'give' },
    { label: 'Publications', view: 'news' },
    { label: 'Chapter Network', view: 'alumni' },
    { label: 'Volunteer', view: 'projects' },
    { label: 'Support ADDU', view: 'give' },
  ];

  const goTo = (item: { to?: string; view?: any }) => {
    if (item.to) navigate(item.to);
    else if (item.view) onNavigate(item.view);
  };

  return (
    <footer className="bg-[#001D4A] text-white py-16 px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">ADDU Alumni Association</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Connecting Ateneans worldwide and fostering lifelong relationships with our alma mater.
          </p>
          <div className="flex gap-4">
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Facebook className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Twitter className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Linkedin className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Instagram className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b border-white/10 pb-2">Quick Links</h3>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <button onClick={() => goTo(item)} className="hover:text-white cursor-pointer text-left">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b border-white/10 pb-2">Resources</h3>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            {resources.map((item) => (
              <li key={item.label}>
                <button onClick={() => goTo(item)} className="hover:text-white cursor-pointer text-left">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b border-white/10 pb-2">Contact Us</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 shrink-0 text-blue-400" />
              <span>E. Jacinto St, Davao City, 8000 Davao del Sur</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="w-5 h-5 flex items-center justify-center shrink-0 text-blue-400">📞</span>
              <span>(082) 221-2411</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-5 h-5 shrink-0 text-blue-400" />
              <span>alumni@addu.edu.ph</span>
            </li>
            <li className="pt-2">
              <a
                href="mailto:alumni@addu.edu.ph"
                className="inline-block text-white bg-[#1a24d2] px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-gray-500 text-xs gap-4">
        <span>© 2026 Ateneo de Davao University Alumni Association. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="cursor-default" title="No policy page yet">Privacy Policy</span>
          <span className="cursor-default" title="No policy page yet">Terms of Service</span>
          <span className="cursor-default" title="No policy page yet">Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
