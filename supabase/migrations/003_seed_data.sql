-- Time Track v2: Seed Data

-- Note: The ROOT user (nithyananthanimalan@gmail.com) is created via Supabase Auth dashboard
-- This migration seeds reference data only.

-- Payment Gateways
INSERT INTO payment_gateways (name, is_enabled, config) VALUES
  ('Billplz', TRUE, '{"collection_id": ""}'::jsonb),
  ('ToyyibPay', TRUE, '{"user_secret": "", "category_code": ""}'::jsonb),
  ('Stripe', TRUE, '{"publishable_key": "", "secret_key": ""}'::jsonb),
  ('Manual', TRUE, '{"bank_name": "Maybank", "account_number": "1234567890", "account_name": "Time Track Sdn Bhd"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Notification Templates
INSERT INTO notification_templates (type, subject, content_html) VALUES
  (
    'registration_confirmation',
    'Registration Confirmed - {{event_name}}',
    '<div style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:40px;text-align:center"><div style="max-width:480px;margin:0 auto"><div style="background:#ccff00;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px"><span style="color:#000;font-weight:900;font-size:20px">TT</span></div><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:8px">Registration Confirmed!</h1><p style="color:#a1a1a1;font-size:14px;margin-bottom:24px">You''re registered for <strong style="color:#fff">{{event_name}}</strong></p><div style="background:#1a1a1a;border-radius:16px;padding:24px;margin-bottom:24px"><p style="font-size:12px;color:#a1a1a1;text-transform:uppercase;letter-spacing:0.1em;font-weight:700">Registration #{{registration_number}}</p><p style="font-size:14px;color:#fff;font-weight:700">{{participant_name}}</p><p style="font-size:12px;color:#a1a1a1">{{event_date}}</p></div><a href="{{dashboard_url}}" style="display:inline-block;background:#ccff00;color:#000;padding:16px 32px;border-radius:999px;font-weight:900;font-size:14px;text-transform:uppercase;text-decoration:none">View Dashboard</a></div></div>'
  ),
  (
    'payment_success',
    'Payment Received - {{event_name}}',
    '<div style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:40px;text-align:center"><div style="max-width:480px;margin:0 auto"><div style="background:#ccff00;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px"><span style="color:#000;font-weight:900;font-size:20px">TT</span></div><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:8px">Payment Successful!</h1><p style="color:#a1a1a1;font-size:14px;margin-bottom:24px">Your payment of <strong style="color:#ccff00">RM{{amount}}</strong> for {{event_name}} has been received.</p><a href="{{invoice_url}}" style="display:inline-block;background:#ccff00;color:#000;padding:16px 32px;border-radius:999px;font-weight:900;font-size:14px;text-transform:uppercase;text-decoration:none">Download Invoice</a></div></div>'
  ),
  (
    'payment_failed',
    'Payment Failed - {{event_name}}',
    '<div style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:40px;text-align:center"><div style="max-width:480px;margin:0 auto"><div style="background:#ef4444;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px"><span style="color:#fff;font-weight:900;font-size:20px">!</span></div><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:8px">Payment Failed</h1><p style="color:#a1a1a1;font-size:14px;margin-bottom:24px">Your payment of <strong style="color:#fff">RM{{amount}}</strong> for {{event_name}} could not be processed. Please try again.</p><a href="{{retry_url}}" style="display:inline-block;background:#ccff00;color:#000;padding:16px 32px;border-radius:999px;font-weight:900;font-size:14px;text-transform:uppercase;text-decoration:none">Retry Payment</a></div></div>'
  ),
  (
    'result_available',
    'Results Published - {{event_name}}',
    '<div style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:40px;text-align:center"><div style="max-width:480px;margin:0 auto"><div style="background:#ccff00;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px"><span style="color:#000;font-weight:900;font-size:20px">TT</span></div><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:8px">Results Are In!</h1><p style="color:#a1a1a1;font-size:14px;margin-bottom:24px">Your results for <strong style="color:#fff">{{event_name}}</strong> are now available.</p><p style="font-size:32px;font-weight:900;color:#ccff00">{{overall_rank}}</p><p style="font-size:12px;color:#a1a1a1;text-transform:uppercase;letter-spacing:0.1em">Overall Rank</p><a href="{{results_url}}" style="display:inline-block;background:#ccff00;color:#000;padding:16px 32px;border-radius:999px;font-weight:900;font-size:14px;text-transform:uppercase;text-decoration:none;margin-top:24px">View Results</a></div></div>'
  ),
  (
    'certificate_available',
    'Your Certificate is Ready - {{event_name}}',
    '<div style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:40px;text-align:center"><div style="max-width:480px;margin:0 auto"><div style="background:#ccff00;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px"><span style="color:#000;font-weight:900;font-size:20px">TT</span></div><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:8px">Certificate Ready!</h1><p style="color:#a1a1a1;font-size:14px;margin-bottom:24px">Your certificate for <strong style="color:#fff">{{event_name}}</strong> is ready to download.</p><a href="{{certificate_url}}" style="display:inline-block;background:#ccff00;color:#000;padding:16px 32px;border-radius:999px;font-weight:900;font-size:14px;text-transform:uppercase;text-decoration:none">Download Certificate</a></div></div>'
  ),
  (
    'event_reminder',
    'Reminder: {{event_name}} is Tomorrow!',
    '<div style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:40px;text-align:center"><div style="max-width:480px;margin:0 auto"><div style="background:#ccff00;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px"><span style="color:#000;font-weight:900;font-size:20px">TT</span></div><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:8px">Race Day Tomorrow!</h1><p style="color:#a1a1a1;font-size:14px;margin-bottom:24px"><strong style="color:#fff">{{event_name}}</strong> is happening tomorrow at {{venue_name}}.</p><div style="background:#1a1a1a;border-radius:16px;padding:24px;margin-bottom:24px"><p style="font-size:12px;color:#a1a1a1;text-transform:uppercase;letter-spacing:0.1em">Date & Time</p><p style="font-size:16px;color:#fff;font-weight:700">{{event_date}}</p><p style="font-size:12px;color:#a1a1a1;margin-top:12px;text-transform:uppercase;letter-spacing:0.1em">Location</p><p style="font-size:14px;color:#fff">{{address}}</p></div><p style="font-size:12px;color:#a1a1a1">Don''t forget your bib and IC!</p></div></div>'
  )
ON CONFLICT (type) DO NOTHING;

-- Default Form Templates
INSERT INTO form_templates (name, description, is_system, fields) VALUES
  (
    'Standard Registration',
    'Default registration form for all events',
    TRUE,
    '[
      {"id":"full_name","type":"TEXT","label":"Full Name","required":true,"placeholder":"Enter your full name"},
      {"id":"ic_passport","type":"TEXT","label":"IC/Passport Number","required":true,"placeholder":"Enter IC or passport number"},
      {"id":"gender","type":"RADIO","label":"Gender","required":true,"options":[{"label":"Male","value":"MALE"},{"label":"Female","value":"FEMALE"}]},
      {"id":"dob","type":"DATE","label":"Date of Birth","required":true},
      {"id":"email","type":"EMAIL","label":"Email","required":true,"placeholder":"your@email.com"},
      {"id":"phone","type":"PHONE","label":"Phone Number","required":true,"placeholder":"+60XXXXXXXXX"},
      {"id":"address","type":"TEXT","label":"Address","required":false,"placeholder":"Your home address"},
      {"id":"country","type":"DROPDOWN","label":"Country","required":true,"options":[{"label":"Malaysia","value":"Malaysia"},{"label":"Singapore","value":"Singapore"},{"label":"Indonesia","value":"Indonesia"},{"label":"Thailand","value":"Thailand"},{"label":"Other","value":"Other"}]},
      {"id":"emergency_name","type":"TEXT","label":"Emergency Contact Name","required":true,"placeholder":"Emergency contact person"},
      {"id":"emergency_phone","type":"PHONE","label":"Emergency Contact Phone","required":true,"placeholder":"Emergency phone number"},
      {"id":"medical_status","type":"CHECKBOX","label":"Do you have any medical conditions we should know about?","required":false},
      {"id":"medical_details","type":"TEXT","label":"Medical Details","required":false,"placeholder":"Please describe any medical conditions"}
    ]'::jsonb
  ),
  (
    'Simple Registration',
    'Minimal registration form for free/community events',
    TRUE,
    '[
      {"id":"full_name","type":"TEXT","label":"Full Name","required":true,"placeholder":"Enter your full name"},
      {"id":"ic_passport","type":"TEXT","label":"IC/Passport Number","required":true,"placeholder":"Enter IC or passport number"},
      {"id":"email","type":"EMAIL","label":"Email","required":true,"placeholder":"your@email.com"},
      {"id":"phone","type":"PHONE","label":"Phone Number","required":true,"placeholder":"+60XXXXXXXXX"}
    ]'::jsonb
  )
ON CONFLICT (name) DO NOTHING;
