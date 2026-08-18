import { useState, useEffect } from 'react';
import { 
  Heart,
  GraduationCap,
  Building2,
  Microscope,
  Globe,
  BookOpen,
  Presentation,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Gift,
  Award,
  Calendar,
  Trash2,
  CreditCard,
  X,
  Settings,
  Plus,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  TrendingDown,
  Package
} from 'lucide-react';
import { Footer } from '../Footer';
import { AcknowledgementModal } from '../AcknowledgementModal';

interface DonationsViewProps {
  userRole?: "alumni" | "admin";
  onNavigate?: (view: string) => void;
}

interface Campaign {
  id: number;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  goal_amount?: number;
  raised_amount?: number;
  end_date?: string;
  is_active?: boolean;
  goal: string;
  raised: string;
  backers: number;
  status: string;
  donors_count?: number;
  progress_percentage?: number;
  days_left?: number;
  remaining_amount?: number;
}

interface Donor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  amount: string;
  created_at: string;
}

interface VolunteerEvent {
  id: number;
  title: string;
  description: string;
  location?: string;
  event_date?: string | null;
  registration_deadline: string;
  volunteer_slots?: number | null;
  is_active: boolean;
  registrants_count: number;
  slots_remaining: number | null;
  is_registration_open: boolean;
}

interface VolunteerRegistration {
  id: number;
  volunteer_event_id: number;
  full_name: string;
  email: string;
  phone?: string;
  notes?: string;
  created_at: string;
}

interface ItemDonation {
  id: number;
  donor_first_name: string;
  donor_last_name: string;
  donor_full_name: string;
  donor_email: string;
  donor_phone?: string;
  item_name: string;
  category: string;
  description?: string;
  quantity: number;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  delivery_method: 'drop_off' | 'pickup_request';
  pickup_address?: string;
  photo_path?: string;
  status: 'pending' | 'received' | 'rejected';
  created_at: string;
}

interface AnalyticsData {
  all_donations: Donor[];
  general_donations: {
    donations: Donor[];
    total: number;
    count: number;
  };
  campaign_donations: {
    campaign: Campaign;
    donations: Donor[];
    total: number;
    count: number;
  }[];
  overall_total: number;
  overall_count: number;
}

export function DonationsView({ userRole, onNavigate }: DonationsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'gift' | 'needs' | 'volunteer' | 'items' | 'my-donations'>('gift');
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [loadingMyDonations, setLoadingMyDonations] = useState(false);
  const [managementView, setManagementView] = useState(false);
  const [adminManagementView, setAdminManagementView] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  
  // States for the Modal
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isChangingPayment, setIsChangingPayment] = useState(false);
  
  // Dynamic State for the Recurring Gift
  const [recurringAmount, setRecurringAmount] = useState("₱500");
  const [tempAmount, setTempAmount] = useState("");
  
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedFreq, setSelectedFreq] = useState<string | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(null);
  
  // Default and selectable payment state
  const [selectedPayment, setSelectedPayment] = useState<string>("Credit Card");

  // Campaigns State - Fetch from API
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Donation to Campaign States
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationFirstName, setDonationFirstName] = useState('');
  const [donationLastName, setDonationLastName] = useState('');
  const [donationEmail, setDonationEmail] = useState('');
  const [donationPaymentMethod, setDonationPaymentMethod] = useState('Credit Card');
  const [donationReferenceNumber, setDonationReferenceNumber] = useState('');
  const [donationReceiptFile, setDonationReceiptFile] = useState<File | null>(null);
  const [isDonating, setIsDonating] = useState(false);

  // Volunteer Events State
  const [volunteerEvents, setVolunteerEvents] = useState<VolunteerEvent[]>([]);
  const [loadingVolunteerEvents, setLoadingVolunteerEvents] = useState(false);
  const [myVolunteerRegistrations, setMyVolunteerRegistrations] = useState<VolunteerRegistration[]>([]);
  const [volunteerRegistrationsByEvent, setVolunteerRegistrationsByEvent] = useState<Record<number, VolunteerRegistration[]>>({});
  const [expandedVolunteerEventId, setExpandedVolunteerEventId] = useState<number | null>(null);

  const [isCreatingVolunteerEvent, setIsCreatingVolunteerEvent] = useState(false);
  const [editingVolunteerEventId, setEditingVolunteerEventId] = useState<number | null>(null);
  const [volunteerEventForm, setVolunteerEventForm] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    registration_deadline: '',
    volunteer_slots: '',
  });

  const [showVolunteerRegModal, setShowVolunteerRegModal] = useState(false);
  const [selectedVolunteerEvent, setSelectedVolunteerEvent] = useState<VolunteerEvent | null>(null);
  const [volunteerRegForm, setVolunteerRegForm] = useState({ full_name: '', email: '', phone: '', notes: '' });
  const [isSubmittingVolunteerReg, setIsSubmittingVolunteerReg] = useState(false);

  // Item (In-Kind) Donations State
  const [itemDonations, setItemDonations] = useState<ItemDonation[]>([]);
  const [loadingItemDonations, setLoadingItemDonations] = useState(false);
  const [donationPhone, setDonationPhone] = useState('');
  const [itemDonationForm, setItemDonationForm] = useState({
    item_name: '',
    category: 'Books',
    description: '',
    quantity: '1',
    condition: 'good',
    delivery_method: 'drop_off',
    pickup_address: '',
  });
  const [itemDonationPhoto, setItemDonationPhoto] = useState<File | null>(null);
  const [itemDonationPhotoPreview, setItemDonationPhotoPreview] = useState<string | null>(null);
  const [isSubmittingItemDonation, setIsSubmittingItemDonation] = useState(false);

  const resetItemDonationForm = () => {
    setItemDonationForm({
      item_name: '',
      category: 'Books',
      description: '',
      quantity: '1',
      condition: 'good',
      delivery_method: 'drop_off',
      pickup_address: '',
    });
    setItemDonationPhoto(null);
    setItemDonationPhotoPreview(null);
  };

  const handleItemDonationPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setItemDonationPhoto(file);
    setItemDonationPhotoPreview(URL.createObjectURL(file));
  };

  const resetVolunteerEventForm = () => {
    setVolunteerEventForm({ title: '', description: '', location: '', event_date: '', registration_deadline: '', volunteer_slots: '' });
  };

  const hydrateDonorIdentity = () => {
    const storedEmail = (localStorage.getItem('userEmail') || '').trim();
    const storedName = (localStorage.getItem('userName') || '').trim();

    const parts = storedName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';

    setDonationFirstName(firstName);
    setDonationLastName(lastName);
    setDonationEmail(storedEmail);

    return {
      firstName,
      lastName,
      email: storedEmail,
    };
  };

  const ensureDonorIdentity = () => {
    const identity = hydrateDonorIdentity();

    if (!identity.firstName || !identity.email) {
      setNotice({ type: 'error', text: 'Missing account information. Please sign out and sign in again before donating.' });
      return false;
    }

    return true;
  };

  // Dashboard States
  const [dashboardView, setDashboardView] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Image upload states
  const [newCampaignImage, setNewCampaignImage] = useState<File | null>(null);
  const [newCampaignImagePreview, setNewCampaignImagePreview] = useState<string | null>(null);
  const [editCampaignImage, setEditCampaignImage] = useState<File | null>(null);
  const [editCampaignImagePreview, setEditCampaignImagePreview] = useState<string | null>(null);

  // Form States for New Campaign
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    category: 'Student Aid',
    imageUrl: '',
    goalAmount: '',
    endDate: ''
  });

  const [editCampaignData, setEditCampaignData] = useState({
    title: '',
    description: '',
    category: 'Student Aid',
    imageUrl: '',
    goalAmount: '',
    endDate: ''
  });

  const fetchMyDonations = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    setLoadingMyDonations(true);
    try {
      const response = await fetch(`http://localhost:8000/api/donations/email/${encodeURIComponent(email)}`);
      if (response.ok) {
        setMyDonations(await response.json());
      }
    } catch (error) {
      console.error('Error fetching my donations:', error);
    } finally {
      setLoadingMyDonations(false);
    }
  };

  // Fetch campaigns from API
  useEffect(() => {
    fetchCampaigns();
    if (dashboardView && userRole === 'admin') {
      fetchAnalytics();
    }
    hydrateDonorIdentity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, dashboardView]);

  useEffect(() => {
    if (activeTab === 'my-donations' && userRole !== 'admin') {
      fetchMyDonations();
    }
    if (activeTab === 'volunteer') {
      fetchVolunteerEvents();
      if (userRole !== 'admin') {
        fetchMyVolunteerRegistrations();
      }
    }
    if (activeTab === 'items') {
      fetchItemDonations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchItemDonations = async () => {
    setLoadingItemDonations(true);
    try {
      const email = localStorage.getItem('userEmail') || '';
      const query = userRole === 'admin' ? '?role=admin' : `?email=${encodeURIComponent(email)}`;
      const response = await fetch(`http://localhost:8000/api/item-donations${query}`);
      if (response.ok) {
        setItemDonations(await response.json());
      }
    } catch (error) {
      console.error('Error fetching item donations:', error);
    } finally {
      setLoadingItemDonations(false);
    }
  };

  const handleSubmitItemDonation = async () => {
    if (!ensureDonorIdentity()) return;
    if (!itemDonationForm.item_name || !itemDonationForm.quantity) {
      setNotice({ type: 'error', text: 'Please fill in the item name and quantity.' });
      return;
    }
    if (itemDonationForm.delivery_method === 'pickup_request' && !itemDonationForm.pickup_address) {
      setNotice({ type: 'error', text: 'Please provide a pickup address, or choose to drop the item off instead.' });
      return;
    }

    setIsSubmittingItemDonation(true);
    try {
      const formData = new FormData();
      formData.append('donor_first_name', donationFirstName);
      formData.append('donor_last_name', donationLastName);
      formData.append('donor_email', donationEmail);
      if (donationPhone) formData.append('donor_phone', donationPhone);
      formData.append('item_name', itemDonationForm.item_name);
      formData.append('category', itemDonationForm.category);
      if (itemDonationForm.description) formData.append('description', itemDonationForm.description);
      formData.append('quantity', itemDonationForm.quantity);
      formData.append('condition', itemDonationForm.condition);
      formData.append('delivery_method', itemDonationForm.delivery_method);
      if (itemDonationForm.delivery_method === 'pickup_request') {
        formData.append('pickup_address', itemDonationForm.pickup_address);
      }
      if (itemDonationPhoto) formData.append('photo', itemDonationPhoto);

      const response = await fetch('http://localhost:8000/api/item-donations', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setNotice({ type: 'success', text: 'Thank you! Your item donation has been submitted for review.' });
        resetItemDonationForm();
        fetchItemDonations();
      } else {
        const errorData = await response.json();
        setNotice({ type: 'error', text: `Failed to submit item donation: ${errorData.message || 'Unknown error'}` });
      }
    } catch (error) {
      setNotice({ type: 'error', text: `Error submitting item donation: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsSubmittingItemDonation(false);
    }
  };

  const handleUpdateItemDonationStatus = async (id: number, status: 'received' | 'rejected') => {
    try {
      const response = await fetch(`http://localhost:8000/api/item-donations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setNotice({ type: 'success', text: `Item donation marked as ${status}.` });
        fetchItemDonations();
      } else {
        setNotice({ type: 'error', text: 'Failed to update item donation status.' });
      }
    } catch (error) {
      setNotice({ type: 'error', text: `Error updating status: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const fetchVolunteerEvents = async () => {
    setLoadingVolunteerEvents(true);
    try {
      const roleParam = userRole === 'admin' ? '?role=admin' : '';
      const response = await fetch(`http://localhost:8000/api/volunteer/events${roleParam}`);
      if (response.ok) {
        setVolunteerEvents(await response.json());
      }
    } catch (error) {
      console.error('Error fetching volunteer events:', error);
    } finally {
      setLoadingVolunteerEvents(false);
    }
  };

  const fetchMyVolunteerRegistrations = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    try {
      const response = await fetch(`http://localhost:8000/api/volunteer/registrations?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        setMyVolunteerRegistrations(await response.json());
      }
    } catch (error) {
      console.error('Error fetching my volunteer registrations:', error);
    }
  };

  const fetchVolunteerEventRegistrants = async (eventId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/volunteer/registrations?volunteer_event_id=${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setVolunteerRegistrationsByEvent((prev) => ({ ...prev, [eventId]: data }));
      }
    } catch (error) {
      console.error('Error fetching event registrants:', error);
    }
  };

  const toggleVolunteerRegistrants = (eventId: number) => {
    if (expandedVolunteerEventId === eventId) {
      setExpandedVolunteerEventId(null);
      return;
    }
    setExpandedVolunteerEventId(eventId);
    if (!volunteerRegistrationsByEvent[eventId]) {
      fetchVolunteerEventRegistrants(eventId);
    }
  };

  const startEditVolunteerEvent = (event: VolunteerEvent) => {
    setEditingVolunteerEventId(event.id);
    setIsCreatingVolunteerEvent(false);
    setVolunteerEventForm({
      title: event.title,
      description: event.description,
      location: event.location || '',
      event_date: event.event_date ? event.event_date.slice(0, 16) : '',
      registration_deadline: event.registration_deadline.slice(0, 16),
      volunteer_slots: event.volunteer_slots ? String(event.volunteer_slots) : '',
    });
  };

  const handleSaveVolunteerEvent = async () => {
    if (!volunteerEventForm.title || !volunteerEventForm.description || !volunteerEventForm.registration_deadline) {
      setNotice({ type: 'error', text: 'Please fill in the title, description, and registration deadline.' });
      return;
    }

    const payload = {
      title: volunteerEventForm.title,
      description: volunteerEventForm.description,
      location: volunteerEventForm.location || null,
      event_date: volunteerEventForm.event_date || null,
      registration_deadline: volunteerEventForm.registration_deadline,
      volunteer_slots: volunteerEventForm.volunteer_slots ? Number(volunteerEventForm.volunteer_slots) : null,
    };

    try {
      const isEditing = editingVolunteerEventId !== null;
      const url = isEditing
        ? `http://localhost:8000/api/volunteer/events/${editingVolunteerEventId}`
        : `http://localhost:8000/api/volunteer/events`;
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNotice({ type: 'success', text: isEditing ? 'Community engagement event updated.' : 'Community engagement event created.' });
        setIsCreatingVolunteerEvent(false);
        setEditingVolunteerEventId(null);
        resetVolunteerEventForm();
        fetchVolunteerEvents();
      } else {
        const errorData = await response.json();
        setNotice({ type: 'error', text: `Failed to save event: ${errorData.message || 'Unknown error'}` });
      }
    } catch (error) {
      setNotice({ type: 'error', text: `Error saving event: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleDeleteVolunteerEvent = async (eventId: number) => {
    if (!window.confirm('Delete this community engagement event? All registrations for it will be removed.')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/volunteer/events/${eventId}`, { method: 'DELETE' });
      if (response.ok) {
        setNotice({ type: 'success', text: 'Community engagement event deleted.' });
        fetchVolunteerEvents();
      } else {
        setNotice({ type: 'error', text: 'Failed to delete community engagement event.' });
      }
    } catch (error) {
      setNotice({ type: 'error', text: `Error deleting event: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const openVolunteerRegModal = (event: VolunteerEvent) => {
    const storedEmail = (localStorage.getItem('userEmail') || '').trim();
    const storedName = (localStorage.getItem('userName') || '').trim();
    setVolunteerRegForm({ full_name: storedName, email: storedEmail, phone: '', notes: '' });
    setSelectedVolunteerEvent(event);
    setShowVolunteerRegModal(true);
  };

  const handleSubmitVolunteerRegistration = async () => {
    if (!selectedVolunteerEvent) return;
    if (!volunteerRegForm.full_name || !volunteerRegForm.email) {
      setNotice({ type: 'error', text: 'Missing account information. Please sign out and sign in again before registering.' });
      return;
    }

    setIsSubmittingVolunteerReg(true);
    try {
      const response = await fetch('http://localhost:8000/api/volunteer/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volunteer_event_id: selectedVolunteerEvent.id,
          full_name: volunteerRegForm.full_name,
          email: volunteerRegForm.email,
          phone: volunteerRegForm.phone || null,
          notes: volunteerRegForm.notes || null,
        }),
      });

      if (response.ok) {
        setNotice({ type: 'success', text: 'You have successfully registered for this community engagement event!' });
        setShowVolunteerRegModal(false);
        setSelectedVolunteerEvent(null);
        fetchVolunteerEvents();
        fetchMyVolunteerRegistrations();
      } else {
        const errorData = await response.json();
        setNotice({ type: 'error', text: errorData.message || 'Failed to register for this event.' });
      }
    } catch (error) {
      setNotice({ type: 'error', text: `Error registering: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsSubmittingVolunteerReg(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      // Admins see all campaigns, users only see active ones
      const roleParam = userRole === 'admin' ? '?role=admin' : '';
      const response = await fetch(`http://localhost:8000/api/campaigns${roleParam}`);
      if (response.ok) {
        const data = await response.json();
        const formattedCampaigns = data.map((campaign: any) => ({
          id: campaign.id,
          title: campaign.title,
          goal: `₱${Number(campaign.goal_amount).toLocaleString()}`,
          raised: `₱${Number(campaign.raised_amount || 0).toLocaleString()}`,
          backers: campaign.donors_count || 0,
          status: campaign.is_active ? 'Active' : 'Inactive',
          is_active: campaign.is_active,
          ...campaign // Include all original fields
        }));
        setCampaigns(formattedCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const response = await fetch('http://localhost:8000/api/donations/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const activeGifts = [
    { id: 1, amount: recurringAmount, freq: "Monthly", designation: "Student Financial Aid", nextDate: "March 15, 2026" }
  ];

  const handleToggle = (current: string | null, clicked: string, setter: (val: string | null) => void) => {
    setter(current === clicked ? null : clicked);
  };

  const confirmNewAmount = () => {
    if (tempAmount) {
      setRecurringAmount(`₱${tempAmount}`);
    } else if (selectedAmount) {
      setRecurringAmount(selectedAmount);
    }
    setIsEditingAmount(false);
    setTempAmount("");
    setSelectedAmount(null);
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.title || !newCampaign.goalAmount || !newCampaign.endDate) {
      alert("Please fill in all required fields (Title, Goal Amount, and End Date).");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newCampaign.title);
      formData.append('description', newCampaign.description || 'No description provided');
      formData.append('category', newCampaign.category);
      formData.append('goal_amount', newCampaign.goalAmount);
      formData.append('end_date', newCampaign.endDate);
      if (newCampaignImage) {
        formData.append('image', newCampaignImage);
      }

      const response = await fetch('http://localhost:8000/api/campaigns', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        await response.json();
        fetchCampaigns(); // Refresh the campaigns list
        setIsCreatingCampaign(false);
        setNewCampaign({
          title: '',
          description: '',
          category: 'Student Aid',
          imageUrl: '',
          goalAmount: '',
          endDate: ''
        });
        setNewCampaignImage(null);
        setNewCampaignImagePreview(null);
        alert("Campaign created successfully!");
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Server error:', errorData);
          alert(`Failed to create campaign: ${errorData.message || 'Unknown error'}`);
        } else {
          const errorText = await response.text();
          console.error('Server error (non-JSON):', errorText);
          alert('Failed to create campaign. Please check the console for details.');
        }
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert(`Error creating campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditCampaign = async () => {
    if (!editCampaignData.title || !editCampaignData.goalAmount) {
      alert("Please fill in the required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', editCampaignData.title);
      formData.append('description', editCampaignData.description || 'No description provided');
      formData.append('category', editCampaignData.category);
      formData.append('goal_amount', editCampaignData.goalAmount);
      formData.append('end_date', editCampaignData.endDate || new Date().toISOString().split('T')[0]);
      formData.append('_method', 'PUT');
      if (editCampaignImage) {
        formData.append('image', editCampaignImage);
      }

      const response = await fetch(`http://localhost:8000/api/campaigns/${editingCampaignId}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchCampaigns(); // Refresh the campaigns list
        setIsEditingCampaign(false);
        setEditingCampaignId(null);
        setEditCampaignData({
          title: '',
          description: '',
          category: 'Student Aid',
          imageUrl: '',
          goalAmount: '',
          endDate: ''
        });
        setEditCampaignImage(null);
        setEditCampaignImagePreview(null);
        alert("Campaign updated successfully!");
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Server error:', errorData);
          alert(`Failed to update campaign: ${errorData.message || 'Unknown error'}`);
        } else {
          const errorText = await response.text();
          console.error('Server error (non-JSON):', errorText);
          alert('Failed to update campaign. Please check the console for details.');
        }
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert(`Error updating campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/campaigns/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCampaigns(); // Refresh the campaigns list
        alert("Campaign deleted successfully!");
      } else {
        alert("Failed to delete campaign");
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert("Error deleting campaign");
    }
  };

  const handleToggleCampaignVisibility = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:8000/api/campaigns/${id}/toggle-active`, {
        method: 'PATCH'
      });

      if (response.ok) {
        fetchCampaigns(); // Refresh the campaigns list
        alert(currentStatus ? "Campaign hidden successfully!" : "Campaign shown successfully!");
      } else {
        alert("Failed to update campaign visibility");
      }
    } catch (error) {
      console.error('Error toggling campaign visibility:', error);
      alert("Error updating campaign visibility");
    }
  };

  const openEditCampaign = (campaign: Campaign) => {
    setEditingCampaignId(campaign.id);
    setEditCampaignData({
      title: campaign.title,
      description: '',
      category: 'Student Aid',
      imageUrl: '',
      goalAmount: campaign.goal.replace(/\D/g, ''),
      endDate: ''
    });
    setIsEditingCampaign(true);
  };

  const openDonationModal = (campaign: Campaign) => {
    hydrateDonorIdentity();
    setSelectedCampaignForDonation(campaign);
    setShowDonationModal(true);
  };

  const handleDonateToCampaign = async () => {
    if (!donationAmount) {
      setNotice({ type: 'error', text: 'Please enter a donation amount.' });
      return;
    }

    if (!ensureDonorIdentity()) {
      return;
    }

    if (!selectedCampaignForDonation) {
      setNotice({ type: 'error', text: 'No campaign selected.' });
      return;
    }

    if (!donationReferenceNumber.trim()) {
      setNotice({ type: 'error', text: 'Please enter a reference number.' });
      return;
    }

    if (!donationReceiptFile) {
      setNotice({ type: 'error', text: 'Please upload a receipt before donating to a campaign.' });
      return;
    }

    setIsDonating(true);
    try {
      const formData = new FormData();
      formData.append('amount', donationAmount);
      formData.append('first_name', donationFirstName);
      formData.append('last_name', donationLastName);
      formData.append('email', donationEmail);
      formData.append('payment_method', donationPaymentMethod);
      formData.append('reference_number', donationReferenceNumber.trim());
      formData.append('proof_of_payment', donationReceiptFile);

      const response = await fetch(`http://localhost:8000/api/campaigns/${selectedCampaignForDonation.id}/donate`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setNotice({ type: 'success', text: 'Thank you for your donation! Please wait for the admin to approve your payment.' });
        setShowDonationModal(false);
        setDonationAmount('');
        setDonationPaymentMethod('Credit Card');
        setDonationReferenceNumber('');
        setDonationReceiptFile(null);
        setSelectedCampaignForDonation(null);
        fetchCampaigns(); // Refresh campaigns to update amounts
      } else {
        const errorData = await response.json();
        setNotice({ type: 'error', text: `Failed to process donation: ${errorData.message || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      setNotice({ type: 'error', text: `Error processing donation: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsDonating(false);
    }
  };

  // Image upload handlers
  const handleNewCampaignImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setNewCampaignImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCampaignImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCampaignImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setEditCampaignImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditCampaignImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDonation = async () => {
    if (!donationAmount) {
      setNotice({ type: 'error', text: 'Please enter a donation amount.' });
      return;
    }

    if (!ensureDonorIdentity()) {
      return;
    }

    if (!selectedPayment) {
      setNotice({ type: 'error', text: 'Please select a payment method.' });
      return;
    }

    if (!donationReferenceNumber.trim()) {
      setNotice({ type: 'error', text: 'Please enter a reference number.' });
      return;
    }

    if (!donationReceiptFile) {
      setNotice({ type: 'error', text: 'Please upload a receipt before completing your donation.' });
      return;
    }

    setIsDonating(true);
    try {
      const formData = new FormData();
      formData.append('amount', donationAmount);
      formData.append('first_name', donationFirstName);
      formData.append('last_name', donationLastName);
      formData.append('email', donationEmail);
      formData.append('payment_method', selectedPayment);
      formData.append('reference_number', donationReferenceNumber.trim());
      formData.append('proof_of_payment', donationReceiptFile);

      const response = await fetch(`http://localhost:8000/api/donations`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setNotice({ type: 'success', text: 'Thank you for your donation! Please wait for the admin to approve your payment.' });
        setShowForm(false);
        setDonationAmount('');
        setSelectedAmount(null);
        setSelectedPayment('Credit Card');
        setDonationReferenceNumber('');
        setDonationReceiptFile(null);
      } else {
        const errorData = await response.json();
        setNotice({ type: 'error', text: `Failed to process donation: ${errorData.message || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      setNotice({ type: 'error', text: `Error processing donation: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsDonating(false);
    }
  };

  // Dashboard View for Admin
  if (dashboardView && userRole === 'admin') {
    const topDonors = analyticsData?.all_donations
      .reduce((acc: { email: string; name: string; total: number; count: number }[], donation) => {
        const existing = acc.find(d => d.email === donation.email);
        if (existing) {
          existing.total += Number(donation.amount);
          existing.count += 1;
        } else {
          acc.push({
            email: donation.email,
            name: `${donation.first_name} ${donation.last_name}`,
            total: Number(donation.amount),
            count: 1
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.total - a.total)
      .slice(0, 10) || [];

    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <button 
                onClick={() => setDashboardView(false)} 
                className="flex items-center gap-2 text-gray-500 font-bold mb-4 hover:text-[#003087] transition-all"
              >
                <ChevronLeft className="w-5 h-5" /> Back to Donations
              </button>
              
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Donation Analytics Dashboard</h1>
                  <p className="text-gray-600">Comprehensive overview of donations and top contributors</p>
                </div>
              </div>
            </div>

            {loadingAnalytics ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-semibold">Loading analytics...</p>
              </div>
            ) : analyticsData ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-[#003087]" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Raised</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₱{analyticsData.overall_total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-2">{analyticsData.overall_count} donations</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-50 rounded-xl">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Unique Donors</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{topDonors.length}</p>
                    <p className="text-sm text-gray-500 mt-2">Active contributors</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-orange-50 rounded-xl">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Campaigns</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.campaign_donations.length}</p>
                    <p className="text-sm text-gray-500 mt-2">Fundraising initiatives</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-[#003087]" />
                      <h2 className="text-2xl font-bold text-gray-900">Top 10 Donors</h2>
                    </div>
                    <p className="text-gray-600 mt-1">Our most generous contributors</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {topDonors.map((donor, index) => (
                        <div key={donor.email} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-[#003087]'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{donor.name}</h3>
                            <p className="text-sm text-gray-500">{donor.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-[#003087]">₱{donor.total.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{donor.count} donation{donor.count > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-[#003087]" />
                      <h2 className="text-2xl font-bold text-gray-900">Campaign-wise Donations</h2>
                    </div>
                    <p className="text-gray-600 mt-1">Detailed breakdown by campaign</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {analyticsData.campaign_donations.map((campaignData) => (
                        <div key={campaignData.campaign.id} className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{campaignData.campaign.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{campaignData.campaign.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">₱{campaignData.total.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">{campaignData.count} donation{campaignData.count > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-700 mb-3">Donors:</h4>
                            <div className="space-y-2">
                              {campaignData.donations.slice(0, 5).map((donation) => (
                                <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900">{donation.first_name} {donation.last_name}</p>
                                    <p className="text-xs text-gray-500">{donation.email}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-[#003087]">₱{Number(donation.amount).toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              ))}
                              {campaignData.donations.length > 5 && (
                                <p className="text-sm text-gray-500 text-center py-2">
                                  + {campaignData.donations.length - 5} more donor{campaignData.donations.length - 5 > 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {analyticsData.general_donations.count > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <Gift className="w-6 h-6 text-[#003087]" />
                        <h2 className="text-2xl font-bold text-gray-900">General Donations</h2>
                      </div>
                      <p className="text-gray-600 mt-1">Donations not tied to specific campaigns</p>
                    </div>
                    <div className="p-6">
                      <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Total from General Donations:</span>
                          <span className="text-2xl font-bold text-[#003087]">₱{analyticsData.general_donations.total.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{analyticsData.general_donations.count} donation{analyticsData.general_donations.count > 1 ? 's' : ''}</p>
                      </div>
                      <div className="space-y-2">
                        {analyticsData.general_donations.donations.slice(0, 10).map((donation) => (
                          <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{donation.first_name} {donation.last_name}</p>
                              <p className="text-xs text-gray-500">{donation.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#003087]">₱{Number(donation.amount).toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500 font-semibold">No analytics data available</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showForm) {
    // Prevent non-admins from accessing admin management view
    if (userRole !== 'admin' && adminManagementView) {
      setAdminManagementView(false);
    }

    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => {
                if (isCreatingCampaign) setIsCreatingCampaign(false);
                else if (isEditingCampaign) setIsEditingCampaign(false);
                else if (adminManagementView) setAdminManagementView(false);
                else if (managementView) setManagementView(false);
                else {
                  setShowForm(false);
                  // If admin and in form, return to homepage
                  if (userRole === 'admin' && onNavigate) {
                    onNavigate('home');
                  }
                }
              }} 
              className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> 
              {isCreatingCampaign ? "Back to Campaign List" : isEditingCampaign ? "Back to Campaign List" : adminManagementView ? "Back to Donation Form" : managementView ? "Back to Donation Form" : "Back to Information"}
            </button>
            
            <div className="bg-white rounded-[40px] shadow-xl p-12 text-left space-y-12 border border-gray-100 relative">
              
              {/* UPDATE AMOUNT IN-SECTION MODAL */}
              {isEditingAmount && (
                <div className="absolute inset-0 z-50 bg-white rounded-[40px] p-12 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">Update Gift Amount</h3>
                    <button onClick={() => setIsEditingAmount(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {['₱500', '₱1,000', '₱2,000', '₱5,000'].map((amt) => (
                        <button 
                          key={amt} 
                          onClick={() => {
                            setSelectedAmount(amt);
                            setTempAmount("");
                          }} 
                          className={`py-4 rounded-2xl font-bold border-2 transition-all ${selectedAmount === amt ? 'bg-[#003087] border-[#003087] text-white' : 'border-gray-100'}`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Custom Amount" 
                      value={tempAmount}
                      onChange={(e) => {
                        setTempAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" 
                    />
                    <button 
                      onClick={confirmNewAmount} 
                      className="w-full py-4 bg-[#003087] text-white rounded-xl font-bold"
                    >
                      Confirm New Amount
                    </button>
                  </div>
                </div>
              )}

              {/* CHANGE PAYMENT IN-SECTION MODAL */}
              {isChangingPayment && (
                <div className="absolute inset-0 z-50 bg-white rounded-[40px] p-12 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">Change Payment Method</h3>
                    <button onClick={() => setIsChangingPayment(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
                  </div>
                  <div className="space-y-6">
                    {['Credit Card', 'GCash', 'Bank Transfer'].map(m => (
                      <button key={m} onClick={() => setSelectedPayment(m)} className={`w-full p-6 border-2 rounded-2xl flex justify-between items-center font-bold transition-all ${selectedPayment === m ? 'border-[#003087] bg-blue-50' : 'border-gray-100'}`}>
                        {m}
                        {selectedPayment === m && <CheckCircle2 className="text-[#003087]" />}
                      </button>
                    ))}
                    <button onClick={() => setIsChangingPayment(false)} className="w-full py-4 bg-[#003087] text-white rounded-xl font-bold">Save Payment Method</button>
                  </div>
                </div>
              )}

              {isCreatingCampaign ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Create New Campaign</h1>
                    <p className="text-gray-500">Fill in the details to launch a new fundraising initiative.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Campaign Title *</label>
                        <input 
                          type="text" 
                          value={newCampaign.title}
                          onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                          placeholder="e.g., Scholar Excellence Fund 2026" 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Description *</label>
                        <textarea 
                          value={newCampaign.description}
                          onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                          placeholder="Tell the story of this campaign..." 
                          rows={4} 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all resize-none" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Category</label>
                          <select 
                            value={newCampaign.category}
                            onChange={(e) => setNewCampaign({...newCampaign, category: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                          >
                            <option>Student Aid</option>
                            <option>Infrastructure</option>
                            <option>Research</option>
                            <option>Faculty</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Image URL (Optional)</label>
                          <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              type="text" 
                              value={newCampaign.imageUrl}
                              onChange={(e) => setNewCampaign({...newCampaign, imageUrl: e.target.value})}
                              placeholder="https://..." 
                              className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Upload Campaign Image</label>
                        {newCampaignImagePreview ? (
                          <div className="relative border-2 border-gray-200 rounded-2xl p-4">
                            <img src={newCampaignImagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                            <button 
                              onClick={() => {
                                setNewCampaignImage(null);
                                setNewCampaignImagePreview(null);
                              }}
                              className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-all">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleNewCampaignImageChange}
                              className="hidden" 
                            />
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="text-sm font-bold text-gray-500">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 2MB)</p>
                          </label>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Goal Amount (₱) *</label>
                          <input 
                            type="number" 
                            value={newCampaign.goalAmount}
                            onChange={(e) => setNewCampaign({...newCampaign, goalAmount: e.target.value})}
                            placeholder="0.00" 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">End Date *</label>
                          <input 
                            type="date" 
                            value={newCampaign.endDate}
                            onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                      <button onClick={() => setIsCreatingCampaign(false)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                      <button onClick={handleCreateCampaign} className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all">Create Campaign</button>
                    </div>
                  </div>
                </div>
              ) : isEditingCampaign ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Edit Campaign</h1>
                    <p className="text-gray-500">Update the details of your fundraising campaign.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Campaign Title *</label>
                        <input 
                          type="text" 
                          value={editCampaignData.title}
                          onChange={(e) => setEditCampaignData({...editCampaignData, title: e.target.value})}
                          placeholder="e.g., Scholar Excellence Fund 2026" 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Description *</label>
                        <textarea 
                          value={editCampaignData.description}
                          onChange={(e) => setEditCampaignData({...editCampaignData, description: e.target.value})}
                          placeholder="Tell the story of this campaign..." 
                          rows={4} 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all resize-none" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Category</label>
                          <select 
                            value={editCampaignData.category}
                            onChange={(e) => setEditCampaignData({...editCampaignData, category: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                          >
                            <option>Student Aid</option>
                            <option>Infrastructure</option>
                            <option>Research</option>
                            <option>Faculty</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Image URL (Optional)</label>
                          <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              type="text" 
                              value={editCampaignData.imageUrl}
                              onChange={(e) => setEditCampaignData({...editCampaignData, imageUrl: e.target.value})}
                              placeholder="https://..." 
                              className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Upload Campaign Image</label>
                        {editCampaignImagePreview ? (
                          <div className="relative border-2 border-gray-200 rounded-2xl p-4">
                            <img src={editCampaignImagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                            <button 
                              onClick={() => {
                                setEditCampaignImage(null);
                                setEditCampaignImagePreview(null);
                              }}
                              className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-all">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleEditCampaignImageChange}
                              className="hidden" 
                            />
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="text-sm font-bold text-gray-500">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 2MB)</p>
                          </label>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Goal Amount (₱) *</label>
                          <input 
                            type="number" 
                            value={editCampaignData.goalAmount}
                            onChange={(e) => setEditCampaignData({...editCampaignData, goalAmount: e.target.value})}
                            placeholder="0.00" 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">End Date *</label>
                          <input 
                            type="date" 
                            value={editCampaignData.endDate}
                            onChange={(e) => setEditCampaignData({...editCampaignData, endDate: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                      <button onClick={() => setIsEditingCampaign(false)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                      <button onClick={handleEditCampaign} className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all">Update Campaign</button>
                    </div>
                  </div>
                </div>
              ) : adminManagementView ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-8">
                    <div className="space-y-2">
                      <h1 className="text-4xl font-bold text-gray-900">Manage Campaigns</h1>
                      <p className="text-gray-500">Create and monitor fundraising initiatives.</p>
                    </div>
                    <button 
                      onClick={() => setIsCreatingCampaign(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-800 transition-all"
                    >
                      <Plus className="w-4 h-4" /> New Campaign
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 font-semibold">Loading campaigns...</p>
                      </div>
                    ) : campaigns.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 font-semibold">No campaigns created yet</p>
                      </div>
                    ) : (
                      campaigns.map((campaign) => (
                        <div key={campaign.id} className="p-6 border border-gray-200 rounded-3xl space-y-4 hover:border-blue-300 transition-all group">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xl font-bold text-gray-900">{campaign.title}</h4>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${campaign.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {campaign.is_active ? 'Active' : 'Hidden'}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 font-medium">Progress</span>
                              <span className="font-bold text-[#003087]">{campaign.raised} / {campaign.goal}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#003087] rounded-full transition-all duration-1000" 
                                style={{ width: `${(parseInt(campaign.raised.replace(/\D/g,'')) || 0) / (parseInt(campaign.goal.replace(/\D/g,'')) || 1) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                              <span>{campaign.backers} Backers</span>
                              <span>Ends in 14 days</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => openEditCampaign(campaign)}
                                className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#003087] transition-all"
                                title="Edit campaign"
                              >
                                <Settings className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleToggleCampaignVisibility(campaign.id, campaign.is_active || false)}
                                className="p-2 hover:bg-yellow-50 rounded-lg text-gray-400 hover:text-yellow-600 transition-all"
                                title={campaign.is_active ? "Hide campaign" : "Show campaign"}
                              >
                                {campaign.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteCampaign(campaign.id)}
                                className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                                title="Delete campaign"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : managementView ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Manage Recurring Gifts</h1>
                    <p className="text-gray-500">Update your giving preferences or payment methods.</p>
                  </div>

                  <div className="space-y-4">
                    {activeGifts.map((gift) => (
                      <div key={gift.id} className="p-6 border border-blue-100 rounded-3xl bg-blue-50/30 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-[#003087] uppercase tracking-wider">{gift.freq} Gift</p>
                            <h4 className="text-2xl font-bold text-gray-900">{gift.amount}</h4>
                          </div>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500" /> Next Billing: {gift.nextDate}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Gift className="w-4 h-4 text-blue-500" /> Fund: {gift.designation}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button 
                            onClick={() => setIsEditingAmount(true)}
                            className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                          >
                            Update Amount
                          </button>
                          <button 
                            onClick={() => window.confirm("Are you sure you want to cancel this recurring gift?")}
                            className="px-4 py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                    <div className="flex items-center gap-4 text-gray-500">
                      <CreditCard className="w-6 h-6" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Default Payment Method</p>
                        <p className="text-xs">{selectedPayment === 'Credit Card' ? 'Visa ending in 4242' : selectedPayment}</p>
                      </div>
                      <button 
                        onClick={() => setIsChangingPayment(true)}
                        className="text-[#003087] text-xs font-bold underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Make Your Gift</h1>
                    <p className="text-gray-500">Thank you for supporting ADDU. Your generosity makes a lasting difference.</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900">Manage Your Giving</h4>
                      <p className="text-sm text-gray-500">Track and update your existing contributions</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => setManagementView(true)} className="px-6 py-2 bg-white border border-gray-300 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">Manage Gifts</button>
                      <button onClick={() => { if(window.confirm("Are you sure you want to cancel your recurring gift?")) { setSelectedFreq('One-Time'); } }} className="px-6 py-2 bg-white border border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all">Cancel</button>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">1</span>Select Your Gift Amount</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['50', '100', '200', '1000'].map((amt) => (
                          <button 
                            key={amt} 
                            onClick={() => {
                              setSelectedAmount(`₱${amt}`);
                              setDonationAmount(amt);
                            }} 
                            className={`py-4 rounded-2xl font-bold border-2 transition-all ${selectedAmount === `₱${amt}` ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'}`}
                          >
                            ₱{amt}
                          </button>
                        ))}
                      </div>
                      <input 
                        type="number" 
                        placeholder="Enter Amount" 
                        value={donationAmount}
                        onChange={(e) => {
                          setDonationAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" 
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">2</span>Choose Gift Frequency</h3>
                        {selectedFreq && selectedFreq !== 'One-Time' && (
                          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                            <Heart className="w-3 h-3 fill-current" /> Recurring Active
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {['One-Time', 'Monthly', 'Annual'].map((freq) => (
                          <button key={freq} onClick={() => handleToggle(selectedFreq, freq, setSelectedFreq)} className={`px-8 py-3 rounded-xl border-2 font-bold transition-all ${selectedFreq === freq ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{freq}</button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">3</span>Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Donor Name</p>
                          <p className="mt-1 font-bold text-gray-900">
                            {donationFirstName || donationLastName
                              ? `${donationFirstName} ${donationLastName}`.trim()
                              : 'Unavailable'}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl md:col-span-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Email Address</p>
                          <p className="mt-1 font-bold text-gray-900 break-all">{donationEmail || 'Unavailable'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Pulled from your logged-in account.</p>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">4</span>Payment Details</h3>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          {['Credit Card', 'GCash', 'Bank Transfer'].map(m => (
                            <button key={m} onClick={() => setSelectedPayment(m)} className={`px-6 py-3 border-2 rounded-xl text-sm font-bold transition-all ${selectedPayment === m ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{m}</button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={donationReferenceNumber}
                          onChange={(e) => setDonationReferenceNumber(e.target.value)}
                          placeholder="Reference Number / Transaction ID *"
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl"
                        />
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setDonationReceiptFile(e.target.files?.[0] || null)}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl"
                        />
                        <p className="text-xs text-gray-500">Upload your receipt or proof of transfer before submitting.</p>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100 space-y-6">
                      <button 
                        onClick={handleDonation}
                        disabled={isDonating}
                        className="w-full py-5 bg-[#003087] text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-[#002566] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDonating ? 'Processing...' : selectedFreq === 'One-Time' || !selectedFreq ? 'Complete My Gift' : `Start My ${selectedFreq} Gift`}
                      </button>
                      <div className="grid grid-cols-3 gap-4 text-[11px] text-gray-400 font-bold uppercase text-center">
                        <div className="flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> Secure</div>
                        <div>📧 Receipt via Email</div>
                        <div>💳 Tax-Deductible</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AcknowledgementModal
        open={notice !== null}
        type={notice?.type || 'success'}
        message={notice?.text || ''}
        onConfirm={() => setNotice(null)}
      />
      <main className="flex-1">
        {/* HERO */}
        <div
          className="relative text-white py-24 px-8 text-center bg-cover bg-center"
          style={{ backgroundImage: "url('https://www.addu.edu.ph/wp-content/uploads/2016/01/Library.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#001b4d]/75"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#003087]/85 via-[#003087]/45 to-[#0b264f]/80"></div>
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Supporting Excellence at ADDU</h1>
            <p className="text-xl text-blue-50 leading-relaxed max-w-3xl mx-auto">Your generosity empowers students, advances research, and strengthens our Jesuit mission of service and excellence.</p>
            <div className="pt-4 flex flex-col items-center gap-4">
              {userRole === "admin" ? (
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setShowForm(true);
                      setAdminManagementView(true);
                    }} 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-black/20"
                  >
                    <Settings className="w-4 h-4 inline mr-2" /> Manage Campaigns
                  </button>
                  <button 
                    onClick={() => setDashboardView(true)} 
                    className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-black/20"
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" /> View Dashboard
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-black/20">Make a Gift Today</button>
              )}
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="max-w-7xl mx-auto px-8 mt-16 border-b border-gray-200">
          <div className="flex gap-12">
            <button 
              onClick={() => setActiveTab('gift')}
              className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'gift' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Make a Gift
            </button>
            <button
              onClick={() => setActiveTab('needs')}
              className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'needs' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Areas of Greatest Need
            </button>
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'volunteer' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Community Engagement
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'items' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Donate Items
            </button>
            {userRole !== 'admin' && (
              <button
                onClick={() => setActiveTab('my-donations')}
                className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'my-donations' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                My Donations
              </button>
            )}
          </div>
        </div>

        {activeTab === 'gift' && (
          <>
            <div className="max-w-7xl mx-auto px-8 py-20">
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                {[["Active Donors", "4,250"], ["Alumni Participation", "35%"]].map(([label, val], i) => (
                  <div key={i} className="flex-1 max-w-sm space-y-2 border-2 border-blue-500 p-10 rounded-[32px] shadow-lg shadow-blue-100/50 hover:shadow-xl transition-all bg-white text-center">
                    <p className="text-5xl font-extrabold text-[#003087]">{val}</p>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </>
        )}

        {activeTab === 'needs' && (
          <>
            {/* ACTIVE CAMPAIGNS SECTION */}
            <div className="max-w-7xl mx-auto px-8 py-24">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Active Fundraising Campaigns</h2>
                  <p className="text-gray-500 text-lg">Support our ongoing initiatives and make a direct impact</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-semibold text-lg">Loading campaigns...</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-semibold text-lg">No active campaigns at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          {/* Left: Image */}
                          <div className="md:w-2/5 bg-gray-100">
                            {campaign.image_url ? (
                              <img 
                                src={`http://localhost:8000${campaign.image_url}`} 
                                alt={campaign.title}
                                className="w-full h-full object-cover min-h-[300px]" 
                              />
                            ) : (
                              <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                                <ImageIcon className="w-20 h-20 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Right: Content */}
                          <div className="md:w-3/5 p-8 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <span className="inline-block bg-blue-100 text-[#003087] text-xs font-bold px-3 py-1 rounded-full mb-3">
                                  {campaign.category || 'General'}
                                </span>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {campaign.description || 'State-of-the-art equipment for our engineering students to conduct cutting-edge research and hands-on learning.'}
                                </p>
                              </div>
                            </div>

                            {/* Progress Section */}
                            <div className="mt-6">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-600">Progress</span>
                                <span className="text-sm font-bold text-[#003087]">{campaign.progress_percentage?.toFixed(1) || 0}%</span>
                              </div>
                              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                                <div
                                  className="h-full bg-[#003087] rounded-full transition-all"
                                  style={{ width: `${Math.min(100, campaign.progress_percentage || 0)}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                              <div className="bg-blue-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Target className="w-4 h-4 text-[#003087]" />
                                  <span className="text-xs font-semibold text-gray-600">Goal</span>
                                </div>
                                <p className="text-lg font-bold text-[#003087]">{campaign.goal}</p>
                              </div>
                              
                              <div className="bg-green-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                  <span className="text-xs font-semibold text-gray-600">Raised</span>
                                </div>
                                <p className="text-lg font-bold text-green-600">{campaign.raised}</p>
                              </div>
                              
                              <div className="bg-orange-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Users className="w-4 h-4 text-orange-600" />
                                  <span className="text-xs font-semibold text-gray-600">Donors</span>
                                </div>
                                <p className="text-lg font-bold text-orange-600">{campaign.donors_count || campaign.backers || 0}</p>
                              </div>
                              
                              <div className="bg-red-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar className="w-4 h-4 text-red-600" />
                                  <span className="text-xs font-semibold text-gray-600">Days Left</span>
                                </div>
                                <p className="text-lg font-bold text-red-600">{campaign.days_left || 0}</p>
                              </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                              <p className="text-sm text-gray-600">
                                <span className="font-bold text-[#003087]">₱{(campaign.remaining_amount || 0).toLocaleString()}</span> remaining to reach goal
                              </p>
                              <button
                                onClick={() => openDonationModal(campaign)}
                                className="px-8 py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all shadow-lg"
                              >
                                Donate Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AREAS OF GREATEST NEED */}
            <div className="bg-gray-50/50 py-16">
              <div className="max-w-7xl mx-auto px-8 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-16">Areas of Greatest Need</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {[
                  { title: "Student Financial Aid", desc: "Ensure every deserving student can access education.", stats: ["₱12.5M annually", "450+ scholars"], icon: <GraduationCap /> },
                  { title: "Faculty Excellence", desc: "Attract and retain world-class educators.", stats: ["₱8M development", "180+ faculty"], icon: <Presentation /> },
                  { title: "Research & Innovation", desc: "Advance breakthrough research.", stats: ["₱6.2M grants", "45 projects"], icon: <Microscope /> },
                  { title: "Campus Infrastructure", desc: "Build state-of-the-art facilities.", stats: ["₱28M improvements", "5 facilities"], icon: <Building2 /> },
                  { title: "Academic Programs", desc: "Prepare students for tomorrow.", stats: ["₱4.8M support", "12 programs"], icon: <BookOpen /> },
                  { title: "Global Engagement", desc: "Expand international partnerships.", stats: ["₱3.5M exchanges", "85 experiences"], icon: <Globe /> }
                ].map((area, i) => (
                  <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 flex flex-col shadow-sm">
                    <div className="bg-blue-50 text-[#003087] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">{area.icon}</div>
                    <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                    <p className="text-gray-500 mb-8 flex-1 leading-relaxed">{area.desc}</p>
                    <div className="space-y-3 mb-10 pt-6 border-t border-gray-100">
                      {area.stats.map((s, si) => (
                        <div key={si} className="text-sm font-bold text-gray-700 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" />{s}</div>
                      ))}
                    </div>
                    <button onClick={() => setShowForm(true)} className="w-full py-4 rounded-xl border-2 border-[#003087] text-[#003087] font-bold text-sm hover:bg-[#003087] hover:text-white transition-all">Support This Area</button>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'volunteer' && (
          <div className="max-w-7xl mx-auto px-8 py-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Community Engagement Opportunities</h2>
                <p className="text-gray-500 text-lg">Give your time — sign up for an upcoming event before registration closes.</p>
              </div>
              {userRole === 'admin' && !isCreatingVolunteerEvent && editingVolunteerEventId === null && (
                <button
                  onClick={() => { resetVolunteerEventForm(); setIsCreatingVolunteerEvent(true); }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all shadow-lg shrink-0"
                >
                  <Plus className="w-5 h-5" /> Create Community Engagement Event
                </button>
              )}
            </div>

            {(isCreatingVolunteerEvent || editingVolunteerEventId !== null) && (
              <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-8 mb-12 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">{editingVolunteerEventId !== null ? 'Edit Community Engagement Event' : 'New Community Engagement Event'}</h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={volunteerEventForm.title}
                    onChange={(e) => setVolunteerEventForm({ ...volunteerEventForm, title: e.target.value })}
                    placeholder="e.g., Beach Cleanup Drive"
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description *</label>
                  <textarea
                    value={volunteerEventForm.description}
                    onChange={(e) => setVolunteerEventForm({ ...volunteerEventForm, description: e.target.value })}
                    rows={3}
                    placeholder="What will participants be doing?"
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Location</label>
                    <input
                      type="text"
                      value={volunteerEventForm.location}
                      onChange={(e) => setVolunteerEventForm({ ...volunteerEventForm, location: e.target.value })}
                      placeholder="e.g., Davao City Campus"
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Slots (optional)</label>
                    <input
                      type="number"
                      min={1}
                      value={volunteerEventForm.volunteer_slots}
                      onChange={(e) => setVolunteerEventForm({ ...volunteerEventForm, volunteer_slots: e.target.value })}
                      placeholder="Leave blank for unlimited"
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Event Date</label>
                    <input
                      type="datetime-local"
                      value={volunteerEventForm.event_date}
                      onChange={(e) => setVolunteerEventForm({ ...volunteerEventForm, event_date: e.target.value })}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Registration Deadline *</label>
                    <input
                      type="datetime-local"
                      value={volunteerEventForm.registration_deadline}
                      onChange={(e) => setVolunteerEventForm({ ...volunteerEventForm, registration_deadline: e.target.value })}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => { setIsCreatingVolunteerEvent(false); setEditingVolunteerEventId(null); resetVolunteerEventForm(); }}
                    className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-white transition-all"
                  >
                    Cancel
                  </button>
                  <button onClick={handleSaveVolunteerEvent} className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all">
                    {editingVolunteerEventId !== null ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </div>
            )}

            {loadingVolunteerEvents ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-semibold text-lg">Loading community engagement events...</p>
              </div>
            ) : volunteerEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-semibold text-lg">No community engagement events available right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {volunteerEvents.map((event) => {
                  const alreadyRegistered = myVolunteerRegistrations.some((r) => r.volunteer_event_id === event.id);
                  return (
                    <div key={event.id} className="bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-50 text-[#003087] w-14 h-14 rounded-2xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                        {!event.is_active && <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500">Inactive</span>}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>
                      <p className="text-gray-500 mb-6 flex-1 leading-relaxed text-sm">{event.description}</p>
                      <div className="space-y-2 mb-6 text-sm text-gray-600">
                        {event.location && (
                          <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /> {event.location}</div>
                        )}
                        {event.event_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(event.event_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                        )}
                        <div className={`flex items-center gap-2 font-semibold ${event.is_registration_open ? 'text-orange-600' : 'text-red-500'}`}>
                          <Calendar className="w-4 h-4" /> Register by {new Date(event.registration_deadline).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                        {event.volunteer_slots !== null && event.volunteer_slots !== undefined && (
                          <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> {event.slots_remaining} of {event.volunteer_slots} slots left</div>
                        )}
                      </div>

                      {userRole === 'admin' ? (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => toggleVolunteerRegistrants(event.id)}
                            className="w-full py-3 rounded-xl border-2 border-[#003087] text-[#003087] font-bold text-sm hover:bg-[#003087] hover:text-white transition-all"
                          >
                            {event.registrants_count} Registered {expandedVolunteerEventId === event.id ? '▲' : '▼'}
                          </button>
                          {expandedVolunteerEventId === event.id && (
                            <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-3">
                              {(volunteerRegistrationsByEvent[event.id] || []).length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-2">No registrants yet.</p>
                              ) : (
                                volunteerRegistrationsByEvent[event.id].map((r) => (
                                  <div key={r.id} className="text-xs bg-white rounded-lg p-2 border border-gray-100">
                                    <p className="font-bold text-gray-700">{r.full_name}</p>
                                    <p className="text-gray-500">{r.email}{r.phone ? ` · ${r.phone}` : ''}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button onClick={() => startEditVolunteerEvent(event)} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all">Edit</button>
                            <button onClick={() => handleDeleteVolunteerEvent(event.id)} className="flex-1 py-2 rounded-lg border border-red-200 text-red-500 font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-1">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      ) : alreadyRegistered ? (
                        <div className="w-full py-4 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm text-center flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Registered
                        </div>
                      ) : !event.is_registration_open ? (
                        <div className="w-full py-4 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm text-center">Registration Closed</div>
                      ) : (
                        <button onClick={() => openVolunteerRegModal(event)} className="w-full py-4 rounded-xl bg-[#003087] text-white font-bold text-sm hover:bg-[#002566] transition-all">
                          Register for Community Engagement
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div className="max-w-7xl mx-auto px-8 py-16">
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Donate Items</h2>
              <p className="text-gray-500 text-lg">Give new or gently used items — books, electronics, furniture, and more — to support our community.</p>
            </div>

            {userRole !== 'admin' && (
              <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-8 mb-12 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Submit an Item Donation</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Item Name *</label>
                    <input
                      type="text"
                      value={itemDonationForm.item_name}
                      onChange={(e) => setItemDonationForm({ ...itemDonationForm, item_name: e.target.value })}
                      placeholder="e.g., Textbooks (College Algebra)"
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Category</label>
                    <select
                      value={itemDonationForm.category}
                      onChange={(e) => setItemDonationForm({ ...itemDonationForm, category: e.target.value })}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                    >
                      <option>Books</option>
                      <option>Electronics</option>
                      <option>Furniture</option>
                      <option>Clothing</option>
                      <option>Appliances</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <textarea
                    value={itemDonationForm.description}
                    onChange={(e) => setItemDonationForm({ ...itemDonationForm, description: e.target.value })}
                    rows={3}
                    placeholder="Describe the item(s)..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={itemDonationForm.quantity}
                      onChange={(e) => setItemDonationForm({ ...itemDonationForm, quantity: e.target.value })}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Condition</label>
                    <select
                      value={itemDonationForm.condition}
                      onChange={(e) => setItemDonationForm({ ...itemDonationForm, condition: e.target.value })}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                    >
                      <option value="new">New</option>
                      <option value="like_new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Delivery Method</label>
                    <select
                      value={itemDonationForm.delivery_method}
                      onChange={(e) => setItemDonationForm({ ...itemDonationForm, delivery_method: e.target.value })}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                    >
                      <option value="drop_off">Drop off at campus</option>
                      <option value="pickup_request">Request pickup</option>
                    </select>
                  </div>
                  {itemDonationForm.delivery_method === 'pickup_request' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Pickup Address *</label>
                      <input
                        type="text"
                        value={itemDonationForm.pickup_address}
                        onChange={(e) => setItemDonationForm({ ...itemDonationForm, pickup_address: e.target.value })}
                        placeholder="Where should we pick this up?"
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Photo (optional)</label>
                  {itemDonationPhotoPreview ? (
                    <div className="relative border-2 border-gray-200 rounded-2xl p-4">
                      <img src={itemDonationPhotoPreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                      <button
                        onClick={() => { setItemDonationPhoto(null); setItemDonationPhotoPreview(null); }}
                        className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-white cursor-pointer transition-all">
                      <input type="file" accept="image/*" onChange={handleItemDonationPhotoChange} className="hidden" />
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-sm font-bold text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 5MB)</p>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Your Name</label>
                    <input type="text" value={`${donationFirstName} ${donationLastName}`.trim()} readOnly className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Your Email</label>
                    <input type="text" value={donationEmail} readOnly className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone (optional)</label>
                    <input
                      type="text"
                      value={donationPhone}
                      onChange={(e) => setDonationPhone(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitItemDonation}
                  disabled={isSubmittingItemDonation}
                  className="w-full py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingItemDonation ? 'Submitting...' : 'Submit Item Donation'}
                </button>
              </div>
            )}

            {loadingItemDonations ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-semibold text-lg">Loading item donations...</p>
              </div>
            ) : itemDonations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-semibold text-lg">{userRole === 'admin' ? 'No item donations submitted yet.' : "You haven't submitted any item donations yet."}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{userRole === 'admin' ? 'Submitted Item Donations' : 'My Item Donations'}</h3>
                {itemDonations.map((item) => {
                  const statusMap: Record<string, { label: string; classes: string }> = {
                    received: { label: 'Received', classes: 'bg-emerald-100 text-emerald-700' },
                    pending: { label: 'Pending Review', classes: 'bg-amber-100 text-amber-700' },
                    rejected: { label: 'Rejected', classes: 'bg-red-100 text-red-700' },
                  };
                  const status = statusMap[item.status] ?? statusMap.pending;
                  return (
                    <div key={item.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-4">
                      {item.photo_path && (
                        <img src={`http://localhost:8000${item.photo_path}`} alt={item.item_name} className="w-full sm:w-32 h-32 object-cover rounded-xl shrink-0" />
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#003087]" />
                          <p className="font-bold text-gray-900 text-lg">{item.item_name}</p>
                        </div>
                        <p className="text-sm text-gray-500 capitalize">{item.category} · Qty {item.quantity} · {item.condition.replace('_', ' ')}</p>
                        {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                        <p className="text-xs text-gray-400">
                          {item.delivery_method === 'pickup_request' ? `Pickup: ${item.pickup_address}` : 'Drop-off at campus'}
                        </p>
                        {userRole === 'admin' && (
                          <p className="text-xs text-gray-400">{item.donor_full_name} · {item.donor_email}{item.donor_phone ? ` · ${item.donor_phone}` : ''}</p>
                        )}
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.classes}`}>{status.label}</span>
                        {userRole === 'admin' && item.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateItemDonationStatus(item.id, 'received')} className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all">Mark Received</button>
                            <button onClick={() => handleUpdateItemDonationStatus(item.id, 'rejected')} className="px-3 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-all">Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-donations' && (
          <div className="max-w-7xl mx-auto px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Donation History</h2>

            {loadingMyDonations ? (
              <div className="text-center py-16 text-gray-400 font-semibold">Loading your donations...</div>
            ) : myDonations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                <Heart className="w-14 h-14 opacity-30" />
                <p className="text-lg font-semibold">You haven't made any donations yet.</p>
                <button
                  onClick={() => setActiveTab('needs')}
                  className="mt-2 px-6 py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002066] transition-colors"
                >
                  Browse Campaigns
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myDonations.map((donation: any) => {
                  const statusMap: Record<string, { label: string; classes: string }> = {
                    verified: { label: 'Verified',         classes: 'bg-emerald-100 text-emerald-700' },
                    pending:  { label: 'Pending Approval', classes: 'bg-amber-100 text-amber-700' },
                    rejected: { label: 'Rejected',         classes: 'bg-red-100 text-red-700' },
                  };
                  const status = statusMap[donation.payment_status] ?? { label: 'Pending Approval', classes: 'bg-amber-100 text-amber-700' };
                  return (
                    <div key={donation.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <p className="font-bold text-gray-900 text-lg">
                          {donation.campaign ? donation.campaign.title : 'General Donation'}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {donation.payment_method || 'Credit Card'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {donation.created_at ? new Date(donation.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-extrabold text-[#003087]">
                          ₱{Number(donation.amount).toLocaleString()}
                        </p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${status.classes}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DONATION MODAL */}
        {showDonationModal && selectedCampaignForDonation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Donate to {selectedCampaignForDonation.title}</h2>
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Campaign Info */}
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="font-bold text-[#003087]">{selectedCampaignForDonation.raised} / {selectedCampaignForDonation.goal}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#003087] rounded-full"
                      style={{ width: `${Math.min(100, (parseInt(selectedCampaignForDonation.raised.replace(/\D/g, '')) || 0) / (parseInt(selectedCampaignForDonation.goal.replace(/\D/g, '')) || 1) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{selectedCampaignForDonation.backers} supporters already donated</p>
                </div>

                {/* Donation Amount */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Donation Amount (₱) *</label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                {/* Account Information */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Donating As</label>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="font-bold text-gray-900">
                      {donationFirstName || donationLastName
                        ? `${donationFirstName} ${donationLastName}`.trim()
                        : 'Unavailable'}
                    </p>
                    <p className="text-sm text-gray-600 break-all">{donationEmail || 'Unavailable'}</p>
                  </div>
                  <p className="text-xs text-gray-500">Account details are automatically used for your donation receipt.</p>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Credit Card', 'GCash', 'Bank Transfer'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setDonationPaymentMethod(method)}
                        className={`p-3 border-2 rounded-xl font-bold text-sm transition-all ${
                          donationPaymentMethod === method
                            ? 'bg-[#003087] border-[#003087] text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087]'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Reference Number *</label>
                  <input
                    type="text"
                    value={donationReferenceNumber}
                    onChange={(e) => setDonationReferenceNumber(e.target.value)}
                    placeholder="Enter transaction or reference number"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Upload Receipt *</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setDonationReceiptFile(e.target.files?.[0] || null)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                    disabled={isDonating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDonateToCampaign}
                    disabled={isDonating}
                    className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#002566] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDonating ? 'Processing...' : `Donate ₱${donationAmount || '0'}`}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Your donation is secure and tax-deductible. You will receive a receipt via email.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VOLUNTEER REGISTRATION MODAL */}
        {showVolunteerRegModal && selectedVolunteerEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] p-10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Register for {selectedVolunteerEvent.title}</h2>
                <button
                  onClick={() => { setShowVolunteerRegModal(false); setSelectedVolunteerEvent(null); }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={volunteerRegForm.full_name}
                    onChange={(e) => setVolunteerRegForm({ ...volunteerRegForm, full_name: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email</label>
                  <input
                    type="email"
                    value={volunteerRegForm.email}
                    onChange={(e) => setVolunteerRegForm({ ...volunteerRegForm, email: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone (optional)</label>
                  <input
                    type="text"
                    value={volunteerRegForm.phone}
                    onChange={(e) => setVolunteerRegForm({ ...volunteerRegForm, phone: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Notes (optional)</label>
                  <textarea
                    value={volunteerRegForm.notes}
                    onChange={(e) => setVolunteerRegForm({ ...volunteerRegForm, notes: e.target.value })}
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => { setShowVolunteerRegModal(false); setSelectedVolunteerEvent(null); }}
                    className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                    disabled={isSubmittingVolunteerReg}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitVolunteerRegistration}
                    disabled={isSubmittingVolunteerReg}
                    className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#002566] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingVolunteerReg ? 'Submitting...' : 'Confirm Registration'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}