import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    return true;
  }
  
  return false;
}

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract IP for rate limiting
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      req.headers.get('x-real-ip') || 
                      'unknown';

    // Check rate limit
    if (isRateLimited(ipAddress)) {
      console.warn('Rate limit exceeded for IP:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { variation_id, event_type, event_data, session_id } = await req.json();

    if (!variation_id || !event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: variation_id and event_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate UUID format for variation_id
    if (!isValidUUID(variation_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid variation_id format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate event type
    if (!['impression', 'click', 'conversion'].includes(event_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid event_type. Must be impression, click, or conversion' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify variation exists before inserting
    const { data: variation, error: varError } = await supabase
      .from('widget_variations')
      .select('id')
      .eq('id', variation_id)
      .maybeSingle();

    if (varError || !variation) {
      console.warn('Invalid variation_id:', variation_id);
      return new Response(
        JSON.stringify({ error: 'Invalid variation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize session_id
    const sanitizedSessionId = typeof session_id === 'string' ? session_id.slice(0, 100) : '';

    // Validate event_data size (prevent large payloads)
    const eventDataStr = JSON.stringify(event_data || {});
    if (eventDataStr.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Event data too large' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract user agent (truncated for storage)
    const userAgent = (req.headers.get('user-agent') || '').slice(0, 500);

    // Anonymize IP by removing last octet for privacy
    const anonymizedIp = ipAddress !== 'unknown' 
      ? ipAddress.replace(/\.\d+$/, '.0')
      : '';

    // Insert metric
    const { data, error } = await supabase
      .from('ab_test_metrics')
      .insert({
        variation_id,
        event_type,
        event_data: event_data || {},
        session_id: sanitizedSessionId,
        user_agent: userAgent,
        ip_address: anonymizedIp
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error tracking event:', error);
    // Return generic error message to clients
    return new Response(
      JSON.stringify({ error: 'Failed to track event. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});