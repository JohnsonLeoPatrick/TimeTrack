'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { getOrganizerAnalyticsAction } from '@/lib/server/actions/analytics.actions';
import { adminApprovePaymentAction, adminRejectPaymentAction } from '@/lib/server/actions/payment.actions';

const money = (value: number) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(value);

export function OrganizerAnalyticsTab() {
  const query = useQuery({ queryKey: ['organizer-analytics'], queryFn: getOrganizerAnalyticsAction });
  if (query.isPending) return <p role="status">Loading analytics…</p>;
  if (query.error) return <p role="alert">{query.error.message}</p>;
  const data = query.data;
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold">Event analytics</h2>
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        ['Events', data.events.length], ['Registrations', data.totalRegistrations],
        ['Paid revenue', money(data.totalRevenue)],
      ].map(([label, value]) => <div key={label} className="glass rounded-2xl p-6"><p className="text-sm text-slate-600">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p></div>)}
    </div>
    <div className="glass rounded-2xl p-6"><h3 className="mb-4 text-lg font-bold">Your events</h3>
      {!data.events.length ? <p>No events yet. Create an event to start tracking registrations.</p> : data.events.map((event: { id: string; title: string; status: string }) => <div key={event.id} className="flex justify-between gap-4 border-b py-4"><span>{event.title}</span><span>{event.status}</span></div>)}
    </div>
  </div>;
}

export function AdminPaymentsTab() {
  const client = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const query = useQuery({ queryKey: ['admin-payments'], queryFn: async () => {
    const { data, error } = await createSupabaseBrowserClient().from('payments').select('id, registration_id, amount, status, payment_gateway, created_at').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } });
  async function update(id: string, approve: boolean) {
    setBusy(id); setError('');
    try {
      await (approve ? adminApprovePaymentAction(id) : adminRejectPaymentAction(id));
      await Promise.all(['admin-payments', 'admin-stats'].map(key => client.invalidateQueries({ queryKey: [key] })));
    } catch (error) { setError(error instanceof Error ? error.message : 'Payment update failed'); }
    finally { setBusy(null); }
  }
  return <div className="space-y-4"><h2 className="text-2xl font-bold">Payments</h2>
    {(error || query.error) && <p role="alert" className="text-red-700">{error || query.error?.message}</p>}
    <div className="glass overflow-x-auto rounded-2xl"><table className="w-full text-left"><thead><tr>{['Payment', 'Amount', 'Status', 'Actions'].map(label => <th key={label} className="p-4">{label}</th>)}</tr></thead>
      <tbody>{query.isPending ? <tr><td colSpan={4} className="p-6">Loading payments…</td></tr> : !query.data?.length ? <tr><td colSpan={4} className="p-6">No payments recorded.</td></tr> : query.data.map((payment: { id: string; amount: number; status: string; payment_gateway: string }) => <tr key={payment.id} className="border-t"><td className="p-4 font-mono text-sm">{payment.id.slice(0, 8)}</td><td className="p-4">{money(Number(payment.amount))}</td><td className="p-4">{payment.status}</td><td className="p-4">{payment.payment_gateway !== 'CHIP' && ['PENDING', 'PENDING_REVIEW'].includes(payment.status) && <div className="flex gap-3"><button disabled={!!busy} onClick={() => update(payment.id, true)} className="btn-secondary">Approve</button><button disabled={!!busy} onClick={() => update(payment.id, false)} className="btn-secondary">Reject</button></div>}</td></tr>)}</tbody>
    </table></div>
  </div>;
}
