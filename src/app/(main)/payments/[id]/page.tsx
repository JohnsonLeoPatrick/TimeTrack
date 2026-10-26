'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getChipPaymentStatusAction } from '@/lib/server/actions/chip.actions';

export default function PaymentStatusPage() {
  const { id } = useParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['chip-payment', id], queryFn: () => getChipPaymentStatusAction(id),
    retry: false, refetchOnWindowFocus: true,
  });
  const paid = query.data?.status === 'SUCCESS';
  return <div className="min-h-screen px-6 pb-24 pt-36"><section className="auth-card mx-auto max-w-lg text-center space-y-6">
    <h1 className="text-3xl">{paid ? 'Payment confirmed' : 'Payment status'}</h1>
    <div role="status" aria-live="polite">
      {query.isPending ? <p>Checking your payment with CHIP…</p> : query.error ? <p>{query.error.message}</p> : paid ? <p>Your registration is paid. You can view it in your profile.</p> : query.data?.status === 'FAILED' ? <p>This checkout expired or was cancelled. Open your profile to start a new payment.</p> : query.data?.status === 'PENDING_REVIEW' ? <p>This payment needs confirmation. Do not pay again; contact support if the status does not update.</p> : <p>Payment has not been confirmed yet. If you paid, wait a moment and check again.</p>}
    </div>
    {!paid && <button className="btn-secondary w-full" disabled={query.isFetching} onClick={() => query.refetch()}>{query.isFetching ? 'Checking…' : 'Check payment status'}</button>}
    <Link className="btn-primary" href="/profile">View my registrations</Link>
  </section></div>;
}
