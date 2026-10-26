'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/server/auth/require-role';
import { revalidatePath } from 'next/cache';

export async function createPaymentAction(registrationId: string, gateway: string) {
  if (gateway.toUpperCase() === 'CHIP') throw new Error('Use secure CHIP checkout to create this payment');
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: reg, error: regError } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', registrationId)
    .eq('athlete_id', user.id)
    .single();

  if (regError || !reg) throw new Error('Registration not found');
  if (reg.net_amount <= 0) throw new Error('No payment required');

  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      registration_id: registrationId,
      payment_gateway: gateway,
      amount: reg.net_amount,
      currency: 'MYR',
      status: 'PENDING',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/profile`, 'page');

  return payment;
}

export async function adminApprovePaymentAction(paymentId: string) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const supabase = await createSupabaseServerClient();
  const { data: target, error: targetError } = await supabase.from('payments').select('payment_gateway').eq('id', paymentId).single();
  if (targetError || !target) throw new Error('Payment not found');
  if (target.payment_gateway === 'CHIP') throw new Error('CHIP payments require provider verification');

  const { error } = await supabase.rpc('review_payment', { p_payment_id: paymentId, p_approve: true });
  if (error) throw new Error('Payment review is unavailable. Please try again later.');

  revalidatePath('/admin/dashboard', 'page');
}

export async function adminRejectPaymentAction(paymentId: string) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const supabase = await createSupabaseServerClient();
  const { data: target, error: targetError } = await supabase.from('payments').select('payment_gateway').eq('id', paymentId).single();
  if (targetError || !target) throw new Error('Payment not found');
  if (target.payment_gateway === 'CHIP') throw new Error('Manage CHIP payment status through provider verification');

  const { error } = await supabase.rpc('review_payment', { p_payment_id: paymentId, p_approve: false });
  if (error) throw new Error('Payment review is unavailable. Please try again later.');
  revalidatePath('/admin/dashboard', 'page');
}

export async function processRefundAction(refundId: string, approve: boolean) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const supabase = await createSupabaseServerClient();
  const { data: refundPayment, error: paymentError } = await supabase.from('refunds').select('payments!inner(payment_gateway)').eq('id', refundId).single();
  if (paymentError || !refundPayment) throw new Error('Refund not found');
  const payment = Array.isArray(refundPayment.payments) ? refundPayment.payments[0] : refundPayment.payments;
  if (payment?.payment_gateway === 'CHIP') throw new Error('Process CHIP refunds through the merchant portal; this action does not move provider funds');

  const status = approve ? 'REFUNDED' : 'REFUND_REJECTED';

  const { data: refund, error: refError } = await supabase
    .from('refunds')
    .update({ status, processed_at: new Date().toISOString() })
    .eq('id', refundId)
    .select('registration_id')
    .single();

  if (refError) throw new Error(refError.message);

  if (approve) {
    await supabase
      .from('registrations')
      .update({ status: 'REFUNDED' })
      .eq('id', refund.registration_id);
  }

  revalidatePath('/admin/dashboard', 'page');
}
