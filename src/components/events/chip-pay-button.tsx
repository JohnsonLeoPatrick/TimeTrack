'use client';

import { useState } from 'react';
import { startChipCheckoutAction } from '@/lib/server/actions/chip.actions';

export function ChipPayButton({ registrationId }: { registrationId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function pay() {
    setBusy(true); setError('');
    try {
      const { checkoutUrl } = await startChipCheckoutAction(registrationId);
      window.location.assign(checkoutUrl);
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to start payment'); setBusy(false); }
  }
  return <div className="mt-4 space-y-2"><button type="button" disabled={busy} onClick={pay} className="btn-primary w-full">{busy ? 'Opening secure checkout…' : 'Pay securely with CHIP'}</button>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}</div>;
}
