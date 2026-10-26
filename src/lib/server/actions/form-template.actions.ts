'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'PHONE', 'DROPDOWN', 'CHECKBOX', 'RADIO', 'DATE']),
  label: z.string().min(1),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

const formTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
});

export async function createFormTemplateAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const fieldsJson = formData.get('fields') as string;
  const fields = fieldsJson ? JSON.parse(fieldsJson) : [];

  const parsed = formTemplateSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    fields,
  });

  const { error } = await supabase.from('form_templates').insert({
    ...parsed,
    organizer_id: user.id,
    is_system: false,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/organizer/dashboard', 'page');
}

export async function updateFormTemplateAction(templateId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const fieldsJson = formData.get('fields') as string;
  const fields = fieldsJson ? JSON.parse(fieldsJson) : [];

  const parsed = formTemplateSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    fields,
  });

  const { error } = await supabase
    .from('form_templates')
    .update(parsed)
    .eq('id', templateId)
    .eq('organizer_id', user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/organizer/dashboard', 'page');
}

export async function deleteFormTemplateAction(templateId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('form_templates')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', templateId)
    .eq('organizer_id', user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/organizer/dashboard', 'page');
}
