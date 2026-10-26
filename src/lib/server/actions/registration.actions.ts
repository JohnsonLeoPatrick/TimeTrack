'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const billingSchema = z.object({
  first_name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  country: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
});

const participantSchema = z.object({
  // Category ids are opaque primary keys. The previous `.uuid()` check rejected
  // valid non-UUID ids (e.g. seeded/local ids such as `cat_1`).
  category_id: z.string().min(1),
  full_name: z.string().min(1),
  bib_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  ic_passport: z.string().optional(),
  dob: z.string().optional(),
  age: z.number().optional(),
  address: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
  medical_status: z.boolean().optional(),
  medical_details: z.string().optional(),
  emergency_name: z.string().optional(),
  emergency_phone: z.string().optional(),
});

const OPTIONAL_STRING_FIELDS = [
  'bib_name', 'email', 'phone', 'gender', 'ic_passport',
  'dob', 'address', 'postcode', 'country', 'medical_details',
  'emergency_name', 'emergency_phone',
];

export async function createRegistrationAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const eventId = formData.get('eventId') as string;
  const couponCode = (formData.get('couponCode') as string) || null;
  const billingJson = formData.get('billing') as string;
  const participantsJson = formData.get('participants') as string;

  const billing = billingJson ? JSON.parse(billingJson) : {};
  const participants: any[] = participantsJson ? JSON.parse(participantsJson) : [];

  if (!eventId) throw new Error('Event is required');
  if (participants.length === 0) throw new Error('At least one participant is required');

  // Parse/clean client input before handing it to the database function.
  const parsedBilling = billingSchema.parse(billing);

  const parsedParticipants = participants.map((p, i) => {
    const cleaned: any = { ...p };

    if (!cleaned.full_name || cleaned.full_name.trim() === '') {
      cleaned.full_name = i === 0 ? parsedBilling.first_name : `${parsedBilling.first_name} (Guest ${i + 1})`;
    }

    for (const field of OPTIONAL_STRING_FIELDS) {
      if (cleaned[field] === '') delete cleaned[field];
    }
    if (cleaned.age === null || cleaned.age === undefined) delete cleaned.age;
    if (cleaned.medical_status === null || cleaned.medical_status === undefined) delete cleaned.medical_status;

    return participantSchema.parse(cleaned);
  });

  // One transaction: registration + billing + participants + coupon redemption.
  // If any step fails nothing is written, so there are no partial registrations
  // and a coupon can never be redeemed past its limits.
  const { data, error } = await supabase.rpc('create_registration_atomic', {
    p_event_id: eventId,
    p_athlete_id: user.id,
    p_billing: parsedBilling,
    p_participants: parsedParticipants,
    p_coupon_code: couponCode,
  });

  if (error) throw new Error(error.message);

  const result = typeof data === 'string' ? JSON.parse(data) : data;

  revalidatePath(`/events/${eventId}`, 'page');
  revalidatePath('/profile', 'page');

  return { registrationId: result.registration_id, netAmount: Number(result.net_amount) };
}

export async function cancelRegistrationAction(registrationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: reg } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', registrationId)
    .eq('athlete_id', user.id)
    .single();

  if (!reg) throw new Error('Registration not found');
  if (reg.status === 'PAID') throw new Error('Please request a refund instead');

  const { error } = await supabase
    .from('registrations')
    .update({ status: 'CANCELLED', deleted_at: new Date().toISOString() })
    .eq('id', registrationId);

  if (error) throw new Error(error.message);
  revalidatePath('/profile', 'page');
}

export async function requestRefundAction(registrationId: string, reason: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: reg } = await supabase
    .from('registrations')
    .select('id')
    .eq('id', registrationId)
    .eq('athlete_id', user.id)
    .single();

  if (!reg) throw new Error('Registration not found');

  const { data: payment } = await supabase
    .from('payments')
    .select('id, amount')
    .eq('registration_id', registrationId)
    .eq('status', 'SUCCESS')
    .single();

  if (!payment) throw new Error('No paid payment found');

  const { error } = await supabase.from('refunds').insert({
    payment_id: payment.id,
    registration_id: registrationId,
    amount: payment.amount,
    reason,
    status: 'REFUND_REQUESTED',
  });

  if (error) throw new Error(error.message);
  revalidatePath('/profile', 'page');
}
