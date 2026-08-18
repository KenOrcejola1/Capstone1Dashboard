import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
  MapPin,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { AcknowledgementModal } from '../AcknowledgementModal';

type UserRole = 'admin' | 'alumni' | string;

type Activity = {
  id: number;
  title: string;
  description: string;
  venue: string | null;
  schedule_start: string | null;
  schedule_end: string | null;
  participant_limit: number | null;
  registration_open: boolean;
  poster_image_path: string | null;
  fee_amount: string | number;
  payment_instructions: string | null;
  status: 'active' | 'cancelled';
  registrants_count?: number;
  paid_count?: number;
  pending_payment_count?: number;
  available_slots?: number | null;
};

type Registration = {
  id: number;
  activity_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  payment_method: 'gcash' | 'bank_transfer' | 'cash' | null;
  reference_number: string | null;
  proof_of_payment_path: string | null;
  payment_status: 'pending' | 'verified' | 'rejected';
  amount: string | number;
  created_at?: string;
  activity?: Activity;
};

type Props = {
  userRole: UserRole;
  view?: 'browse' | 'my-events';
};

const API_BASE = 'http://localhost:8000/api';

const currency = (value: number | string) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(Number(value || 0));

const localIdentity = () => ({
  fullName: localStorage.getItem('userName') || '',
  email: localStorage.getItem('userEmail') || '',
});

export function CommunityEngagementView({ userRole, view = 'browse' }: Props) {
  const isAdmin = userRole === 'admin';
  const activeTab = view;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [popup, setPopup] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    schedule_start: '',
    schedule_end: '',
    participant_limit: '',
    registration_open: true,
    fee_amount: '0',
    payment_instructions: '',
    status: 'active',
  });

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    notes: '',
    payment_method: '',
    reference_number: '',
  });

  const paidActivity = useMemo(() => Number(selectedActivity?.fee_amount || 0) > 0, [selectedActivity]);
  const needsReference = registerForm.payment_method === 'gcash' || registerForm.payment_method === 'bank_transfer';

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setServerMessage(null);

    try {
      const { email } = localIdentity();
      const activityPromise = fetch(`${API_BASE}/community/activities?role=${isAdmin ? 'admin' : 'alumni'}`);
      const registrationPromise = isAdmin
        ? fetch(`${API_BASE}/community/registrations`)
        : Promise.resolve(null);
      const myRegistrationsPromise = !isAdmin && email
        ? fetch(`${API_BASE}/community/registrations?email=${encodeURIComponent(email)}`)
        : Promise.resolve(null);

      const [activityRes, registrationRes, myRegRes] = await Promise.all([
        activityPromise,
        registrationPromise,
        myRegistrationsPromise,
      ]);

      if (!activityRes.ok) throw new Error('Failed to load activities.');
      setActivities(await activityRes.json());

      if (registrationRes) {
        if (!registrationRes.ok) throw new Error('Failed to load registrations.');
        setRegistrations(await registrationRes.json());
      } else {
        setRegistrations([]);
      }

      if (myRegRes) {
        if (!myRegRes.ok) throw new Error('Failed to load your registrations.');
        setMyRegistrations(await myRegRes.json());
      } else {
        setMyRegistrations([]);
      }
    } catch (error: any) {
      setServerMessage({ type: 'error', text: error?.message || 'Something went wrong while loading data.' });
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const resetForm = () => {
    setEditingId(null);
    setPosterFile(null);
    setForm({
      title: '',
      description: '',
      venue: '',
      schedule_start: '',
      schedule_end: '',
      participant_limit: '',
      registration_open: true,
      fee_amount: '0',
      payment_instructions: '',
      status: 'active',
    });
  };

  const handleActivitySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerMessage(null);

    if (!form.title.trim() || !form.description.trim()) {
      setServerMessage({ type: 'error', text: 'Title and description are required.' });
      return;
    }

    if (Number(form.fee_amount) < 0) {
      setServerMessage({ type: 'error', text: 'Fee amount cannot be negative.' });
      return;
    }

    setIsSaving(true);

    try {
      const body = new FormData();
      body.append('title', form.title);
      body.append('description', form.description);
      body.append('venue', form.venue);
      if (form.schedule_start) body.append('schedule_start', form.schedule_start);
      if (form.schedule_end) body.append('schedule_end', form.schedule_end);
      if (form.participant_limit) body.append('participant_limit', form.participant_limit);
      body.append('registration_open', String(form.registration_open));
      body.append('fee_amount', form.fee_amount || '0');
      body.append('payment_instructions', form.payment_instructions || '');
      body.append('status', form.status);
      body.append('created_by_email', localStorage.getItem('userEmail') || '');
      if (posterFile) body.append('poster_image', posterFile);

      const endpoint = editingId ? `${API_BASE}/community/activities/${editingId}` : `${API_BASE}/community/activities`;
      const method = editingId ? 'POST' : 'POST';
      if (editingId) body.append('_method', 'PUT');

      const response = await fetch(endpoint, {
        method,
        body,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || 'Unable to save activity.');
      }

      setServerMessage({ type: 'success', text: editingId ? 'Activity updated successfully.' : 'Activity created successfully.' });
      resetForm();
      await refreshAll();
    } catch (error: any) {
      setServerMessage({ type: 'error', text: error?.message || 'Unable to save activity.' });
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setPosterFile(null);
    setForm({
      title: activity.title,
      description: activity.description,
      venue: activity.venue || '',
      schedule_start: activity.schedule_start ? activity.schedule_start.slice(0, 16) : '',
      schedule_end: activity.schedule_end ? activity.schedule_end.slice(0, 16) : '',
      participant_limit: activity.participant_limit ? String(activity.participant_limit) : '',
      registration_open: Boolean(activity.registration_open),
      fee_amount: String(activity.fee_amount || '0'),
      payment_instructions: activity.payment_instructions || '',
      status: activity.status || 'active',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteActivity = async (activity: Activity) => {
    if (!window.confirm(`Delete "${activity.title}"?`)) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/community/activities/${activity.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete activity.');
      setServerMessage({ type: 'success', text: 'Activity deleted.' });
      await refreshAll();
    } catch (error: any) {
      setServerMessage({ type: 'error', text: error?.message || 'Failed to delete activity.' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRegistration = async (activity: Activity, open: boolean) => {
    const label = open ? 'open' : 'close';
    if (!window.confirm(`Do you want to ${label} registration for "${activity.title}"?`)) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/community/activities/${activity.id}/registration`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_open: open }),
      });
      if (!response.ok) throw new Error('Failed to update registration state.');
      await refreshAll();
      setServerMessage({ type: 'success', text: `Registration ${open ? 'opened' : 'closed'} successfully.` });
    } catch (error: any) {
      setServerMessage({ type: 'error', text: error?.message || 'Failed to update registration state.' });
    } finally {
      setIsSaving(false);
    }
  };

  const openRegistration = (activity: Activity) => {
    const identity = localIdentity();
    setSelectedActivity(activity);
    setShowRegistrationModal(true);
    setPaymentProof(null);
    setRegisterForm({
      full_name: identity.fullName,
      email: identity.email,
      phone: '',
      notes: '',
      payment_method: '',
      reference_number: '',
    });
  };

  const submitRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedActivity) return;

    setServerMessage(null);

    if (!registerForm.full_name.trim() || !registerForm.email.trim()) {
      setServerMessage({ type: 'error', text: 'Full name and email are required.' });
      return;
    }

    if (paidActivity && !registerForm.payment_method) {
      setServerMessage({ type: 'error', text: 'Please select a payment method.' });
      return;
    }

    if (needsReference && !registerForm.reference_number.trim()) {
      setServerMessage({ type: 'error', text: 'Reference number is required for GCash and Bank Transfer.' });
      return;
    }

    if (needsReference && !paymentProof) {
      setServerMessage({ type: 'error', text: 'Please upload proof of payment.' });
      return;
    }

    setIsSaving(true);

    try {
      const body = new FormData();
      body.append('activity_id', String(selectedActivity.id));
      body.append('full_name', registerForm.full_name);
      body.append('email', registerForm.email);
      body.append('phone', registerForm.phone);
      body.append('notes', registerForm.notes);
      if (paidActivity) body.append('payment_method', registerForm.payment_method);
      if (registerForm.reference_number) body.append('reference_number', registerForm.reference_number);
      if (paymentProof) body.append('proof_of_payment', paymentProof);

      const response = await fetch(`${API_BASE}/community/registrations`, {
        method: 'POST',
        body,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to submit registration.');
      }

      setPopup({
        type: 'success',
        text: data?.payment_instructions
          ? `Registration submitted. Please wait for the admin to approve your payment. Payment instructions: ${data.payment_instructions}`
          : 'Registration submitted. Please wait for the admin to approve your payment.',
      });
      setShowRegistrationModal(false);
      await refreshAll();
    } catch (error: any) {
      setPopup({ type: 'error', text: error?.message || 'Unable to submit registration.' });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePaymentStatus = async (registration: Registration, status: 'pending' | 'verified' | 'rejected') => {
    if (!window.confirm(`Set payment status to ${status} for ${registration.full_name}?`)) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/community/registrations/${registration.id}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: status,
          payment_verified_by: localStorage.getItem('userEmail') || 'admin',
        }),
      });

      if (!response.ok) throw new Error('Unable to update payment status.');
      await refreshAll();
      setServerMessage({ type: 'success', text: 'Payment status updated.' });
    } catch (error: any) {
      setServerMessage({ type: 'error', text: error?.message || 'Unable to update payment status.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
      <AcknowledgementModal
        open={popup !== null}
        type={popup?.type || 'success'}
        message={popup?.text || ''}
        onConfirm={() => setPopup(null)}
      />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Alumni Community Engagement</h2>
          <p className="text-gray-600 mt-1">Activities, registrations, and payments in one module.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={refreshAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>


      {serverMessage && (
        <div
          className={`rounded-lg p-3 text-sm flex items-start gap-2 ${
            serverMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {serverMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
          <span>{serverMessage.text}</span>
        </div>
      )}

      {isAdmin && (
        <form onSubmit={handleActivitySubmit} className="rounded-xl border border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Activity' : 'Create Activity'}</h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-600 hover:text-gray-900">
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Activity title"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
            />
            <input
              value={form.venue}
              onChange={(e) => setForm((prev) => ({ ...prev, venue: e.target.value }))}
              placeholder="Venue"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="datetime-local"
              value={form.schedule_start}
              onChange={(e) => setForm((prev) => ({ ...prev, schedule_start: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="datetime-local"
              value={form.schedule_end}
              onChange={(e) => setForm((prev) => ({ ...prev, schedule_end: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="number"
              min={1}
              value={form.participant_limit}
              onChange={(e) => setForm((prev) => ({ ...prev, participant_limit: e.target.value }))}
              placeholder="Participant limit"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.fee_amount}
              onChange={(e) => setForm((prev) => ({ ...prev, fee_amount: e.target.value }))}
              placeholder="Fee amount"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
            />
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
            >
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <label className="inline-flex items-center gap-2 px-3 py-3 rounded-lg border border-gray-300">
              <input
                type="checkbox"
                checked={form.registration_open}
                onChange={(e) => setForm((prev) => ({ ...prev, registration_open: e.target.checked }))}
              />
              Registration Open
            </label>
          </div>

          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            rows={3}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
          />
          <textarea
            value={form.payment_instructions}
            onChange={(e) => setForm((prev) => ({ ...prev, payment_instructions: e.target.value }))}
            placeholder="Payment instructions (for paid activities)"
            rows={2}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
            className="w-full p-3 rounded-lg border border-gray-300"
          />

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-gray-400"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Update Activity' : 'Create Activity'}
          </button>
        </form>
      )}

      {!isAdmin && activeTab === 'my-events' && (
        <div className="space-y-4">
          {myRegistrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
              <ClipboardList className="w-12 h-12 opacity-40" />
              <p className="text-sm font-medium">You haven't registered for any events yet.</p>
              <p className="mt-1 text-sm text-gray-400">Switch to Community Engagement to browse available events.</p>
            </div>
          ) : (
            myRegistrations.map((reg) => {
              const activity = activities.find((a) => a.id === reg.activity_id);
              const statusConfig = {
                verified: { label: 'Approved', icon: CheckCircle2, classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                pending:  { label: 'Pending Approval', icon: Clock,         classes: 'bg-amber-100 text-amber-700 border-amber-200' },
                rejected: { label: 'Rejected', icon: XCircle,      classes: 'bg-red-100 text-red-700 border-red-200' },
              }[reg.payment_status] ?? { label: reg.payment_status, icon: Clock, classes: 'bg-gray-100 text-gray-600 border-gray-200' };
              const StatusIcon = statusConfig.icon;

              return (
                <div key={reg.id} className="rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  {activity?.poster_image_path && (
                    <img
                      src={`http://localhost:8000${activity.poster_image_path}`}
                      alt={activity.title}
                      className="w-full sm:w-24 h-20 object-cover rounded-lg shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base truncate">
                      {activity?.title ?? `Event #${reg.activity_id}`}
                    </p>
                    {activity?.venue && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> {activity.venue}
                      </p>
                    )}
                    {activity?.schedule_start && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {new Date(activity.schedule_start).toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Registered: {reg.created_at ? new Date(reg.created_at).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.classes}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </span>
                    {Number(reg.amount) > 0 && (
                      <span className="text-xs text-gray-500 font-medium">{currency(reg.amount)}</span>
                    )}
                    {reg.payment_method && (
                      <span className="text-xs text-gray-400 capitalize">{reg.payment_method.replace('_', ' ')}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {(isAdmin || activeTab === 'browse') && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activities.map((activity) => {
          const fee = Number(activity.fee_amount || 0);

          return (
            <div key={activity.id} className="rounded-xl border border-gray-200 overflow-hidden bg-white">
              {activity.poster_image_path && (
                <img
                  src={`http://localhost:8000${activity.poster_image_path}`}
                  alt={activity.title}
                  className="w-full h-44 object-cover"
                />
              )}

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.venue || 'Venue to be announced'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${activity.registration_open ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {activity.registration_open ? 'Registration Open' : 'Registration Closed'}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{activity.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <Users className="inline w-4 h-4 mr-1" /> {activity.registrants_count ?? 0} registrants
                  </p>
                  <p>
                    <ShieldCheck className="inline w-4 h-4 mr-1" /> {currency(fee)} fee
                  </p>
                  <p>Start: {activity.schedule_start ? new Date(activity.schedule_start).toLocaleString() : 'TBD'}</p>
                  <p>Slots left: {activity.available_slots ?? 'Unlimited'}</p>
                </div>

                {isAdmin ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(activity)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                      disabled={isSaving}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleRegistration(activity, !activity.registration_open)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                      disabled={isSaving}
                    >
                      {activity.registration_open ? 'Close Registration' : 'Open Registration'}
                    </button>
                    <button
                      onClick={() => deleteActivity(activity)}
                      className="px-3 py-2 rounded-lg border border-red-200 text-red-700 text-sm hover:bg-red-50"
                      disabled={isSaving}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openRegistration(activity)}
                    disabled={!activity.registration_open || isSaving}
                    className="w-full px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-gray-300"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {isAdmin && (
        <div className="rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Registration Payments</h3>
          <div className="space-y-3 max-h-[24rem] overflow-y-auto pr-1">
            {registrations.length === 0 ? (
              <p className="text-sm text-gray-500">No registrations yet.</p>
            ) : (
              registrations.map((registration) => (
                <div key={registration.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{registration.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {registration.activity?.title || 'Unknown activity'} | {registration.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Method: {registration.payment_method || 'N/A'} | Ref: {registration.reference_number || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">Amount: {currency(registration.amount)}</p>
                      {registration.proof_of_payment_path && (
                        <a
                          href={`http://localhost:8000${registration.proof_of_payment_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-sky-700 hover:underline"
                        >
                          View proof of payment
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        registration.payment_status === 'verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : registration.payment_status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {registration.payment_status}
                      </span>
                      <button
                        onClick={() => updatePaymentStatus(registration, 'verified')}
                        className="px-3 py-2 text-xs rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        disabled={isSaving}
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => updatePaymentStatus(registration, 'rejected')}
                        className="px-3 py-2 text-xs rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                        disabled={isSaving}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updatePaymentStatus(registration, 'pending')}
                        className="px-3 py-2 text-xs rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50"
                        disabled={isSaving}
                      >
                        Set Pending
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showRegistrationModal && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900">Register for {selectedActivity.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Complete the form below to confirm your registration.</p>

            <form onSubmit={submitRegistration} className="space-y-3 mt-4">
              <input
                value={registerForm.full_name}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, full_name: e.target.value }))}
                placeholder="Full name"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
              <input
                value={registerForm.phone}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Contact number"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
              <textarea
                rows={2}
                value={registerForm.notes}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes (optional)"
                className="w-full p-3 rounded-lg border border-gray-300"
              />

              {paidActivity && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-3">
                  <p className="text-sm text-amber-800">
                    Registration fee: <span className="font-semibold">{currency(selectedActivity.fee_amount)}</span>
                  </p>
                  {selectedActivity.payment_instructions && (
                    <p className="text-sm text-amber-800">Payment Instructions: {selectedActivity.payment_instructions}</p>
                  )}

                  <select
                    value={registerForm.payment_method}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, payment_method: e.target.value }))}
                    className="w-full p-3 rounded-lg border border-amber-300"
                  >
                    <option value="">Select payment method</option>
                    <option value="gcash">GCash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                  </select>

                  {registerForm.payment_method && registerForm.payment_method !== 'cash' && (
                    <>
                      <input
                        value={registerForm.reference_number}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, reference_number: e.target.value }))}
                        placeholder="Reference number"
                        className="w-full p-3 rounded-lg border border-amber-300"
                      />
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                        className="w-full p-3 rounded-lg border border-amber-300"
                      />
                    </>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-gray-400"
                >
                  {isSaving ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed bottom-4 right-4 rounded-full bg-gray-900 text-white px-4 py-2 shadow-lg inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </div>
      )}
    </div>
  );
}
