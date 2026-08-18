import { useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, RefreshCcw } from 'lucide-react';

type UserRole = 'admin' | 'alumni' | string;

type Registration = {
  id: number;
  activity_id?: number;
  full_name: string;
  email: string;
  payment_method: string;
  reference_number: string;
  payment_status: 'pending' | 'verified' | 'rejected';
  created_at?: string;
  proof_of_payment_path: string;
  amount: string | number;
  activity?: {
    schedule_start?: string;
    title: string;
    fee_amount?: string | number;
  };
};

type Donation = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  amount: string | number;
  payment_method: string;
  reference_number?: string | null;
  proof_of_payment_path?: string | null;
  payment_status: 'pending' | 'verified' | 'rejected';
  created_at?: string;
  campaign?: {
    title: string;
  } | null;
};

type VerificationRow =
  | {
      source: 'registration';
      item: Registration;
    }
  | {
      source: 'donation';
      item: Donation;
    };

type Props = {
  userRole: UserRole;
};

const API_BASE = 'http://localhost:8000/api';

const currency = (value: number | string | undefined) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(Number(value || 0));

const formatRequestedAt = (value?: string) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const statusMeta = (status: Registration['payment_status']) => {
  if (status === 'verified') {
    return {
      label: 'Confirmed',
      helper: 'Payment verified. You can now attend this event.',
      className: 'bg-emerald-100 text-emerald-700',
    };
  }

  if (status === 'rejected') {
    return {
      label: 'Rejected',
      helper: 'Payment was rejected. Please contact admin or resubmit.',
      className: 'bg-red-100 text-red-700',
    };
  }

  return {
    label: 'Pending',
    helper: 'Awaiting admin payment verification.',
    className: 'bg-amber-100 text-amber-700',
  };
};

export function PaymentVerificationView({ userRole }: Props) {
  const isAdmin = userRole === 'admin';
  const [rows, setRows] = useState<VerificationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail') || '';
      const endpoint = isAdmin
        ? null
        : email
          ? `${API_BASE}/community/registrations?email=${encodeURIComponent(email)}`
          : null;

      if (!isAdmin && !endpoint) {
        setRows([]);
        return;
      }

      if (!isAdmin) {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to load payments.');
        }
        const data = await response.json();
        setRows(data.map((item: Registration) => ({ source: 'registration', item })));
        return;
      }

      const [registrationsResponse, donationsResponse] = await Promise.all([
        fetch(`${API_BASE}/community/registrations`),
        fetch(`${API_BASE}/donations`),
      ]);

      if (!registrationsResponse.ok || !donationsResponse.ok) {
        throw new Error('Failed to load payments.');
      }

      const registrations = await registrationsResponse.json();
      const donations = await donationsResponse.json();

      const registrationRows: VerificationRow[] = registrations.map((item: Registration) => ({
        source: 'registration',
        item,
      }));

      const donationRows: VerificationRow[] = donations.map((item: Donation) => ({
        source: 'donation',
        item,
      }));

      setRows([...registrationRows, ...donationRows]);
    } catch (error: any) {
      alert(error?.message || 'Failed to load payments.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const status = row.item.payment_status;
      if (status === 'rejected') {
        return false;
      }

      if (statusFilter === 'all') {
        return true;
      }

      // Treat null, undefined, or empty string as pending
      if (!status || status === '') {
        return statusFilter === 'pending';
      }
      return status === statusFilter;
    });
  }, [rows, statusFilter]);

  const updateStatus = async (row: VerificationRow, payment_status: 'pending' | 'verified' | 'rejected') => {
    try {
      const endpoint = row.source === 'registration'
        ? `${API_BASE}/community/registrations/${row.item.id}/payment-status`
        : `${API_BASE}/donations/${row.item.id}/status`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status,
          payment_verified_by: localStorage.getItem('userEmail') || 'admin',
          verified_by: localStorage.getItem('userEmail') || 'admin',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status.');
      }

      await fetchRows();
    } catch (error: any) {
      alert(error?.message || 'Failed to update payment status.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Verification</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin
              ? 'Review receipt uploads and approve or reject event payments.'
              : 'Track your event registration payment status.'}
          </p>
        </div>
        <button
          onClick={fetchRows}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          {['all', 'pending', 'verified', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusFilter === status ? 'bg-[#003087] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading payments...</div>
        ) : isAdmin && filteredRows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No payments found for this filter.</div>
        ) : !isAdmin && rows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">You have no event registrations yet.</div>
        ) : !isAdmin ? (
          <div className="p-4 space-y-3">
            {rows.map((row) => {
              const meta = statusMeta(row.item.payment_status);
              return (
                <div key={`${row.source}-${row.item.id}`} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {row.source === 'donation'
                          ? `${row.item.first_name} ${row.item.last_name}`.trim()
                          : row.item.full_name}
                      </p>
                      <p className="text-sm text-gray-600">Requested At: {formatRequestedAt(row.item.created_at)}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        Payment method: {(row.item.payment_method || 'N/A').replace('_', ' ')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${meta.className}`}>{meta.label}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{meta.helper}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Source</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Registrant</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Event</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Amount</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Reference #</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Method</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Receipt</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Requested At</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={`${row.source}-${row.item.id}`} className="border-b border-gray-100">
                    <td className="p-3 text-sm text-gray-700">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${row.source === 'donation' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {row.source === 'donation' ? 'General Donation' : 'Event Registration'}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-gray-900 text-sm">
                        {row.source === 'donation'
                          ? `${row.item.first_name} ${row.item.last_name}`.trim()
                          : row.item.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{row.item.email}</p>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {row.source === 'donation'
                        ? row.item.campaign?.title || 'General Donation'
                        : row.item.activity?.title || 'Unknown event'}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {currency(
                        row.source === 'registration'
                          ? Number(row.item.amount || row.item.activity?.fee_amount || 0)
                          : Number(row.item.amount || 0),
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {row.source === 'donation' ? (row.item.reference_number || 'N/A') : row.item.reference_number}
                    </td>
                    <td className="p-3 text-sm text-gray-700 capitalize">
                      {(row.item.payment_method || 'N/A').replace('_', ' ')}
                    </td>
                    <td className="p-3">
                      {row.source === 'registration' && row.item.proof_of_payment_path ? (
                        <a
                          href={`http://localhost:8000${row.item.proof_of_payment_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[#003087] hover:underline"
                        >
                          <Eye className="w-4 h-4" /> View
                        </a>
                      ) : row.source === 'donation' && row.item.proof_of_payment_path ? (
                        <a
                          href={`http://localhost:8000${row.item.proof_of_payment_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[#003087] hover:underline"
                        >
                          <Eye className="w-4 h-4" /> View
                        </a>
                      ) : (
                        <span className="text-xs text-red-600">Missing</span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-700">{formatRequestedAt(row.item.created_at)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(row, 'verified')}
                          className="px-3 py-1.5 text-xs rounded-lg border border-green-200 text-green-700 hover:bg-green-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(row, 'rejected')}
                          className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                        >
                          Reject
                        </button>
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
  );
}
