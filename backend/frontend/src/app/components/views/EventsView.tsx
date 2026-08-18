import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Award, User, FileText, Plus, X, CheckCircle, XCircle, Trash2, Edit } from 'lucide-react';
import { Footer } from '../Footer';
import { EventRegistrationModal } from '../EventRegistrationModal';
import { CommunityEngagementView } from './CommunityEngagementView';

// Image imports
import CareerFairBG from '../../../assets/CareerFairBG.jpg';

interface Event {
  id: string;
  activityId?: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  description: string;
  image: string;
  fee?: string | number;
  tab: 'Upcoming Events' | 'Past Events' | 'Teaching Opportunities' | 'Seminars & Workshops' | 'Alumni Proposals';
  postedBy?: string;
  postedDate?: string;
  compensation?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  submittedBy?: string;
}

const INITIAL_EVENTS: Event[] = [];
const PLACEHOLDER_EVENT_IDS = new Set(Array.from({ length: 33 }, (_, i) => String(i + 1)));
const API_BASE = 'http://localhost:8000/api';

const formatEventDate = (isoDateTime?: string | null) => {
  if (!isoDateTime) return 'TBD';
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return 'TBD';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatEventTime = (start?: string | null, end?: string | null) => {
  if (!start) return 'TBD';
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return 'TBD';

  const startStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (!end) return startStr;

  const endDate = new Date(end);
  if (Number.isNaN(endDate.getTime())) return startStr;
  const endStr = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${startStr} - ${endStr}`;
};

function EventCard({ event, userRole, onApprove, onReject, onView, onRemove, onEdit, activeTab }: any) {
  const isPast = event.tab === 'Past Events';
  const isTeaching = event.tab === 'Teaching Opportunities';
  const isProposalTab = event.tab === 'Alumni Proposals';
  const isMySubmissions = activeTab === 'My Submissions';
  const isAdmin = userRole === 'admin';

  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left">
      <div className="relative h-56 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {isAdmin && (
            <>
              <button 
                onClick={() => onEdit(event)}
                className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onRemove(event.id)}
                className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <span className="px-4 py-1.5 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg">
            {event.category}
          </span>
          {event.status && (
            <span className={`px-4 py-1.5 text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg ${
              event.status === 'Pending' ? 'bg-amber-500' : event.status === 'Approved' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {event.status}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" /> {event.date}
          </div>
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5" /> {event.time || 'TBD'}
          </div>
          {!isTeaching && !isProposalTab && (
            <div className="flex items-start gap-2 text-gray-500 text-[13px]">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> {event.location}
            </div>
          )}
          {isTeaching && event.compensation && (
            <div className="flex items-start gap-2 text-[#22C55E] text-[13px] font-semibold">
              <Award className="w-4 h-4 mt-0.5" /> {event.compensation}
            </div>
          )}
          <div className="flex items-start gap-2 text-[#003087] text-[13px] font-semibold">
            <Users className="w-4 h-4 mt-0.5" /> 
            {event.participants} {isPast ? 'attended' : isTeaching ? 'applications' : 'participants'}
          </div>
        </div>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-6 flex-1">
          {event.description}
        </p>

        {(isTeaching || isProposalTab || isMySubmissions) && event.postedBy && (
          <div className="pt-4 border-t border-gray-100 mb-6 flex items-center gap-2 text-gray-400 text-[11px]">
            <User className="w-3 h-3" />
            <span>Posted by <span className="text-gray-600 font-medium">{event.postedBy}</span> • {event.postedDate}</span>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {isProposalTab && isAdmin && event.status === 'Pending' ? (
            <>
              <button onClick={() => onApprove(event.id)} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => onReject(event.id)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </>
          ) : (event.tab === 'Upcoming Events' || event.tab === 'Seminars & Workshops') ? (
            <>
              <button 
                onClick={() => onView(event)}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                View Details
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('registerEvent', { detail: { event } }))}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-[#003087] text-white hover:bg-[#002566]"
              >
                Register
              </button>
            </>
          ) : (
            <button 
              onClick={() => onView(event)}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                isPast ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : isTeaching ? 'bg-[#003087] text-white hover:bg-[#002566]' : 'bg-[#003087] text-white hover:bg-[#002566]'
              }`}
            >
              {isPast ? 'View Gallery' : isTeaching ? 'Apply Now' : 'View Details'}
            </button>
          )}
          <button onClick={() => onView(event)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function EventsView({ userRole, userName = 'Alumni User' }: { userRole: string; userName?: string }) {
  const [activeTab, setActiveTab] = useState('Upcoming Events');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationEvent, setRegistrationEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('addu_events');

    if (!saved) {
      return INITIAL_EVENTS;
    }

    try {
      const parsed = JSON.parse(saved) as Event[];
      return parsed.filter((event) => !PLACEHOLDER_EVENT_IDS.has(String(event.id)));
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const fetchSharedEvents = async () => {
    try {
      const roleParam = userRole === 'admin' ? 'admin' : 'alumni';
      const response = await fetch(`${API_BASE}/community/activities?role=${roleParam}`);
      if (!response.ok) return;

      const activities = await response.json();
      const sharedEvents: Event[] = activities
        .filter((activity: any) => activity.status !== 'cancelled')
        .map((activity: any) => {
          const startRaw = activity.schedule_start || null;
          const startDate = startRaw ? new Date(startRaw) : null;
          const isPast = startDate ? startDate.getTime() < Date.now() : false;

          return {
            id: `shared-${activity.id}`,
            activityId: activity.id,
            title: activity.title,
            category: activity.category || 'General',
            date: formatEventDate(activity.schedule_start),
            time: formatEventTime(activity.schedule_start, activity.schedule_end),
            location: activity.venue || 'TBD',
            participants: Number(activity.registrants_count || 0),
            fee: activity.fee_amount,
            description: activity.description || 'No description provided.',
            image: activity.poster_image_path ? `http://localhost:8000${activity.poster_image_path}` : CareerFairBG,
            tab: isPast ? 'Past Events' : 'Upcoming Events',
          };
        });

      setEvents((prev) => {
        const localOnly = prev.filter((event) => !String(event.id).startsWith('shared-'));
        return [...sharedEvents, ...localOnly];
      });
    } catch (error) {
      console.error('Failed to fetch shared events:', error);
    }
  };

  const [newEvent, setNewEvent] = useState({
    title: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    capacity: '',
    fee: '',
    image: ''
  });
  const [newEventImageFile, setNewEventImageFile] = useState<File | null>(null);

  const [editEvent, setEditEvent] = useState({
    title: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    capacity: '',
    fee: '',
    image: ''
  });
  const [editEventImageFile, setEditEventImageFile] = useState<File | null>(null);

  useEffect(() => {
    localStorage.setItem('addu_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    fetchSharedEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  useEffect(() => {
    const handleRegisterEvent = (event: any) => {
      setRegistrationEvent(event.detail.event);
    };
    window.addEventListener('registerEvent', handleRegisterEvent as EventListener);
    return () => window.removeEventListener('registerEvent', handleRegisterEvent as EventListener);
  }, []);

  const triggerToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleApprove = (id: string) => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, status: 'Approved' as const, tab: 'Upcoming Events' as const } : ev
    ));
    triggerToast();
  };

  const handleReject = (id: string) => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, status: 'Rejected' as const } : ev
    ));
    triggerToast();
  };

  const handleRemove = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently remove this event?")) {
      if (String(id).startsWith('shared-')) {
        try {
          const sharedId = id.replace('shared-', '');
          const response = await fetch(`${API_BASE}/community/activities/${sharedId}`, { method: 'DELETE' });
          if (!response.ok) {
            throw new Error('Failed to delete shared event.');
          }
          await fetchSharedEvents();
          triggerToast();
          return;
        } catch (error: any) {
          alert(error?.message || 'Failed to delete shared event.');
          return;
        }
      }

      setEvents(prev => prev.filter(ev => ev.id !== id));
      triggerToast();
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setEditEventImageFile(null);
    const timeParts = event.time.split(' - ');
    setEditEvent({
      title: event.title,
      category: event.category,
      date: event.date,
      startTime: timeParts[0] || '',
      endTime: timeParts[1] || '',
      location: event.location,
      description: event.description,
      capacity: event.participants.toString(),
      fee: (event as any).fee?.toString() || '',
      image: event.image
    });
    setActiveTab('Edit Event');
  };

  const handleUpdateEvent = async () => {
    if (!editEvent.title || !editEvent.category || !editEvent.date || !editEvent.startTime || !editEvent.endTime || !editEvent.location || !editEvent.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingEvent) return;

    const updatedEvent: Event = {
      ...editingEvent,
      title: editEvent.title,
      category: editEvent.category,
      date: editEvent.date,
      time: `${editEvent.startTime} - ${editEvent.endTime}`,
      location: editEvent.location,
      participants: parseInt(editEvent.capacity) || editingEvent.participants,
      description: editEvent.description,
      image: editEvent.image || editingEvent.image,
    };

    if (String(editingEvent.id).startsWith('shared-')) {
      try {
        const sharedId = String(editingEvent.id).replace('shared-', '');
        const scheduleStart = editEvent.date && editEvent.startTime ? `${editEvent.date} ${editEvent.startTime}:00` : null;
        const scheduleEnd = editEvent.date && editEvent.endTime ? `${editEvent.date} ${editEvent.endTime}:00` : null;

        const payload = new FormData();
        payload.append('_method', 'PUT');
        payload.append('title', editEvent.title);
        payload.append('category', editEvent.category);
        payload.append('description', editEvent.description);
        payload.append('venue', editEvent.location);
        if (scheduleStart) payload.append('schedule_start', scheduleStart);
        if (scheduleEnd) payload.append('schedule_end', scheduleEnd);
        if (editEvent.capacity) payload.append('participant_limit', editEvent.capacity);
        payload.append('fee_amount', editEvent.fee || '0');
        payload.append('status', 'active');
        if (editEventImageFile) {
          payload.append('poster_image', editEventImageFile);
        }

        const response = await fetch(`${API_BASE}/community/activities/${sharedId}`, {
          method: 'POST',
          body: payload,
        });

        if (!response.ok) {
          throw new Error('Failed to update shared event.');
        }

        await fetchSharedEvents();
        setEditingEvent(null);
        setEditEvent({
          title: '',
          category: '',
          date: '',
          startTime: '',
          endTime: '',
          location: '',
          description: '',
          capacity: '',
          fee: '',
          image: ''
        });
        setEditEventImageFile(null);
        setActiveTab('Upcoming Events');
        triggerToast();
        return;
      } catch (error: any) {
        alert(error?.message || 'Failed to update shared event.');
        return;
      }
    }

    setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updatedEvent : ev));
    setEditingEvent(null);
    setEditEvent({
      title: '',
      category: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      capacity: '',
      fee: '',
      image: ''
    });
    setActiveTab('Upcoming Events');
    triggerToast();
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.category || !newEvent.date || !newEvent.startTime || !newEvent.endTime || !newEvent.location || !newEvent.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const scheduleStart = `${newEvent.date} ${newEvent.startTime}:00`;
      const scheduleEnd = `${newEvent.date} ${newEvent.endTime}:00`;

      const payload = new FormData();
      payload.append('title', newEvent.title);
      payload.append('category', newEvent.category);
      payload.append('description', newEvent.description);
      payload.append('venue', newEvent.location);
      payload.append('schedule_start', scheduleStart);
      payload.append('schedule_end', scheduleEnd);
      if (newEvent.capacity) payload.append('participant_limit', newEvent.capacity);
      payload.append('status', 'active');
      payload.append('registration_open', '1');
      payload.append('fee_amount', newEvent.fee || '0');
      payload.append('created_by_email', localStorage.getItem('userEmail') || '');
      if (newEventImageFile) {
        payload.append('poster_image', newEventImageFile);
      }

      const response = await fetch(`${API_BASE}/community/activities`, {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message || 'Failed to publish shared event.');
      }

      await fetchSharedEvents();
    } catch (error: any) {
      alert(error?.message || 'Unable to create event right now. Please try again.');
      return;
    }

    setNewEvent({
      title: '',
      category: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      capacity: '',
      fee: '',
      image: ''
    });
    setNewEventImageFile(null);
    setActiveTab('Upcoming Events');
    triggerToast();
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEditEvent({
      title: '',
      category: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      capacity: '',
      fee: '',
      image: ''
    });
    setActiveTab('Upcoming Events');
  };

  const baseTabs = ['Upcoming Events', 'Past Events', 'Teaching Opportunities', 'Seminars & Workshops', 'Community Engagement'];
  const alumniExtraTabs = ['My Events'];
  let tabs = userRole === 'admin'
    ? [...baseTabs, 'Alumni Proposals', 'Create Event']
    : [...baseTabs, ...alumniExtraTabs];
  if (editingEvent && activeTab === 'Edit Event') {
    tabs = [...tabs, 'Edit Event'];
  }

  const filteredEvents = events.filter(event => {
    if (activeTab === 'Create Event' || activeTab === 'Edit Event' || activeTab === 'Community Engagement' || activeTab === 'My Events') return false;
    return event.tab === activeTab;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {showSuccessToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">Action successful!</span>
        </div>
      )}

      <main className="flex-1 p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Engagement</h1>
            <p className="text-gray-500 text-sm mt-1">Manage events and alumni contributions</p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={() => setActiveTab('Create Event')}
              className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          )}
        </div>

        <div className="flex gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[13px] font-bold whitespace-nowrap transition-all relative ${
                activeTab === tab ? 'text-[#003087]' : 'text-gray-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#003087]" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Teaching Opportunities' && (
          <div className="bg-[#003087] rounded-[24px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-left">
            <div>
              <h2 className="text-2xl font-bold mb-2">Share Your Expertise with Future Ateneans</h2>
              <p className="text-blue-100 text-sm max-w-2xl">Give back to your alma mater by teaching or mentoring. Help shape the next generation.</p>
            </div>
            <button className="whitespace-nowrap bg-white text-[#003087] px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">Express Interest</button>
          </div>
        )}

        {/* ORANGE THEMED HEADER FOR SEMINARS */}
        {activeTab === 'Seminars & Workshops' && (
          <div className="bg-orange-600 rounded-[24px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-left shadow-lg">
            <div>
              <h2 className="text-2xl font-bold mb-2">Continuous Professional Development</h2>
              <p className="text-orange-50 text-sm max-w-2xl">
                Enhance your skills and stay competitive with professional seminars and workshops. Earn CEU credits while learning from industry experts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button className="whitespace-nowrap bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-lg">
                Browse All Seminars
              </button>
              <button className="whitespace-nowrap bg-transparent border border-white/30 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                My Certificates
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Community Engagement' && (
          <CommunityEngagementView userRole={userRole} view="browse" />
        )}

        {activeTab === 'My Events' && (
          <CommunityEngagementView userRole={userRole} view="my-events" />
        )}

        {activeTab !== 'Create Event' && activeTab !== 'Edit Event' && activeTab !== 'Community Engagement' && activeTab !== 'My Events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                userRole={userRole} 
                onApprove={handleApprove} 
                onReject={handleReject} 
                onView={setSelectedEvent}
                onRemove={handleRemove}
                onEdit={handleEdit}
                activeTab={activeTab}
              />
            ))}
          </div>
        )}

        {activeTab === 'Create Event' && userRole === 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select 
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Networking">Networking</option>
                    <option value="Professional Dev">Professional Development</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Community Engagement">Community Engagement</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g., ADDU Campus or Virtual Event"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea 
                  rows={6}
                  placeholder="Describe the event details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input 
                  type="number" 
                  placeholder="Maximum number of attendees"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Fee (PHP)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="0.00 for free events"
                  value={newEvent.fee}
                  onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setNewEventImageFile(file);
                      setNewEvent({ ...newEvent, image: imageUrl });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleCreateEvent}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  Create Event
                </button>
                <button 
                  onClick={() => {
                    setNewEvent({
                      title: '',
                      category: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      description: '',
                      capacity: '',
                      fee: '',
                      image: ''
                    });
                    setNewEventImageFile(null);
                    setActiveTab('Upcoming Events');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Edit Event' && userRole === 'admin' && editingEvent && (
          <div className="bg-white rounded-xl border-2 border-blue-200 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h3>
            <p className="text-gray-600 text-sm mb-6">Update the event details below. Changes will be saved immediately.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter event title"
                  value={editEvent.title}
                  onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input 
                    type="date" 
                    value={editEvent.date}
                    onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select 
                    value={editEvent.category}
                    onChange={(e) => setEditEvent({ ...editEvent, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Networking">Networking</option>
                    <option value="Professional Dev">Professional Development</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Community Engagement">Community Engagement</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    value={editEvent.startTime}
                    onChange={(e) => setEditEvent({ ...editEvent, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={editEvent.endTime}
                    onChange={(e) => setEditEvent({ ...editEvent, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g., ADDU Campus or Virtual Event"
                  value={editEvent.location}
                  onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea 
                  rows={6}
                  placeholder="Describe the event details..."
                  value={editEvent.description}
                  onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input 
                  type="number" 
                  placeholder="Maximum number of attendees"
                  value={editEvent.capacity}
                  onChange={(e) => setEditEvent({ ...editEvent, capacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Fee (PHP)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="0.00 for free events"
                  value={editEvent.fee}
                  onChange={(e) => setEditEvent({ ...editEvent, fee: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setEditEventImageFile(file);
                      setEditEvent({ ...editEvent, image: imageUrl });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleUpdateEvent}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Update Event
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Submit Proposal' && userRole !== 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Submit Event Proposal</h3>
            <p className="text-gray-600 text-sm mb-6">Submit your event proposal for admin review. Once approved, your event will be published to the Upcoming Events section.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select 
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Networking">Networking</option>
                    <option value="Professional Dev">Professional Development</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Community Engagement">Community Engagement</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g., ADDU Campus or Virtual Event"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea 
                  rows={6}
                  placeholder="Describe the event details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input 
                  type="number" 
                  placeholder="Maximum number of attendees"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Fee (PHP)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="0.00 for free events"
                  value={newEvent.fee}
                  onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setNewEventImageFile(file);
                      setNewEvent({ ...newEvent, image: imageUrl });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => {
                    if (!newEvent.title || !newEvent.category || !newEvent.date || !newEvent.startTime || !newEvent.endTime || !newEvent.location || !newEvent.description) {
                      alert('Please fill in all required fields');
                      return;
                    }

                    const proposedEvent: Event = {
                      id: Date.now().toString(),
                      title: newEvent.title,
                      category: newEvent.category,
                      date: newEvent.date,
                      time: `${newEvent.startTime} - ${newEvent.endTime}`,
                      location: newEvent.location,
                      participants: parseInt(newEvent.capacity) || 0,
                      description: newEvent.description,
                      image: newEvent.image || CareerFairBG,
                      tab: 'Alumni Proposals',
                      status: 'Pending',
                      postedBy: userName,
                      postedDate: 'Just now',
                      submittedBy: userName
                    };

                    setEvents(prev => [proposedEvent, ...prev]);
                    setNewEvent({
                      title: '',
                      category: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      description: '',
                      capacity: '',
                      image: ''
                    });
                    setNewEventImageFile(null);
                    setActiveTab('My Submissions');
                    alert('Event proposal submitted successfully! The admin will review and approve your event before it goes live.');
                    triggerToast();
                  }}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  Submit Proposal
                </button>
                <button 
                  onClick={() => {
                    setNewEvent({
                      title: '',
                      category: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      description: '',
                      capacity: '',
                      image: ''
                    });
                    setNewEventImageFile(null);
                    setActiveTab('Upcoming Events');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Detail View Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="relative h-48">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="p-8 text-left">
              <span className="inline-block px-3 py-1 bg-blue-50 text-[#003087] rounded-full text-[10px] font-bold uppercase mb-3">
                {selectedEvent.category}
              </span>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{selectedEvent.title}</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 text-[#003087]"/> 
                  <span>{selectedEvent.date} • {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-[#003087]"/> 
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl mb-8">
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="w-full py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-colors">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Registration Modal */}
      {registrationEvent && (
        <EventRegistrationModal 
          event={{
            activityId: registrationEvent.activityId,
            title: registrationEvent.title,
            date: registrationEvent.date,
            time: registrationEvent.time,
            location: registrationEvent.location,
            image: registrationEvent.image,
            fee: registrationEvent.fee,
          }}
          onClose={() => setRegistrationEvent(null)}
        />
      )}

      <Footer />
    </div>
  );
}