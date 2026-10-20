
create schema if not exists geocam_private;
revoke all on schema geocam_private from public;
create table geocam_private.admin_emails (email text primary key check (email=lower(email)));
insert into geocam_private.admin_emails(email) values ('keatlenarith@gmail.com');
alter table geocam_private.admin_emails enable row level security;
revoke all on geocam_private.admin_emails from public, anon, authenticated;

-- Private lookup needs access to auth.users; never trusts editable JWT user_metadata.
create function geocam_private.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
 select exists (
   select 1 from auth.users u
   join geocam_private.admin_emails a on a.email=lower(u.email)
   where u.id=(select auth.uid()) and u.email_confirmed_at is not null
 );
$$;
revoke all on function geocam_private.is_admin() from public;
grant usage on schema geocam_private to authenticated;
grant execute on function geocam_private.is_admin() to authenticated;

create function public.geocam_is_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$ select geocam_private.is_admin(); $$;
revoke all on function public.geocam_is_admin() from public, anon;
grant execute on function public.geocam_is_admin() to authenticated;

create table public.geocam_drafts (
 id text primary key check(id='site'),
 content jsonb not null default '{}'::jsonb check(jsonb_typeof(content)='object' and octet_length(content::text)<=10000000),
 updated_at timestamptz not null default now()
);
create table public.geocam_published (
 id text primary key check(id='site'),
 content jsonb not null default '{}'::jsonb check(jsonb_typeof(content)='object' and octet_length(content::text)<=10000000),
 updated_at timestamptz not null default now()
);
alter table public.geocam_drafts enable row level security;
alter table public.geocam_published enable row level security;
revoke all on public.geocam_drafts, public.geocam_published from public, anon, authenticated;
grant select,insert,update on public.geocam_drafts, public.geocam_published to authenticated;
grant select on public.geocam_published to anon;
create policy admin_draft_read on public.geocam_drafts for select to authenticated using ((select geocam_private.is_admin()));
create policy admin_draft_insert on public.geocam_drafts for insert to authenticated with check ((select geocam_private.is_admin()));
create policy admin_draft_update on public.geocam_drafts for update to authenticated using ((select geocam_private.is_admin())) with check ((select geocam_private.is_admin()));
create policy published_read on public.geocam_published for select to anon,authenticated using (true);
create policy admin_publish_insert on public.geocam_published for insert to authenticated with check ((select geocam_private.is_admin()));
create policy admin_publish_update on public.geocam_published for update to authenticated using ((select geocam_private.is_admin())) with check ((select geocam_private.is_admin()));
insert into public.geocam_drafts(id) values('site');
insert into public.geocam_published(id) values('site');

