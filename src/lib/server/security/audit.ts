import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function logAuditAction(params: {
  userId?: string;
  action: string;
  module: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createSupabaseAdminClient();

  const { error } = await supabase.from('audit_logs').insert({
    user_id: params.userId || null,
    action: params.action,
    module: params.module,
    metadata: params.metadata || null,
  });

  if (error) console.error('Audit log error:', error);
}

export async function getAuditLogs(options?: {
  userId?: string;
  module?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createSupabaseAdminClient();

  let query = supabase
    .from('audit_logs')
    .select('*, users(email)')
    .order('created_at', { ascending: false })
    .limit(options?.limit || 50);

  if (options?.userId) query = query.eq('user_id', options.userId);
  if (options?.module) query = query.eq('module', options.module);
  if (options?.action) query = query.eq('action', options.action);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 50) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
