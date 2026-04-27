-- Local dev seed for the reader portal.
-- Run with: supabase db reset (applies migrations + seed)

insert into public.readers (email, source, consent_marketing)
values
  ('reader.one@example.com', 'portal', true),
  ('reader.two@example.com', 'recovery', false)
on conflict (email) do nothing;

insert into public.responses
  (reader_email, first_name, city, role_context, reading_status, question_id, response_text, consent_publish, approved_for_site, source)
values
  ('reader.one@example.com', 'Maya', 'Brooklyn', 'ER nurse',
   'finished', 'default',
   'The kitchen line — about the morning the kitchen went quiet — that was me last March. Read it twice.',
   true, true, 'portal'),
  ('reader.two@example.com', 'Devon', 'Austin', 'recovery program director',
   'mid_book', 'default',
   'I''m reading this slowly because I keep stopping to text people lines.',
   true, false, 'portal');
