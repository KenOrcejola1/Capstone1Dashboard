import { useState, useEffect } from 'react';
import { MessageSquare, Mail, MapPin, Briefcase, Award, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { WORLD_COUNTRIES } from '../../utils/countries';

interface Alumnus {
  id: number;
  name: string;
  class: string;
  program: string;
  programValue?: string;
  role: string;
  company?: string;
  location: string;
  country?: string;
  email: string;
  initials: string;
  profileImageUrl?: string;
  officerRole?: string;
}

interface DirectoryUser {
  id: number;
  name?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email: string;
  role?: string;
  course?: string;
  batch_year?: string;
  city?: string;
  province?: string;
  country?: string;
  current_address?: string;
  profile_image_path?: string;
  approval_status?: 'pending' | 'approved' | 'disapproved';
  is_active?: number;
}

const DEFAULT_ROLE_LABEL = 'Alumni';
const API_BASE_URL = 'http://localhost:8000';

const REGISTER_COURSES = [
  // AB programs
  { value: 'AB in Anthropology', label: 'AB in Anthropology' },
  { value: 'AB in Anthropology - Academic Research', label: 'AB in Anthropology - Academic Research' },
  { value: 'AB in Anthropology - Community Development/Social Enterprise', label: 'AB in Anthropology - Community Development/Social Enterprise' },
  { value: 'AB in Anthropology - Leadership/Pre-Law', label: 'AB in Anthropology - Leadership/Pre-Law' },
  { value: 'AB in Communication', label: 'AB in Communication' },
  { value: 'AB in Development Studies', label: 'AB in Development Studies' },
  { value: 'AB in English Language', label: 'AB in English Language' },
  { value: 'AB in Interdisciplinary Studies Minor in Language and Literature', label: 'AB in Interdisciplinary Studies Minor in Language and Literature' },
  { value: 'AB in Interdisciplinary Studies Minor in Media and Business', label: 'AB in Interdisciplinary Studies Minor in Media and Business' },
  { value: 'AB in Interdisciplinary Studies Minor in Media and Philosophy', label: 'AB in Interdisciplinary Studies Minor in Media and Philosophy' },
  { value: 'AB in Interdisciplinary Studies Minor in Media and Technology', label: 'AB in Interdisciplinary Studies Minor in Media and Technology' },
  { value: 'AB in Interdisciplinary Studies Minor in Philosophy and Theology', label: 'AB in Interdisciplinary Studies Minor in Philosophy and Theology' },
  { value: 'AB in International Studies Major in American Studies', label: 'AB in International Studies Major in American Studies' },
  { value: 'AB in International Studies Major in Asian Studies', label: 'AB in International Studies Major in Asian Studies' },
  { value: 'AB in Islamic Studies', label: 'AB in Islamic Studies' },
  { value: 'AB in Islamic Studies Major in Political Economy', label: 'AB in Islamic Studies Major in Political Economy' },
  { value: 'AB in Islamic Studies Minor in Education', label: 'AB in Islamic Studies Minor in Education' },
  { value: 'AB in Mass Communication', label: 'AB in Mass Communication' },
  { value: 'AB in Philosophy', label: 'AB in Philosophy' },
  { value: 'AB in Psychology', label: 'AB in Psychology' },
  { value: 'AB Sociology', label: 'AB Sociology' },
  { value: 'AB Major in Economics', label: 'AB Major in Economics' },
  { value: 'AB Major in Political Science', label: 'AB Major in Political Science' },
  // Bachelor programs
  { value: 'Bachelor of Early Childhood Education', label: 'Bachelor of Early Childhood Education' },
  { value: 'Bachelor of Early Childhood Education Major in Preschool', label: 'Bachelor of Early Childhood Education Major in Preschool' },
  { value: 'Bachelor of Elementary Education', label: 'Bachelor of Elementary Education' },
  { value: 'Bachelor of Public Administration', label: 'Bachelor of Public Administration' },
  { value: 'Bachelor of Public Management', label: 'Bachelor of Public Management' },
  { value: 'Bachelor of Secondary Education Major in Biological Sciences', label: 'Bachelor of Secondary Education Major in Biological Sciences' },
  { value: 'Bachelor of Secondary Education Major in English', label: 'Bachelor of Secondary Education Major in English' },
  { value: 'Bachelor of Secondary Education Major in Mathematics', label: 'Bachelor of Secondary Education Major in Mathematics' },
  { value: 'Bachelor of Secondary Education Major in Physical Sciences', label: 'Bachelor of Secondary Education Major in Physical Sciences' },
  { value: 'Bachelor of Secondary Education Major in Science', label: 'Bachelor of Secondary Education Major in Science' },
  { value: 'Bachelor of Secondary Education Major in Social Studies', label: 'Bachelor of Secondary Education Major in Social Studies' },
  // BS programs
  { value: 'BS in Accountancy', label: 'BS in Accountancy' },
  { value: 'BS in Accounting Technology', label: 'BS in Accounting Technology' },
  { value: 'BS in Aerospace Engineering', label: 'BS in Aerospace Engineering' },
  { value: 'BS in Aerospace Engineering (Academic Research)', label: 'BS in Aerospace Engineering (Academic Research)' },
  { value: 'BS in Aerospace Engineering (Industry and Technopreneurship)', label: 'BS in Aerospace Engineering (Industry and Technopreneurship)' },
  { value: 'BS in Architecture', label: 'BS in Architecture' },
  { value: 'BS in Biology Major in General Biology', label: 'BS in Biology Major in General Biology' },
  { value: 'BS in Biology Major in Medical Biology', label: 'BS in Biology Major in Medical Biology' },
  { value: 'BS in Business Management', label: 'BS in Business Management' },
  { value: 'BS in Chemical Engineering', label: 'BS in Chemical Engineering' },
  { value: 'BS in Chemistry', label: 'BS in Chemistry' },
  { value: 'BS in Civil Engineering', label: 'BS in Civil Engineering' },
  { value: 'BS in Civil Engineering (Construction Engineering and Management)', label: 'BS in Civil Engineering (Construction Engineering and Management)' },
  { value: 'BS in Civil Engineering (Structural)', label: 'BS in Civil Engineering (Structural)' },
  { value: 'BS in Civil Engineering (Transportation)', label: 'BS in Civil Engineering (Transportation)' },
  { value: 'BS in Computer Engineering', label: 'BS in Computer Engineering' },
  { value: 'BS in Computer Science', label: 'BS in Computer Science' },
  { value: 'BS in Data Science', label: 'BS in Data Science' },
  { value: 'BS in Electrical Engineering', label: 'BS in Electrical Engineering' },
  { value: 'BS in Electronics Engineering', label: 'BS in Electronics Engineering' },
  { value: 'BS in Entrepreneurship', label: 'BS in Entrepreneurship' },
  { value: 'BS in Entrepreneurship Major in Agri-Business', label: 'BS in Entrepreneurship Major in Agri-Business' },
  { value: 'BS in Environmental Science', label: 'BS in Environmental Science' },
  { value: 'BS in Finance', label: 'BS in Finance' },
  { value: 'BS in HR Management', label: 'BS in HR Management' },
  { value: 'BS in Human Resource Development and Management', label: 'BS in Human Resource Development and Management' },
  { value: 'BS in Industrial Engineering', label: 'BS in Industrial Engineering' },
  { value: 'BS Information Management', label: 'BS Information Management' },
  { value: 'BS in Information Systems', label: 'BS in Information Systems' },
  { value: 'BS in Information Technology', label: 'BS in Information Technology' },
  { value: 'BS in Management Accounting', label: 'BS in Management Accounting' },
  { value: 'BS in Marketing', label: 'BS in Marketing' },
  { value: 'BS in Mathematics', label: 'BS in Mathematics' },
  { value: 'BS in Mechanical Engineering', label: 'BS in Mechanical Engineering' },
  { value: 'BS in Nursing', label: 'BS in Nursing' },
  { value: 'BS in Psychology', label: 'BS in Psychology' },
  { value: 'BS in Robotics Engineering', label: 'BS in Robotics Engineering' },
  { value: 'BS in Social Work', label: 'BS in Social Work' },
];

const LEGACY_COURSE_MAP: Record<string, string> = {
  'bs-computer-science': 'BS in Computer Science',
  'bs-information-technology': 'BS in Information Technology',
  'bs-information-systems': 'BS in Information Systems',
  'bs-information-management': 'BS Information Management',
  'bs-data-science': 'BS in Data Science',
  other: 'Other',
};

const REGISTER_COUNTRIES = ['Philippines', ...WORLD_COUNTRIES, 'Other'];

const BATCH_YEARS = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => String(2025 - i));

function getCourseLabel(course?: string) {
  if (!course) return 'Not specified';
  const normalizedCourse = course.trim();
  if (LEGACY_COURSE_MAP[normalizedCourse]) return LEGACY_COURSE_MAP[normalizedCourse];
  const matched = REGISTER_COURSES.find((item) => item.value === normalizedCourse || item.label === normalizedCourse);
  return matched ? matched.label : normalizedCourse;
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AL';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function mapUserToAlumnus(user: DirectoryUser): Alumnus {
  const fullName = user.name?.trim() || [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || user.email;
  const country = user.country?.trim();
  const locationParts = [user.city, user.province, user.country].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : (user.current_address?.trim() || 'Not specified');

  return {
    id: user.id,
    name: fullName,
    class: user.batch_year?.trim() || 'N/A',
    program: getCourseLabel(user.course),
    programValue: user.course?.trim(),
    role: DEFAULT_ROLE_LABEL,
    location,
    country,
    email: user.email,
    initials: getInitials(fullName),
    profileImageUrl: user.profile_image_path ? `${API_BASE_URL}/storage/${user.profile_image_path}` : undefined,
  };
}

interface ChapterOfficerApi {
  id: number;
  position: string;
  school_year: string;
  user: DirectoryUser;
}

interface ChapterApi {
  id: number;
  name: string;
  description: string | null;
  active_officers: ChapterOfficerApi[];
}

function mapOfficerToAlumnus(officer: ChapterOfficerApi) {
  const base = mapUserToAlumnus(officer.user);
  return {
    ...base,
    id: officer.id,
    officerRole: officer.position,
    schoolYear: officer.school_year,
  };
}

export function DirectoryView({ userRole }: { userRole: string }) {
  const [chapters, setChapters] = useState<ChapterApi[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [chaptersError, setChaptersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoadingChapters(true);
        setChaptersError(null);

        const response = await fetch('http://localhost:8000/api/chapters?with_officers=1');
        if (!response.ok) {
          throw new Error('Failed to load chapters.');
        }

        setChapters((await response.json()) as ChapterApi[]);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setChaptersError('Unable to fetch chapters from the database.');
      } finally {
        setLoadingChapters(false);
      }
    };

    fetchChapters();

    const handleProfileUpdate = () => fetchChapters();
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-8 space-y-6 flex-1">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900">Alumni Chapters</h1>
          <p className="text-gray-500 text-sm">Connect with fellow Ateneans around the world</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-left">
            <h2 className="text-xl font-bold text-gray-900">ADDU Alumni Association Officers</h2>
            <p className="text-gray-500 text-sm">Meet the dedicated leaders of our alumni community</p>
          </div>
          {loadingChapters && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-500 text-left">Loading chapters...</div>
          )}
          {!loadingChapters && chaptersError && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-red-600 text-left">{chaptersError}</div>
          )}
          {!loadingChapters && !chaptersError && chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-[#1a24d2] p-4 flex items-center gap-3 text-white font-bold text-sm">
                <Award className="w-5 h-5" /> {chapter.name}
              </div>
              <div className="divide-y divide-gray-50">
                {chapter.active_officers.length === 0 ? (
                  <div className="p-6 text-sm text-gray-400 text-left">No active officers assigned yet.</div>
                ) : (
                  chapter.active_officers.map((officer) => (
                    <AlumniRow key={officer.id} alumnus={mapOfficerToAlumnus(officer)} isOfficer />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <DirectoryFooter />
    </div>
  );
}

function AlumniRow({ alumnus, isOfficer }: { alumnus: any, isOfficer?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasProfileImage = Boolean(alumnus.profileImageUrl) && !imageFailed;

  return (
    <div className="p-6 flex flex-col lg:flex-row items-center gap-6 text-left transition-colors hover:bg-gray-50/50">
      <div className="w-12 h-12 bg-[#1a24d2] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
        {hasProfileImage ? (
          <img
            src={alumnus.profileImageUrl}
            alt={`${alumnus.name} profile`}
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          alumnus.initials
        )}
      </div>
      <div className="flex-1 min-w-[180px]">
        <h3 className="text-[#1a24d2] font-bold text-sm hover:underline cursor-pointer">{alumnus.name}</h3>
        <p className="text-gray-400 text-[11px]">Class of {alumnus.class}</p>
        {isOfficer && (
          <p className="text-[#1a24d2] font-bold text-[11px] mt-1">
            {alumnus.officerRole}
            {alumnus.schoolYear && <span className="text-gray-400 font-medium"> · SY {alumnus.schoolYear}</span>}
          </p>
        )}
      </div>
      <div className="flex-1 text-gray-500 text-[12px]">{alumnus.program}</div>
      <div className="flex-1 text-gray-500 text-[12px] flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-gray-300" /> 
        <span className="truncate">{alumnus.role}{alumnus.company ? `, ${alumnus.company}` : ''}</span>
      </div>
      <div className="flex-1 flex items-center gap-2 text-gray-400 text-[12px]">
        <MapPin className="w-4 h-4 shrink-0" /> <span className="truncate">{alumnus.location}</span>
      </div>
      <div className="flex gap-2 shrink-0">
        <button className="flex items-center gap-2 px-4 py-2 border border-[#1a24d2] rounded-lg text-[#1a24d2] font-bold text-xs hover:bg-blue-50 transition-all"><MessageSquare className="w-3.5 h-3.5" /> Message</button>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#1a24d2] rounded-lg text-[#1a24d2] font-bold text-xs hover:bg-blue-50 transition-all"><Mail className="w-3.5 h-3.5" /> Email</button>
      </div>
    </div>
  );
}

function DirectoryFooter() {
  return (
    <footer className="bg-[#001D4A] text-white py-16 px-12 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">ADDU Alumni Association</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Connecting Ateneans worldwide and fostering lifelong relationships with our alma mater.
          </p>
          <div className="flex gap-4">
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"><Facebook className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"><Twitter className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"><Linkedin className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"><Instagram className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Quick Links</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Events Calendar</li>
            <li className="hover:text-white cursor-pointer">Alumni Chapters</li>
            <li className="hover:text-white cursor-pointer">Career Services</li>
            <li className="hover:text-white cursor-pointer">Mentorship Program</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Resources</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Alumni Benefits</li>
            <li className="hover:text-white cursor-pointer">Publications</li>
            <li className="hover:text-white cursor-pointer">Chapter Network</li>
            <li className="hover:text-white cursor-pointer">Volunteer</li>
            <li className="hover:text-white cursor-pointer">Support ADDU</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Contact Us</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 shrink-0" />
              <span>E. Jacinto St, Davao City, 8000 Davao del Sur</span>
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">📞</div>
              <span>(082) 221-2411</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-5 h-5 shrink-0" />
              <span>alumni@addu.edu.ph</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
        © 2026 Ateneo de Davao University Alumni Association. All rights reserved.
      </div>
    </footer>
  );
}