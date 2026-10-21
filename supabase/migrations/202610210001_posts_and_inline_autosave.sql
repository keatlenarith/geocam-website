
create table public.geocam_post_drafts (
 id uuid primary key default gen_random_uuid(),
 data jsonb not null check(jsonb_typeof(data)='object' and octet_length(data::text)<=2000000),
 updated_at timestamptz not null default now()
);
create table public.geocam_post_public (
 id uuid primary key,
 data jsonb not null check(jsonb_typeof(data)='object' and octet_length(data::text)<=2000000),
 updated_at timestamptz not null default now()
);
alter table public.geocam_post_drafts enable row level security;
alter table public.geocam_post_public enable row level security;
revoke all on public.geocam_post_drafts,public.geocam_post_public from public,anon,authenticated;
grant select,insert,update,delete on public.geocam_post_drafts,public.geocam_post_public to authenticated;
grant select on public.geocam_post_public to anon;
create policy post_drafts_admin on public.geocam_post_drafts for all to authenticated using((select geocam_private.is_admin())) with check((select geocam_private.is_admin()));
create policy posts_public_read on public.geocam_post_public for select to anon,authenticated using(true);
create policy posts_admin_insert on public.geocam_post_public for insert to authenticated with check((select geocam_private.is_admin()));
create policy posts_admin_update on public.geocam_post_public for update to authenticated using((select geocam_private.is_admin())) with check((select geocam_private.is_admin()));
create policy posts_admin_delete on public.geocam_post_public for delete to authenticated using((select geocam_private.is_admin()));

create function public.geocam_update_page_field(p_page text,p_key text,p_entry jsonb)
returns jsonb language plpgsql security invoker set search_path=''
as $$
declare d jsonb; p jsonb;
begin
 if not geocam_private.is_admin() then raise exception 'Administrator access required' using errcode='42501';end if;
 if p_page !~ '^(/|/about|/research|/membership|/contact)::(en|km)$' or length(p_key)>512 or length(p_key)=0 then raise exception 'Invalid editable page or field';end if;
 if jsonb_typeof(p_entry)<>'object' or coalesce(p_entry->>'kind','') not in ('text','image') or jsonb_typeof(p_entry->'value') is distinct from 'string' then raise exception 'Invalid field value';end if;
 if octet_length(p_entry::text)>2100000 then raise exception 'Field exceeds size limit';end if;
 if p_entry->>'kind'='image' and (p_entry->>'value') !~ '^(https://|data:image/(png|jpeg|webp|gif);base64,)' then raise exception 'Unsupported image source';end if;
 update public.geocam_drafts set content=jsonb_set(content,array[p_page],coalesce(content->p_page,'{}'::jsonb)||jsonb_build_object(p_key,p_entry),true),updated_at=now() where id='site' returning content into d;
 update public.geocam_published set content=jsonb_set(content,array[p_page],coalesce(content->p_page,'{}'::jsonb)||jsonb_build_object(p_key,p_entry),true),updated_at=now() where id='site' returning content into p;
 if d is null or p is null then raise exception 'Website content not initialized';end if;
 return jsonb_build_object('draft',d,'published',p);
end $$;
revoke all on function public.geocam_update_page_field(text,text,jsonb) from public,anon;
grant execute on function public.geocam_update_page_field(text,text,jsonb) to authenticated;

