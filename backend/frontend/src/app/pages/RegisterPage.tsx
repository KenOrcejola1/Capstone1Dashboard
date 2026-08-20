import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Phone, Calendar, MapPin, Upload } from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';
import campusNight from '../../assets/Roxas-Colored.jpg';
import { WORLD_COUNTRIES, COUNTRY_ISO_CODES } from '../utils/countries';
import { formatTelephoneNumber, formatMobileNumber, getDialCode } from '../utils/phoneFormat';
import type { CountryCode } from 'libphonenumber-js';

const COUNTRY_OPTIONS = ['Philippines', ...WORLD_COUNTRIES];

const C = {
  navy:   '#001F5B',
  navyDk: '#00153D',
  blue:   '#003087',
  gold:   '#C5A96A',
  goldLt: '#D4BC86',
} as const;

const PROGRAM_OPTIONS = [
  // AB programs
  'AB in Anthropology',
  'AB in Anthropology - Academic Research',
  'AB in Anthropology - Community Development/Social Enterprise',
  'AB in Anthropology - Leadership/Pre-Law',
  'AB in Communication',
  'AB in Development Studies',
  'AB in English Language',
  'AB in Interdisciplinary Studies Minor in Language and Literature',
  'AB in Interdisciplinary Studies Minor in Media and Business',
  'AB in Interdisciplinary Studies Minor in Media and Philosophy',
  'AB in Interdisciplinary Studies Minor in Media and Technology',
  'AB in Interdisciplinary Studies Minor in Philosophy and Theology',
  'AB in International Studies Major in American Studies',
  'AB in International Studies Major in Asian Studies',
  'AB in Islamic Studies',
  'AB in Islamic Studies Major in Political Economy',
  'AB in Islamic Studies Minor in Education',
  'AB in Mass Communication',
  'AB in Philosophy',
  'AB in Psychology',
  'AB Sociology',
  'AB Major in Economics',
  'AB Major in Political Science',
  // Bachelor programs
  'Bachelor of Early Childhood Education',
  'Bachelor of Early Childhood Education Major in Preschool',
  'Bachelor of Elementary Education',
  'Bachelor of Public Administration',
  'Bachelor of Public Management',
  'Bachelor of Secondary Education Major in Biological Sciences',
  'Bachelor of Secondary Education Major in English',
  'Bachelor of Secondary Education Major in Mathematics',
  'Bachelor of Secondary Education Major in Physical Sciences',
  'Bachelor of Secondary Education Major in Science',
  'Bachelor of Secondary Education Major in Social Studies',
  // BS programs
  'BS in Accountancy',
  'BS in Accounting Technology',
  'BS in Aerospace Engineering',
  'BS in Aerospace Engineering (Academic Research)',
  'BS in Aerospace Engineering (Industry and Technopreneurship)',
  'BS in Architecture',
  'BS in Biology Major in General Biology',
  'BS in Biology Major in Medical Biology',
  'BS in Business Management',
  'BS in Chemical Engineering',
  'BS in Chemistry',
  'BS in Civil Engineering',
  'BS in Civil Engineering (Construction Engineering and Management)',
  'BS in Civil Engineering (Structural)',
  'BS in Civil Engineering (Transportation)',
  'BS in Computer Engineering',
  'BS in Computer Science',
  'BS in Data Science',
  'BS in Electrical Engineering',
  'BS in Electronics Engineering',
  'BS in Entrepreneurship',
  'BS in Entrepreneurship Major in Agri-Business',
  'BS in Environmental Science',
  'BS in Finance',
  'BS in HR Management',
  'BS in Human Resource Development and Management',
  'BS in Industrial Engineering',
  'BS Information Management',
  'BS in Information Systems',
  'BS in Information Technology',
  'BS in Management Accounting',
  'BS in Marketing',
  'BS in Mathematics',
  'BS in Mechanical Engineering',
  'BS in Nursing',
  'BS in Psychology',
  'BS in Robotics Engineering',
  'BS in Social Work',
];

const PSGC_API = 'https://psgc.cloud/api';

const REGION_PSGC_CODES: Record<string, string> = {
  'ncr': '1300000000',
  'car': '1400000000',
  'region-1': '0100000000',
  'region-2': '0200000000',
  'region-3': '0300000000',
  'region-4a': '0400000000',
  'region-4b': '1700000000',
  'region-5': '0500000000',
  'region-6': '0600000000',
  'region-7': '0700000000',
  'region-8': '0800000000',
  'region-9': '0900000000',
  'region-10': '1000000000',
  'region-11': '1100000000',
  'region-12': '1200000000',
  'region-13': '1600000000',
  'barmm': '1900000000',
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    maidenName: '',
    email: '',
    password: '',
    currentAddress: '',
    country: '',
    phoneNumber: '',
    telephoneNumber: '',
    zipcode: '',
    sex: '',
    religion: '',
    religionOther: '',
    maritalStatus: '',
    birthDate: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    course: '',
    batchYear: '',
    hasDiploma: 'no',
    idType: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [validIdFile, setValidIdFile] = useState<File | null>(null);
  const [photo2x2File, setPhoto2x2File] = useState<File | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [barangays, setBarangays] = useState<string[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [telephoneError, setTelephoneError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(
    () => sessionStorage.getItem('termsAccepted') === 'true'
  );

  useEffect(() => {
    setTermsAccepted(sessionStorage.getItem('termsAccepted') === 'true');
  }, []);

  useEffect(() => {
    if (!formData.region) return;
    const regionCode = REGION_PSGC_CODES[formData.region];
    if (!regionCode) return;

    setFormData(prev => ({ ...prev, province: '', city: '', barangay: '' }));
    setProvinces([]);
    setCities([]);
    setBarangays([]);

    if (formData.region === 'ncr') {
      setLoadingCities(true);
      fetch(`${PSGC_API}/regions/${regionCode}/cities-municipalities`)
        .then(res => res.json())
        .then((data: { code: string; name: string }[]) =>
          setCities(data.sort((a, b) => a.name.localeCompare(b.name)))
        )
        .catch(() => setCities([]))
        .finally(() => setLoadingCities(false));
    } else {
      setLoadingProvinces(true);
      fetch(`${PSGC_API}/regions/${regionCode}/provinces`)
        .then(res => res.json())
        .then((data: { code: string; name: string }[]) =>
          setProvinces(data.sort((a, b) => a.name.localeCompare(b.name)))
        )
        .catch(() => setProvinces([]))
        .finally(() => setLoadingProvinces(false));
    }
  }, [formData.region]);

  useEffect(() => {
    if (!formData.province || formData.region === 'ncr') return;
    const province = provinces.find(p => p.name === formData.province);
    if (!province) return;

    setFormData(prev => ({ ...prev, city: '', barangay: '' }));
    setCities([]);
    setBarangays([]);
    setLoadingCities(true);

    fetch(`${PSGC_API}/provinces/${province.code}/cities-municipalities`)
      .then(res => res.json())
      .then((data: { code: string; name: string }[]) =>
        setCities(data.sort((a, b) => a.name.localeCompare(b.name)))
      )
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, [formData.province, provinces]);

  useEffect(() => {
    if (!formData.city) return;
    const city = cities.find(c => c.name === formData.city);
    if (!city) return;

    setFormData(prev => ({ ...prev, barangay: '' }));
    setBarangays([]);
    setLoadingBarangays(true);

    fetch(`${PSGC_API}/cities-municipalities/${city.code}/barangays`)
      .then(res => res.json())
      .then((data: { name: string }[]) =>
        setBarangays(data.map(b => b.name.trim()).sort((a, b) => a.localeCompare(b)))
      )
      .catch(() => setBarangays([]))
      .finally(() => setLoadingBarangays(false));
  }, [formData.city, cities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    // Validate password is not empty
    if (!formData.password || formData.password.trim() === '') {
      alert('Password cannot be empty.');
      return;
    }

    // Validate phone number length
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      alert('Phone number must be between 7 and 15 digits.');
      return;
    }

    // Validate telephone number length if provided
    if (formData.telephoneNumber && formData.telephoneNumber.trim() !== '') {
      if (!phoneRegex.test(formData.telephoneNumber.replace(/\D/g, ''))) {
        alert('Telephone number must be between 7 and 15 digits.');
        return;
      }
    }
    
    // Validate required file uploads
    if (!validIdFile) {
      alert('Please upload your Valid ID');
      return;
    }

    if (!photo2x2File) {
      alert('Please upload your 2x2 photo');
      return;
    }

    if (formData.hasDiploma === 'yes' && !diplomaFile) {
      alert('Please upload your Diploma/Degree');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address (e.g., user@gmail.com)');
      return;
    }

    // Validate email domain (ensure it's a real email provider)
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 
      'icloud.com', 'protonmail.com', 'zoho.com', 'aol.com',
      'addu.edu.ph', 'mail.com', 'yandex.com', 'gmx.com'
    ];
    
    if (!emailDomain || (!commonDomains.includes(emailDomain) && !emailDomain.includes('.'))) {
      alert('Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)');
      return;
    }

    try {
      // Clean and prepare middle name - ensure empty string becomes null
      const cleanMiddleName = formData.middleName && formData.middleName.trim() !== '' ? formData.middleName.trim() : null;
      
      // Construct display name (middle name intentionally excluded from display name)
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      
      // Append all user data fields
      formDataToSend.append('first_name', formData.firstName.trim());
      formDataToSend.append('middle_name', cleanMiddleName || '');
      formDataToSend.append('last_name', formData.lastName.trim());
      formDataToSend.append('maiden_name', formData.maidenName.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', 'alumni');
      formDataToSend.append('phone_number', formData.phoneNumber.trim());
      formDataToSend.append('telephone_number', formData.telephoneNumber && formData.telephoneNumber.trim() !== '' ? formData.telephoneNumber.trim() : '');
      formDataToSend.append('current_address', formData.currentAddress.trim());
      formDataToSend.append('country', formData.country);
      formDataToSend.append('zipcode', formData.zipcode.trim());
      formDataToSend.append('sex', formData.sex);
      formDataToSend.append('religion', formData.religion);
      formDataToSend.append('religion_other', formData.religionOther && formData.religionOther.trim() !== '' ? formData.religionOther.trim() : '');
      formDataToSend.append('marital_status', formData.maritalStatus);
      formDataToSend.append('birth_date', formData.birthDate);
      formDataToSend.append('region', formData.country === 'Philippines' ? formData.region : '');
      formDataToSend.append('province', formData.country === 'Philippines' ? formData.province.trim() : '');
      formDataToSend.append('city', formData.country === 'Philippines' ? formData.city.trim() : '');
      formDataToSend.append('barangay', formData.country === 'Philippines' ? formData.barangay.trim() : '');
      formDataToSend.append('course', formData.course);
      formDataToSend.append('batch_year', formData.batchYear);
      formDataToSend.append('name', fullName);
      
      // Append file upload fields
      formDataToSend.append('has_diploma', formData.hasDiploma);
      if (diplomaFile) {
        formDataToSend.append('diploma_file', diplomaFile);
      }
      formDataToSend.append('id_type', formData.idType);
      if (validIdFile) {
        formDataToSend.append('valid_id_file', validIdFile);
      }
      if (photo2x2File) {
        formDataToSend.append('photo_2x2_file', photo2x2File);
      }

      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        body: formDataToSend, // Send FormData instead of JSON
      });

      if (response.ok) {
        await response.json();
        sessionStorage.removeItem('termsAccepted');
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        alert(error.message || 'Registration failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Unable to connect to the server. Please ensure the Laravel server is running and try again.');
    }
  };

  const validatePhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('09') && digits.length !== 11) return 'Philippine mobile numbers must be 11 digits (09XXXXXXXXX)';
    if (!digits.startsWith('09') && (digits.length < 7 || digits.length > 15)) return 'Enter a valid number with 7–15 digits';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      const iso = COUNTRY_ISO_CODES[formData.country] as CountryCode | undefined;
      const formatted = formatMobileNumber(value, iso);
      setFormData(prev => ({ ...prev, phoneNumber: formatted }));
      setPhoneError(validatePhone(formatted));
      return;
    }

    if (name === 'telephoneNumber') {
      const sanitized = formatTelephoneNumber(value);
      setFormData(prev => ({ ...prev, telephoneNumber: sanitized }));
      setTelephoneError(sanitized ? validatePhone(sanitized) : '');
      return;
    }

    if (name === 'zipcode') {
      setFormData(prev => ({ ...prev, zipcode: value.replace(/\D/g, '') }));
      return;
    }

    if (name === 'country') {
      // Prefill the mobile number with the selected country's dial code, but
      // only if the field is still empty - never overwrite a number the
      // alumnus already typed (they may keep a number from another country).
      const iso = COUNTRY_ISO_CODES[value] as CountryCode | undefined;
      const callingCode = getDialCode(iso);
      setFormData(prev => ({
        ...prev,
        country: value,
        phoneNumber: !prev.phoneNumber.trim() && callingCode ? callingCode : prev.phoneNumber,
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordMismatch(formData.confirmPassword !== '' && formData.confirmPassword !== value);
    }
    if (name === 'confirmPassword') {
      setPasswordMismatch(value !== '' && value !== formData.password);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'diploma' | 'validId' | 'photo2x2') => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === 'diploma') {
        setDiplomaFile(file);
      } else if (fileType === 'validId') {
        setValidIdFile(file);
      } else {
        setPhoto2x2File(file);
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;700&display=swap');
      `}</style>

      {/* Left Side */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, rgba(0,21,61,0.92) 0%, rgba(0,48,135,0.75) 60%, rgba(0,21,61,0.88) 100%), url(${campusNight}) center/cover`
        }}
      >
        {/* Gold line accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
          background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
          opacity: 0.6,
        }} />

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: 36, left: 36, zIndex: 10,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400,
            letterSpacing: '0.03em', color: 'rgba(255,255,255,0.7)',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Centered content */}
        <div style={{
          position: 'relative', zIndex: 2,
          height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 4rem', textAlign: 'center',
        }}>
          {/* Logo */}
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginBottom: 28,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <img src={ADDULogo} alt="ADDU Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>

          {/* Eyebrow badge */}
          <span style={{
            display: 'inline-block',
            padding: '3px 14px',
            borderRadius: 100,
            border: `1px solid ${C.gold}`,
            color: C.gold,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Ad Majorem Dei Gloriam
          </span>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.4rem, 3.5vw, 3.2rem)',
            fontWeight: 500,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Welcome Home,<br />
            <em style={{ color: C.goldLt, fontStyle: 'italic' }}>Ateneans.</em>
          </h1>

          <p style={{
            fontSize: 14, fontWeight: 300,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8, maxWidth: 340,
            marginBottom: 40,
          }}>
            Connecting generations of excellence. Join our thriving community of over 50,000 alumni making a difference worldwide.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 32,
          }}>
            {[
              { n: '50K+', l: 'Alumni' },
              { n: '50+',  l: 'Countries' },
              { n: '60+',  l: 'Years' },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.7rem', fontWeight: 600,
                  color: C.gold, lineHeight: 1,
                }}>
                  {n}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginTop: 4,
                }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        {/* Mobile Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-[#003087] hover:text-[#00153D] transition lg:hidden"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-h-[90vh] overflow-y-auto">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-2">
              <img src={ADDULogo} alt="ADDU Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#003087] mb-2">Register</h2>
          <p className="text-gray-600 mb-8">Create your alumni account</p>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Middle Name */}
              <div>
                <label htmlFor="middleName" className="block text-gray-700 font-medium mb-2">Middle Name <span className="text-gray-400 font-normal text-sm">(Optional)</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="middleName"
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Middle Name (if applicable)"
                    autoComplete="off"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email (e.g., user@gmail.com)"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${passwordMismatch ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${
                    passwordMismatch
                      ? 'border-red-500 focus:ring-red-400 bg-red-50'
                      : 'border-gray-300 focus:ring-[#003D7A]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${passwordMismatch ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${
                    passwordMismatch
                      ? 'border-red-500 focus:ring-red-400 bg-red-50'
                      : 'border-gray-300 focus:ring-[#003D7A]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordMismatch && <p className="mt-1 text-xs text-red-500">Passwords do not match</p>}
            </div>

            {/* Current Address */}
            <div className="mb-6">
              <label htmlFor="currentAddress" className="block text-gray-700 font-medium mb-2">Current Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="currentAddress"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter your current address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition resize-none"
                  required
                />
              </div>
            </div>

            {/* Country/Location & Zipcode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Country/Location */}
              <div>
                <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country/Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  >
                    <option value="">Select your country</option>
                    {COUNTRY_OPTIONS.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Zipcode */}
              <div>
                <label htmlFor="zipcode" className="block text-gray-700 font-medium mb-2">Zipcode</label>
                <input
                  id="zipcode"
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="Enter your zipcode"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Philippine Location Fields - Only show when Philippines is selected */}
            {formData.country === 'Philippines' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Region of Origin */}
                <div>
                  <label htmlFor="region" className="block text-gray-700 font-medium mb-2">Region of Origin</label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  >
                    <option value="" disabled hidden>Select your region</option>
                    <option value="region-11">Region XI (Davao Region)</option>
                    <option value="ncr">NCR (National Capital Region)</option>
                    <option value="car">CAR (Cordillera Administrative Region)</option>
                    <option value="region-1">Region I (Ilocos Region)</option>
                    <option value="region-2">Region II (Cagayan Valley)</option>
                    <option value="region-3">Region III (Central Luzon)</option>
                    <option value="region-4a">Region IV-A (CALABARZON)</option>
                    <option value="region-4b">Region IV-B (MIMAROPA)</option>
                    <option value="region-5">Region V (Bicol Region)</option>
                    <option value="region-6">Region VI (Western Visayas)</option>
                    <option value="region-7">Region VII (Central Visayas)</option>
                    <option value="region-8">Region VIII (Eastern Visayas)</option>
                    <option value="region-9">Region IX (Zamboanga Peninsula)</option>
                    <option value="region-10">Region X (Northern Mindanao)</option>
                    <option value="region-12">Region XII (SOCCSKSARGEN)</option>
                    <option value="region-13">Region XIII (Caraga)</option>
                    <option value="barmm">BARMM (Bangsamoro Autonomous Region)</option>
                  </select>
                </div>

                {/* Province - Only show if region has provinces (not for NCR) */}
                {formData.region !== 'ncr' && (
                  <div>
                    <label htmlFor="province" className="block text-gray-700 font-medium mb-2">Province</label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                      required
                    >
                      <option value="" disabled hidden>Select your province</option>
                      {loadingProvinces ? (
                        <option disabled>Loading provinces...</option>
                      ) : (
                        provinces.map(p => (
                          <option key={p.code} value={p.name}>{p.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                )}

                {/* Location of Town/City */}
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-2">Location of Town/City</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  >
                    <option value="" disabled hidden>Select your city/municipality</option>
                    {loadingCities ? (
                      <option disabled>Loading cities...</option>
                    ) : (
                      cities.map(city => (
                        <option key={city.code} value={city.name}>{city.name}</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Barangay - hidden if the selected city/municipality has no barangays on record */}
                {!(formData.city && !loadingBarangays && barangays.length === 0) && (
                  <div>
                    <label htmlFor="barangay" className="block text-gray-700 font-medium mb-2">Barangay</label>
                    <select
                      id="barangay"
                      name="barangay"
                      value={formData.barangay}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                      required
                      disabled={!formData.city || loadingBarangays}
                    >
                      <option value="" disabled hidden>
                        {!formData.city ? 'Select a city/municipality first' : 'Select your barangay'}
                      </option>
                      {loadingBarangays ? (
                        <option disabled>Loading barangays...</option>
                      ) : (
                        barangays.map(barangay => (
                          <option key={barangay} value={barangay}>{barangay}</option>
                        ))
                      )}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Phone Number & Telephone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${phoneError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="09XXXXXXXXX"
                    maxLength={16}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      phoneError
                        ? 'border-red-500 focus:ring-red-400 bg-red-50'
                        : 'border-gray-300 focus:ring-[#003D7A]'
                    }`}
                    required
                  />
                </div>
                {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
              </div>

              {/* Telephone Number (Optional) */}
              <div>
                <label htmlFor="telephoneNumber" className="block text-gray-700 font-medium mb-2">Telephone Number <span className="text-gray-400 font-normal text-sm">(Optional)</span></label>
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${telephoneError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    id="telephoneNumber"
                    type="tel"
                    name="telephoneNumber"
                    value={formData.telephoneNumber}
                    onChange={handleChange}
                    placeholder="(0XX) XXX-XXXX"
                    maxLength={14}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      telephoneError
                        ? 'border-red-500 focus:ring-red-400 bg-red-50'
                        : 'border-gray-300 focus:ring-[#003D7A]'
                    }`}
                  />
                </div>
                {telephoneError && <p className="mt-1 text-xs text-red-500">{telephoneError}</p>}
              </div>
            </div>

            {/* Birth Date */}
            <div className="mb-6">
              <label htmlFor="birthDate" className="block text-gray-700 font-medium mb-2">Birth Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Sex */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Sex</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value="male"
                    checked={formData.sex === 'male'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#003D7A] focus:ring-2 focus:ring-[#003D7A]"
                    required
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value="female"
                    checked={formData.sex === 'female'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#003D7A] focus:ring-2 focus:ring-[#003D7A]"
                  />
                  <span className="text-gray-700">Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value="prefer_not_to_say"
                    checked={formData.sex === 'prefer_not_to_say'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#003D7A] focus:ring-2 focus:ring-[#003D7A]"
                  />
                  <span className="text-gray-700">Prefer not to say</span>
                </label>
              </div>
            </div>

            {/* Religion */}
            <div className="mb-6">
              <label htmlFor="religion" className="block text-gray-700 font-medium mb-2">Religion</label>
              <select
                id="religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                required
              >
                <option value="" disabled hidden>Select your religion</option>
                <option value="none">None</option>
                <option value="roman_catholic">Roman Catholic</option>
                <option value="protestant">Protestant</option>
                <option value="iglesia_ni_cristo">Iglesia ni Cristo</option>
                <option value="islam">Islam</option>
                <option value="born_again">Born Again</option>
                <option value="other">Others (Please Specify)</option>
              </select>

              {/* Conditional: Show text input if "Other" is selected */}
              {formData.religion === 'other' && (
                <input
                  type="text"
                  name="religionOther"
                  value={formData.religionOther}
                  onChange={handleChange}
                  placeholder="Please specify your religion"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition mt-3"
                  required
                />
              )}
            </div>

            {/* Marital Status */}
            <div className="mb-6">
              <label htmlFor="maritalStatus" className="block text-gray-700 font-medium mb-2">Marital Status</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                required
              >
                <option value="" disabled hidden>Select your marital status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="living_in">Living-in</option>
                <option value="separated">Separated</option>
                <option value="annulled">Annulled</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            {/* Maiden Name - only relevant if marital status implies a past or current marriage */}
            {['married', 'separated', 'annulled', 'divorced', 'widowed'].includes(formData.maritalStatus) && (
              <div className="mb-6">
                <label htmlFor="maidenName" className="block text-gray-700 font-medium mb-2">
                  Maiden Name <span className="text-gray-400 font-normal text-sm">(if your surname is different from when you studied at Ateneo)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="maidenName"
                    type="text"
                    name="maidenName"
                    value={formData.maidenName}
                    onChange={handleChange}
                    placeholder="Last name used during your studies at Ateneo"
                    autoComplete="off"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  This helps us match your alumni and diploma records, which may be under your maiden name.
                </p>
              </div>
            )}

            {/* Course & Batch Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Course Graduated */}
              <div>
                <label htmlFor="course" className="block text-gray-700 font-medium mb-2">Degree Program Completed:</label>
                <input
                  id="course"
                  list="program-options"
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Type to search or select your program"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
                <datalist id="program-options">
                  {PROGRAM_OPTIONS.map((program) => (
                    <option key={program} value={program} />
                  ))}
                </datalist>
              </div>

              {/* Batch Year */}
              <div>
                <label htmlFor="batchYear" className="block text-gray-700 font-medium mb-2">Batch Year</label>
                <select
                  id="batchYear"
                  name="batchYear"
                  value={formData.batchYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                >
                  <option value="" disabled hidden>Select batch year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Do you have your diploma/degree */}
            <div className="mb-6">
              <label htmlFor="hasDiploma" className="block text-gray-700 font-medium mb-2">Do you have your diploma/degree? (Optional)</label>
              <select
                id="hasDiploma"
                name="hasDiploma"
                value={formData.hasDiploma}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {/* Upload Diploma/Degree (Conditional) */}
            {formData.hasDiploma === 'yes' && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Upload Diploma/Degree</label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                  <input
                    type="file"
                    id="diplomaFile"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => handleFileChange(e, 'diploma')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="pointer-events-none">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-1">
                      {diplomaFile ? diplomaFile.name : 'Click to upload your Diploma/Degree'}
                    </p>
                    <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Proof of Identity */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Proof of Identity (Valid ID) </label>
              
              {/* Select ID Type */}
              <div className="mb-4">
                <label htmlFor="idType" className="block text-gray-600 text-sm mb-2">Select ID Type </label>
                <select
                  id="idType"
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                >
                  <option value="" disabled hidden>Choose your valid ID</option>
                  <option value="drivers-license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="umid">UMID</option>
                  <option value="sss">SSS ID</option>
                  <option value="philhealth">PhilHealth ID</option>
                  <option value="postal">Postal ID</option>
                  <option value="voters">Voter's ID</option>
                  <option value="prc">PRC ID</option>
                  <option value="national-id">National ID (PhilSys)</option>
                </select>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                <input
                  type="file"
                  id="validIdFile"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => handleFileChange(e, 'validId')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-1">
                    {validIdFile ? validIdFile.name : 'Click to upload your Valid ID'}
                  </p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* 2x2 Photo */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">2x2 Photo (Required)</label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                <input
                  type="file"
                  id="photo2x2File"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => handleFileChange(e, 'photo2x2')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-1">
                    {photo2x2File ? photo2x2File.name : 'Click to upload your 2x2 photo'}
                  </p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={!termsAccepted}
              className={`w-full py-4 rounded-lg font-semibold text-lg shadow-lg mb-3 transition ${
                termsAccepted
                  ? 'bg-[#003D7A] text-white hover:bg-[#002855] cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Register
            </button>

            {!termsAccepted && (
              <p className="text-center text-xs text-red-500 mb-4">
                You must accept the Terms &amp; Conditions before registering.
              </p>
            )}

            {/* Terms & Conditions Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {termsAccepted ? (
                  <>
                    <span className="text-green-600 font-medium text-sm">✓ Terms &amp; Conditions accepted</span>
                    {' — '}
                    <button
                      type="button"
                      onClick={() => navigate('/terms')}
                      className="text-[#003D7A] hover:text-[#002855] font-bold transition text-sm"
                    >
                      Review Terms &amp; Conditions
                    </button>
                  </>
                ) : (
                  <>
                    {'Review '}
                    <button
                      type="button"
                      onClick={() => navigate('/terms')}
                      className="text-[#003D7A] hover:text-[#002855] font-bold transition"
                    >
                      Terms &amp; Conditions
                    </button>
                    {' before registering.'}
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Registration Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center">
            {/* Checkmark Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Submitted Successfully!</h2>

            <p className="text-gray-600 leading-relaxed mb-8">
              Your registered account will be verified by an administrator within{' '}
              <span className="font-semibold text-[#003087]">24 to 48 hours</span>. You will be able to
              log in once your account has been approved.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#003087] text-white rounded-xl font-semibold text-base hover:bg-[#002066] transition-colors shadow-md"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
