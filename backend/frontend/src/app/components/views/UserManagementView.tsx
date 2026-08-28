import { useState, useEffect } from 'react';
import { Users, Search, Edit, Trash2, Plus, X, Mail, Phone, MapPin, GraduationCap, Calendar, Shield, Lock, Unlock, Check, XCircle, Eye, Award, CheckCircle, UserMinus, RotateCcw } from 'lucide-react';
import { OfficerBadge } from '../OfficerBadge';

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

interface User {
  id: number;
  name: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email: string;
  role: 'alumni' | 'admin';
  is_active: number;
  approval_status?: 'pending' | 'approved' | 'disapproved';
  phone_number?: string;
  telephone_number?: string;
  current_address?: string;
  country?: string;
  zipcode?: string;
  sex?: string;
  religion?: string;
  religion_other?: string;
  marital_status?: string;
  marriage_date?: string;
  intend_to_marry?: string;
  intended_marriage_age?: string;
  no_marriage_reason?: string;
  birth_date?: string;
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
  course?: string;
  batch_year?: string;
  has_diploma?: string;
  diploma_file_path?: string;
  id_type?: string;
  valid_id_file_path?: string;
  photo_2x2_file_path?: string;
  profile_image_path?: string;
  created_at?: string;
  is_officer?: boolean;
}

interface Chapter {
  id: number;
  name: string;
}

const CHAPTER_OFFICER_POSITIONS = [
  'Chapter President',
  'Vice President',
  'VP External / Vice President for External Affairs',
  'Secretary',
  'Treasurer',
  'Board Member',
  'Events Coordinator',
  'Communications/Public Relations Officer',
  'Other',
] as const;

interface ChapterOfficerRow {
  id: number;
  position: string;
  school_year: string;
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  chapter: Chapter;
  user: {
    id: number;
    name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

function officerName(user: ChapterOfficerRow['user']) {
  return user.name?.trim() || [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || user.email;
}

function OfficerStatusBadge({ status, isActive }: { status: string; isActive: boolean }) {
  if (status === 'approved' && !isActive) {
    return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500">Deactivated</span>;
  }
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return <span className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

interface UserManagementViewProps {
  userRole: 'alumni' | 'admin';
  userEmail?: string;
}

export function UserManagementView({ userRole, userEmail = '' }: UserManagementViewProps) {
  const apiBaseUrl = 'http://localhost:8000';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'approval' | 'officers'>('all');

  // Officer assignments (merged in from the standalone Officer Management page)
  const [officers, setOfficers] = useState<ChapterOfficerRow[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [officerFilter, setOfficerFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('approved');
  const [officerSearchTerm, setOfficerSearchTerm] = useState('');
  const [officerChapterFilter, setOfficerChapterFilter] = useState<string>('all');
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignFormError, setAssignFormError] = useState<string | null>(null);
  const [submittingAssign, setSubmittingAssign] = useState(false);
  const [assignForm, setAssignForm] = useState({ chapter_id: '', email: '', position: '', school_year: '' });
  const [positionChoice, setPositionChoice] = useState('');
  const [officerNameQuery, setOfficerNameQuery] = useState('');
  const [showOfficerNameSuggestions, setShowOfficerNameSuggestions] = useState(false);

  const alumniDisplayName = (u: User) => [u.first_name, u.last_name].filter(Boolean).join(' ').trim() || u.name;

  const officerNameSuggestions = users
    .filter((u) => u.role === 'alumni')
    .filter((u) => {
      const query = officerNameQuery.trim().toLowerCase();
      if (!query) return true;
      return alumniDisplayName(u).toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
    })
    .slice(0, 8);

  const fetchOfficers = async () => {
    setLoadingOfficers(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/chapter-officers`);
      if (response.ok) setOfficers(await response.json());
    } catch (error) {
      console.error('Error fetching chapter officers:', error);
    } finally {
      setLoadingOfficers(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/chapters`);
      if (response.ok) setChapters(await response.json());
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'officers') {
      fetchOfficers();
      fetchChapters();
    }
  }, [activeTab]);

  const handleAssignOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignFormError(null);
    setSubmittingAssign(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/chapter-officers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assignForm, admin_email: userEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAssignFormError(data.message || 'Failed to assign officer.');
        return;
      }
      setAssignForm({ chapter_id: '', email: '', position: '', school_year: '' });
      setPositionChoice('');
      setOfficerNameQuery('');
      setShowAssignForm(false);
      fetchOfficers();
    } catch (error) {
      setAssignFormError('Connection error. Make sure the server is running.');
    } finally {
      setSubmittingAssign(false);
    }
  };

  const updateOfficerStatus = async (id: number, action: 'approve' | 'reject' | 'deactivate' | 'reactivate') => {
    try {
      await fetch(`${apiBaseUrl}/api/chapter-officers/${id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_email: userEmail }),
      });
      fetchOfficers();
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const deleteOfficerAssignment = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}'s officer assignment? This cannot be undone.`)) return;
    try {
      await fetch(`${apiBaseUrl}/api/chapter-officers/${id}`, { method: 'DELETE' });
      fetchOfficers();
    } catch (error) {
      console.error('Error deleting officer assignment:', error);
    }
  };

  const filteredOfficers = officers
    .filter((o) => officerFilter === 'all' || o.status === officerFilter)
    .filter((o) => officerChapterFilter === 'all' || String(o.chapter?.id) === officerChapterFilter)
    .filter((o) => {
      const query = officerSearchTerm.trim().toLowerCase();
      if (!query) return true;
      return (
        officerName(o.user).toLowerCase().includes(query) ||
        o.user.email.toLowerCase().includes(query) ||
        o.chapter?.name?.toLowerCase().includes(query) ||
        o.position.toLowerCase().includes(query)
      );
    });
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [selectedPendingUser, setSelectedPendingUser] = useState<User | null>(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [imageViewerUrl, setImageViewerUrl] = useState<string | null>(null);
  const [imageViewerTitle, setImageViewerTitle] = useState('');
  
  // Helper function to get display name
  const getDisplayName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`.trim();
    }
    return user.name;
  };

  const getInitials = (displayName: string) => {
    const nameParts = displayName.split(' ').filter(n => n.length > 0);
    if (nameParts.length === 0) return 'U';
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  };

  const getProfileImageUrl = (user: User) => {
    if (!user.profile_image_path) return null;
    return `${apiBaseUrl}/storage/${user.profile_image_path}`;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'alumni' | 'admin'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editPhoneError, setEditPhoneError] = useState('');
  const [createPhoneError, setCreatePhoneError] = useState('');
  const [newUser, setNewUser] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    current_address: '',
    course: '',
    batch_year: ''
  });

  // Fetch all users from API
  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
    
    // Listen for profile updates to refresh user list
    const handleProfileUpdate = () => {
      fetchUsers();
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  // Fetch pending users when approval tab is active
  useEffect(() => {
    if (activeTab === 'approval') {
      fetchPendingUsers();
    }
  }, [activeTab]);

  const fetchPendingUsers = async () => {
    try {
      setLoadingPending(true);
      const response = await fetch('http://localhost:8000/api/users/pending/list');
      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
      } else {
        console.error('Failed to fetch pending users');
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleApprove = async (user: User) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}/approve`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setPendingUsers(prev => prev.filter(u => u.id !== user.id));
        setIsPendingModalOpen(false);
        setSelectedPendingUser(null);
        fetchUsers();
        alert(`${getDisplayName(user)}'s account has been approved. They can now log in.`);
      } else {
        alert('Failed to approve user. Please try again.');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user. Please check your connection.');
    }
  };

  const handleDisapprove = async (user: User) => {
    if (!window.confirm(`Are you sure you want to disapprove ${getDisplayName(user)}'s registration? They will not be able to log in.`)) return;
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}/disapprove`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setPendingUsers(prev => prev.filter(u => u.id !== user.id));
        setIsPendingModalOpen(false);
        setSelectedPendingUser(null);
        fetchUsers();
        alert(`${getDisplayName(user)}'s registration has been disapproved.`);
      } else {
        alert('Failed to disapprove user. Please try again.');
      }
    } catch (error) {
      console.error('Error disapproving user:', error);
      alert('Error disapproving user. Please check your connection.');
    }
  };

  const validatePhone = (value: string, target: 'edit' | 'create') => {
    if (!value) {
      target === 'edit' ? setEditPhoneError('') : setCreatePhoneError('');
      return;
    }
    const isValid = value.startsWith('09')
      ? value.length === 11
      : value.length >= 7 && value.length <= 15;
    const msg = isValid ? '' : value.startsWith('09')
      ? 'Philippine mobile numbers must be 11 digits (e.g. 09171234567)'
      : 'Enter a valid phone number (7–15 digits)';
    target === 'edit' ? setEditPhoneError(msg) : setCreatePhoneError(msg);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/users');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched users:', data); // Debug log
        setUsers(data);
      } else {
        console.error('Failed to fetch users, status:', response.status);
        alert('Failed to load users. Make sure the Laravel server is running on port 8000.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Cannot connect to API. Please ensure:\n1. XAMPP MySQL is running\n2. Laravel server is running (php artisan serve)\n3. The API is accessible at http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleToggleActive = async (user: User) => {
    try {
      const newStatus = user.is_active === 1 ? 0 : 1;
      const response = await fetch(`http://localhost:8000/api/users/${user.id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (response.ok) {
        await response.json();
        setUsers(users.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
        alert(`User ${newStatus === 1 ? 'unblocked' : 'blocked'} successfully!`);
      } else {
        console.error('Failed to toggle user status');
        alert('Failed to update user status. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Error updating user status. Please check your connection.');
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      // Clean middle name before sending - convert empty string to null
      const cleanedUser = {
        ...selectedUser,
        middle_name: selectedUser.middle_name && selectedUser.middle_name.trim() !== '' ? selectedUser.middle_name.trim() : null
      };
      
      const response = await fetch(`http://localhost:8000/api/users/id/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === updatedUser.user.id ? updatedUser.user : u));
        setIsModalOpen(false);
        const displayName = getDisplayName(selectedUser);
        setSelectedUser(null);
        alert(`User updated successfully! ${displayName} is now an ${selectedUser.role}.`);
      } else {
        console.error('Failed to update user');
        alert('Failed to update user. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please check your connection.');
    }
  };

  const handleCreate = async () => {
    // Validation
    if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields: First Name, Last Name, Email, and Password');
      return;
    }

    try {
      // Clean middle name - convert empty string to null
      const cleanMiddleName = newUser.middle_name && newUser.middle_name.trim() !== '' ? newUser.middle_name.trim() : null;
      
      // Clean other optional fields
      const cleanPhoneNumber = newUser.phone_number && newUser.phone_number.trim() !== '' ? newUser.phone_number.trim() : null;
      const cleanCurrentAddress = newUser.current_address && newUser.current_address.trim() !== '' ? newUser.current_address.trim() : null;
      const cleanCourse = newUser.course && newUser.course.trim() !== '' ? newUser.course.trim() : null;
      const cleanBatchYear = newUser.batch_year && newUser.batch_year.trim() !== '' ? newUser.batch_year.trim() : null;
      
      const userData = {
        name: `${newUser.first_name} ${newUser.last_name}`.trim(),
        first_name: newUser.first_name,
        middle_name: cleanMiddleName,
        last_name: newUser.last_name,
        email: newUser.email,
        password: newUser.password,
        role: 'alumni',
        approval_status: 'approved',
        phone_number: cleanPhoneNumber,
        current_address: cleanCurrentAddress,
        course: cleanCourse,
        batch_year: cleanBatchYear
      };

      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        setUsers([...users, result.user]);
        setIsCreateModalOpen(false);
        setCreatePhoneError('');
        setNewUser({
          first_name: '',
          middle_name: '',
          last_name: '',
          email: '',
          password: '',
          phone_number: '',
          current_address: '',
          course: '',
          batch_year: ''
        });
        alert(`User created successfully! ${result.user.name} has been added as an alumni.`);
      } else {
        const error = await response.json();
        console.error('Failed to create user:', error);
        alert(error.message || 'Failed to create user. Please try again.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please check your connection.');
    }
  };

  const filteredUsers = users.filter(user => {
    // Exclude pending users from All Users tab
    if (user.approval_status === 'pending') return false;

    // Search term filter
    const displayName = getDisplayName(user);
    const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // Course filter
    const matchesCourse = courseFilter === 'all' || user.course === courseFilter;
    
    return matchesSearch && matchesRole && matchesCourse;
  });

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-700 border-purple-200' 
      : 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div className="p-8 relative">
      {/* ADDU Decorative Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a24d2]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          {activeTab === 'officers' ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Officer Assignments</h1>
              <p className="text-gray-600">Assign alumni as chapter officers and verify their assignments. Only active, approved officers appear on the public Alumni Chapters page.</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage system users and their access levels</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {activeTab === 'officers' ? (
            <button
              onClick={() => setShowAssignForm((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a24d2] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Assign Officer
            </button>
          ) : (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a24d2] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Create New User
            </button>
          )}
          {activeTab !== 'officers' && (
            <>
              <div className="bg-white border-2 border-[#1a24d2]/20 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-600">Total Users: </span>
                <span className="text-lg font-bold text-[#1a24d2]">{users.length}</span>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg px-4 py-2">
                <span className="text-sm text-purple-600">Admin: </span>
                <span className="text-lg font-bold text-purple-700">{users.filter(u => u.role === 'admin').length}</span>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-2">
                <span className="text-sm text-blue-600">Alumni: </span>
                <span className="text-lg font-bold text-blue-700">{users.filter(u => u.role === 'alumni').length}</span>
              </div>
            </>
          )}
          {activeTab === 'approval' && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg px-4 py-2">
              <span className="text-sm text-amber-600">Pending: </span>
              <span className="text-lg font-bold text-amber-700">{pendingUsers.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border-2 border-[#1a24d2]/20 shadow-sm mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-[#1a24d2] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'approval'
                ? 'bg-[#1a24d2] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            For Approval
            {pendingUsers.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
                {pendingUsers.length > 99 ? '99+' : pendingUsers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('officers')}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'officers'
                ? 'bg-[#1a24d2] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Award className="w-4 h-4" /> Officer Assignments
          </button>
        </div>
      </div>

      {/* Search Bar and Filters */}
      {activeTab === 'all' && (
      <div className="bg-white rounded-xl border-2 border-[#1a24d2]/20 p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2] focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="relative lg:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | 'alumni' | 'admin')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2] focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="alumni">Alumni Only</option>
              <option value="admin">Admin Only</option>
            </select>
            <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Course Filter */}
          <div className="relative lg:w-64">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2] focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Courses</option>
              {PROGRAM_OPTIONS.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <GraduationCap className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          {(roleFilter !== 'all' || courseFilter !== 'all' || searchTerm !== '') && (
            <button
              onClick={() => {
                setRoleFilter('all');
                setCourseFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 text-sm border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      )}

      {/* All Users Tab Content */}
      {activeTab === 'all' && (
      <div className="bg-white rounded-xl border-2 border-[#1a24d2]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-[#1a24d2] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a24d2] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Education</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const displayName = getDisplayName(user);
                  const profileImageUrl = getProfileImageUrl(user);
                  return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1a24d2] rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                          {profileImageUrl ? (
                            <img
                              src={profileImageUrl}
                              alt={`${displayName} profile`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(displayName)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {displayName}
                            {user.is_officer && <OfficerBadge />}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.phone_number && (
                        <p className="text-sm text-gray-700 flex items-center gap-1 mb-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {user.phone_number}
                        </p>
                      )}
                      {user.current_address && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {user.current_address.substring(0, 30)}...
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.course && (
                        <p className="text-sm text-gray-700 flex items-center gap-1 mb-1">
                          <GraduationCap className="w-3 h-3 text-gray-400" />
                          {user.course}
                        </p>
                      )}
                      {user.batch_year && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          Batch {user.batch_year}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                        <Shield className="w-3 h-3" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active === 1 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-700 border-green-200">
                          <Unlock className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border bg-red-100 text-red-700 border-red-200">
                          <Lock className="w-3 h-3" />
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.is_active === 1
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.is_active === 1 ? 'Block user' : 'Unblock user'}
                        >
                          {user.is_active === 1 ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No users found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* For Approval Tab Content */}
      {activeTab === 'approval' && (
        <div className="bg-white rounded-xl border-2 border-[#1a24d2]/20 shadow-sm overflow-hidden">
          {loadingPending ? (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-[#1a24d2] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading pending registrations...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Approvals</h3>
              <p className="text-gray-500">There are currently no users waiting for approval.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a24d2] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Course</th>
                    <th className="px-6 py-4 text-left font-semibold">Batch Year</th>
                    <th className="px-6 py-4 text-left font-semibold">Registered</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingUsers.map((user) => {
                    const displayName = getDisplayName(user);
                    const profileImageUrl = getProfileImageUrl(user);

                    return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {profileImageUrl ? (
                              <img
                                src={profileImageUrl}
                                alt={`${displayName} profile`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-amber-700 font-bold text-sm">{getInitials(displayName)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                              {displayName}
                              {user.is_officer && <OfficerBadge />}
                            </p>
                            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">Pending</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">{user.course || '—'}</td>
                      <td className="px-6 py-4 text-gray-600">{user.batch_year || '—'}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setSelectedPendingUser(user); setIsPendingModalOpen(true); }}
                            title="Review"
                            className="p-1.5 bg-[#1a24d2] text-white rounded-lg hover:bg-[#002066] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(user)}
                            title="Approve"
                            className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDisapprove(user)}
                            title="Disapprove"
                            className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'officers' && (
        <div className="space-y-6">
          {showAssignForm && (
            <form onSubmit={handleAssignOfficer} className="bg-white rounded-xl border-2 border-[#1a24d2]/20 p-6 space-y-4 text-left shadow-sm">
              {assignFormError && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{assignFormError}</div>}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Alumni Name</label>
                <input
                  type="text"
                  placeholder="Search alumni by name or email..."
                  value={officerNameQuery}
                  onChange={(e) => {
                    setOfficerNameQuery(e.target.value);
                    setShowOfficerNameSuggestions(true);
                    if (assignForm.email) setAssignForm({ ...assignForm, email: '' });
                  }}
                  onFocus={() => setShowOfficerNameSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowOfficerNameSuggestions(false), 150)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                />
                {showOfficerNameSuggestions && (
                  <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    {officerNameSuggestions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-400">No matching alumni found.</div>
                    ) : (
                      officerNameSuggestions.map((u) => (
                        <button
                          type="button"
                          key={u.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setAssignForm({ ...assignForm, email: u.email });
                            setOfficerNameQuery(alumniDisplayName(u));
                            setShowOfficerNameSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between gap-3 border-b border-gray-50 last:border-b-0"
                        >
                          <span className="font-medium text-sm text-gray-800">{alumniDisplayName(u)}</span>
                          <span className="text-xs text-gray-400 shrink-0">{u.course || 'Course not set'}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Chapter</label>
                  <select
                    required
                    value={assignForm.chapter_id}
                    onChange={(e) => setAssignForm({ ...assignForm, chapter_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  >
                    <option value="">Select chapter</option>
                    {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Alumni Email</label>
                  <input
                    required
                    type="email"
                    placeholder="alumnus@email.com"
                    value={assignForm.email}
                    onChange={(e) => setAssignForm({ ...assignForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Position</label>
                  <select
                    required
                    value={positionChoice}
                    onChange={(e) => {
                      const choice = e.target.value;
                      setPositionChoice(choice);
                      setAssignForm({ ...assignForm, position: choice === 'Other' ? '' : choice });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  >
                    <option value="" disabled>Select position</option>
                    {CHAPTER_OFFICER_POSITIONS.map((position) => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  {positionChoice === 'Other' && (
                    <input
                      required
                      type="text"
                      placeholder="Specify position"
                      value={assignForm.position}
                      onChange={(e) => setAssignForm({ ...assignForm, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2] mt-2"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">School Year</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 2026-2027"
                    value={assignForm.school_year}
                    onChange={(e) => setAssignForm({ ...assignForm, school_year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submittingAssign} className="px-6 py-2.5 bg-[#1a24d2] text-white rounded-lg font-bold text-sm disabled:opacity-50">
                  {submittingAssign ? 'Assigning...' : 'Submit for Verification'}
                </button>
                <button type="button" onClick={() => setShowAssignForm(false)} className="px-6 py-2.5 border border-gray-200 rounded-lg font-bold text-sm text-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-xl border-2 border-[#1a24d2]/20 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, chapter, or position..."
                  value={officerSearchTerm}
                  onChange={(e) => setOfficerSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2] focus:border-transparent"
                />
              </div>

              <div className="relative lg:w-64">
                <select
                  value={officerChapterFilter}
                  onChange={(e) => setOfficerChapterFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2] focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Chapters</option>
                  {chapters.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Award className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {(['approved', 'pending', 'rejected', 'all'] as const).map((f) => {
              const pendingCount = officers.filter((o) => o.status === 'pending').length;
              return (
                <button
                  key={f}
                  onClick={() => setOfficerFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-colors flex items-center gap-1.5 ${officerFilter === f ? 'bg-[#1a24d2] text-white' : 'bg-white border border-gray-200 text-gray-500'}`}
                >
                  {f}
                  {f === 'pending' && pendingCount > 0 && (
                    <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${officerFilter === f ? 'bg-white text-[#1a24d2]' : 'bg-amber-500 text-white'}`}>
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border-2 border-[#1a24d2]/20 shadow-sm overflow-hidden">
            {loadingOfficers && <div className="p-6 text-sm text-gray-500 text-left">Loading officer assignments...</div>}
            {!loadingOfficers && filteredOfficers.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Officer Assignments</h3>
                <p className="text-gray-500">No officer assignments found for this filter.</p>
              </div>
            )}
            {!loadingOfficers && filteredOfficers.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a24d2] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Alumnus</th>
                      <th className="px-6 py-4 text-left font-semibold">Chapter</th>
                      <th className="px-6 py-4 text-left font-semibold">Position</th>
                      <th className="px-6 py-4 text-left font-semibold">School Year</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOfficers.map((officer) => (
                      <tr key={officer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                            {officerName(officer.user)}
                            {officer.status === 'approved' && officer.is_active && <OfficerBadge />}
                          </div>
                          <div className="text-xs text-gray-400">{officer.user.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{officer.chapter?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{officer.position}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{officer.school_year}</td>
                        <td className="px-6 py-4"><OfficerStatusBadge status={officer.status} isActive={officer.is_active} /></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {officer.status === 'pending' && (
                              <>
                                <button onClick={() => updateOfficerStatus(officer.id, 'approve')} title="Approve" className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button onClick={() => updateOfficerStatus(officer.id, 'reject')} title="Reject" className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {officer.status === 'approved' && officer.is_active && (
                              <button onClick={() => updateOfficerStatus(officer.id, 'deactivate')} title="Deactivate / expire this assignment" className="p-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                                <UserMinus className="w-4 h-4" />
                              </button>
                            )}
                            {officer.status === 'approved' && !officer.is_active && (
                              <>
                                <button onClick={() => updateOfficerStatus(officer.id, 'reactivate')} title="Reactivate this assignment" className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteOfficerAssignment(officer.id, officerName(officer.user))} title="Delete this assignment" className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {officer.status === 'rejected' && (
                              <>
                                <button onClick={() => updateOfficerStatus(officer.id, 'approve')} title="Reapprove" className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteOfficerAssignment(officer.id, officerName(officer.user))} title="Delete this assignment" className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending User Review Modal */}
      {isPendingModalOpen && selectedPendingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-500 text-white p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Review Registration</h2>
                <p className="text-amber-100 text-sm mt-1 flex items-center gap-1.5">
                  Pending approval — {getDisplayName(selectedPendingUser)}
                  {selectedPendingUser.is_officer && <OfficerBadge />}
                </p>
              </div>
              <button
                onClick={() => { setIsPendingModalOpen(false); setSelectedPendingUser(null); }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-bold text-[#1a24d2] border-b border-gray-200 pb-2 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium text-gray-500">First Name:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.first_name || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Middle Name:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.middle_name || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Last Name:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.last_name || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Email:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.email}</p></div>
                  <div><span className="font-medium text-gray-500">Birth Date:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.birth_date || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Sex:</span><p className="text-gray-900 mt-0.5 capitalize">{selectedPendingUser.sex || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Religion:</span><p className="text-gray-900 mt-0.5 capitalize">{selectedPendingUser.religion === 'other' ? (selectedPendingUser.religion_other || 'Other') : (selectedPendingUser.religion || '—')}</p></div>
                  <div><span className="font-medium text-gray-500">Marital Status:</span><p className="text-gray-900 mt-0.5 capitalize">{selectedPendingUser.marital_status || '—'}</p></div>
                  {selectedPendingUser.marriage_date && <div><span className="font-medium text-gray-500">Marriage Date:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.marriage_date}</p></div>}
                  {selectedPendingUser.marital_status === 'single' && selectedPendingUser.intend_to_marry && <div><span className="font-medium text-gray-500">Intends to Marry:</span><p className="text-gray-900 mt-0.5 capitalize">{selectedPendingUser.intend_to_marry}</p></div>}
                </div>
              </div>

              {/* Contact & Address */}
              <div>
                <h3 className="text-lg font-bold text-[#1a24d2] border-b border-gray-200 pb-2 mb-4">Contact & Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium text-gray-500">Phone Number:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.phone_number || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Telephone:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.telephone_number || '—'}</p></div>
                  <div className="md:col-span-2"><span className="font-medium text-gray-500">Current Address:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.current_address || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Country:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.country || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Zipcode:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.zipcode || '—'}</p></div>
                  {selectedPendingUser.country === 'Philippines' && <>
                    <div><span className="font-medium text-gray-500">Region:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.region || '—'}</p></div>
                    <div><span className="font-medium text-gray-500">Province:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.province || '—'}</p></div>
                    <div><span className="font-medium text-gray-500">City:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.city || '—'}</p></div>
                    <div><span className="font-medium text-gray-500">Barangay:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.barangay || '—'}</p></div>
                  </>}
                </div>
              </div>

              {/* Academic Info */}
              <div>
                <h3 className="text-lg font-bold text-[#1a24d2] border-b border-gray-200 pb-2 mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium text-gray-500">Course:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.course || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Batch Year:</span><p className="text-gray-900 mt-0.5">{selectedPendingUser.batch_year || '—'}</p></div>
                  <div><span className="font-medium text-gray-500">Has Diploma/Degree:</span><p className="text-gray-900 mt-0.5 capitalize">{selectedPendingUser.has_diploma || '—'}</p></div>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <h3 className="text-lg font-bold text-[#1a24d2] border-b border-gray-200 pb-2 mb-4">Submitted Documents</h3>
                <div className="space-y-4">
                  {/* Diploma */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-700 mb-2">Diploma/Degree Certificate</p>
                    {selectedPendingUser.diploma_file_path ? (
                      <div className="space-y-3">
                        <img
                          src={`http://localhost:8000/storage/${selectedPendingUser.diploma_file_path}`}
                          alt="Diploma/Degree"
                          className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-white cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => { setImageViewerUrl(`http://localhost:8000/storage/${selectedPendingUser.diploma_file_path}`); setImageViewerTitle('Diploma/Degree Certificate'); }}
                        />
                        <button
                          onClick={() => { setImageViewerUrl(`http://localhost:8000/storage/${selectedPendingUser.diploma_file_path}`); setImageViewerTitle('Diploma/Degree Certificate'); }}
                          className="px-3 py-1.5 text-sm bg-[#1a24d2] text-white rounded-lg hover:bg-[#002066] transition-colors"
                        >
                          View Full Image
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{selectedPendingUser.has_diploma === 'yes' ? 'File not found' : 'Not provided (alumni indicated no diploma)'}</p>
                    )}
                  </div>

                  {/* Valid ID */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-700 mb-1">Valid ID</p>
                    <p className="text-xs text-gray-500 mb-2">ID Type: <span className="font-medium text-gray-700 capitalize">{selectedPendingUser.id_type || '—'}</span></p>
                    {selectedPendingUser.valid_id_file_path ? (
                      <div className="space-y-3">
                        <img
                          src={`http://localhost:8000/storage/${selectedPendingUser.valid_id_file_path}`}
                          alt="Valid ID"
                          className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-white cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => { setImageViewerUrl(`http://localhost:8000/storage/${selectedPendingUser.valid_id_file_path}`); setImageViewerTitle('Valid ID'); }}
                        />
                        <button
                          onClick={() => { setImageViewerUrl(`http://localhost:8000/storage/${selectedPendingUser.valid_id_file_path}`); setImageViewerTitle('Valid ID'); }}
                          className="px-3 py-1.5 text-sm bg-[#1a24d2] text-white rounded-lg hover:bg-[#002066] transition-colors"
                        >
                          View Full Image
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No file uploaded</p>
                    )}
                  </div>

                  {/* 2x2 Photo */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-700 mb-2">2x2 Photo</p>
                    {selectedPendingUser.photo_2x2_file_path ? (
                      <div className="space-y-3">
                        <img
                          src={`http://localhost:8000/storage/${selectedPendingUser.photo_2x2_file_path}`}
                          alt="2x2 Photo"
                          className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-white cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => { setImageViewerUrl(`http://localhost:8000/storage/${selectedPendingUser.photo_2x2_file_path}`); setImageViewerTitle('2x2 Photo'); }}
                        />
                        <button
                          onClick={() => { setImageViewerUrl(`http://localhost:8000/storage/${selectedPendingUser.photo_2x2_file_path}`); setImageViewerTitle('2x2 Photo'); }}
                          className="px-3 py-1.5 text-sm bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors"
                        >
                          View Full Image
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No file uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleApprove(selectedPendingUser)}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-base"
                >
                  Approve Registration
                </button>
                <button
                  onClick={() => handleDisapprove(selectedPendingUser)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-base"
                >
                  Disapprove Registration
                </button>
                <button
                  onClick={() => { setIsPendingModalOpen(false); setSelectedPendingUser(null); }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#1a24d2] to-[#0055cc] text-white p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Edit User
                {selectedUser.is_officer && <OfficerBadge />}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                  setEditPhoneError('');
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={selectedUser.first_name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, first_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={selectedUser.middle_name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, middle_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={selectedUser.last_name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, last_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as 'alumni' | 'admin' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                >
                  <option value="alumni">Alumni</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={selectedUser.phone_number || ''}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    setSelectedUser({ ...selectedUser, phone_number: digits });
                    validatePhone(digits, 'edit');
                  }}
                  inputMode="numeric"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2] ${editPhoneError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {editPhoneError && <p className="text-xs text-red-500 mt-1">{editPhoneError}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={selectedUser.current_address || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, current_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Graduated</label>
                  <input
                    list="edit-course-options"
                    value={selectedUser.course || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, course: e.target.value })}
                    placeholder="Type or select course"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  />
                  <datalist id="edit-course-options">
                    {PROGRAM_OPTIONS.map(opt => <option key={opt} value={opt} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Year</label>
                  <select
                    value={selectedUser.batch_year || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, batch_year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  >
                    <option value="">Select batch year</option>
                    {Array.from({ length: 57 }, (_, i) => 2026 - i).map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#1a24d2] text-white px-6 py-3 rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                    setEditPhoneError('');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#1a24d2] to-[#0055cc] text-white p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Create New User</h2>
                <p className="text-sm text-blue-100 mt-1">New users will be created with Alumni role by default</p>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCreatePhoneError('');
                  setNewUser({
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    phone_number: '',
                    current_address: '',
                    course: '',
                    batch_year: ''
                  });
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={newUser.middle_name}
                    onChange={(e) => setNewUser({ ...newUser, middle_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                    placeholder="Santos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                    placeholder="Dela Cruz"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  placeholder="juan.delacruz@addu.edu.ph"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={newUser.phone_number}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    setNewUser({ ...newUser, phone_number: digits });
                    validatePhone(digits, 'create');
                  }}
                  inputMode="numeric"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2] ${createPhoneError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="09171234567"
                />
                {createPhoneError && <p className="text-xs text-red-500 mt-1">{createPhoneError}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Address</label>
                <textarea
                  value={newUser.current_address}
                  onChange={(e) => setNewUser({ ...newUser, current_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  placeholder="Enter current address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Graduated</label>
                  <input
                    list="create-course-options"
                    value={newUser.course}
                    onChange={(e) => setNewUser({ ...newUser, course: e.target.value })}
                    placeholder="Type or select course"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  />
                  <datalist id="create-course-options">
                    {PROGRAM_OPTIONS.map(opt => <option key={opt} value={opt} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Year</label>
                  <select
                    value={newUser.batch_year}
                    onChange={(e) => setNewUser({ ...newUser, batch_year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a24d2]"
                  >
                    <option value="">Select batch year</option>
                    {Array.from({ length: 57 }, (_, i) => 2026 - i).map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Other profile fields (address, civil status, etc.) can be edited later by the user or admin after account creation.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreate}
                  className="flex-1 bg-[#1a24d2] text-white px-6 py-3 rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  Create User
                </button>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewUser({
                      first_name: '',
                      middle_name: '',
                      last_name: '',
                      email: '',
                      password: '',
                      phone_number: '',
                      current_address: '',
                      course: '',
                      batch_year: ''
                    });
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete User</h2>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">{getDisplayName(userToDelete)}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Viewer */}
      {imageViewerUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
          onClick={() => setImageViewerUrl(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg">{imageViewerTitle}</h3>
              <button
                onClick={() => setImageViewerUrl(null)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-gray-50 overflow-auto max-h-[75vh]">
              <img
                src={imageViewerUrl}
                alt={imageViewerTitle}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
