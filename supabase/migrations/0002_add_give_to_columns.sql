-- Adds the conversational follow-up columns captured by the response form:
--   give_to     — "If you could give this chapter to anyone, who would
--                  you give it to?"
--   give_to_why — the animated follow-up "Why them?"

alter table public.responses
  add column if not exists give_to     text,
  add column if not exists give_to_why text;
