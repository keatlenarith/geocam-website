create table public.geocam_shared_posters (
 id text primary key check (id ~ '^[a-f0-9]{64}$'),
 image text not null,
 caption text not null,
 event_id text not null,
 created_at timestamptz not null default now()
);
alter table public.geocam_shared_posters enable row level security;
revoke all on public.geocam_shared_posters from public, anon, authenticated;
create function public.geocam_get_shared_poster(p_id text) returns jsonb
language sql stable security definer set search_path = ''
as $$ select jsonb_build_object('image',image,'caption',caption,'eventId',event_id)
from public.geocam_shared_posters where id=p_id and p_id ~ '^[a-f0-9]{64}$' $$;
create function public.geocam_save_shared_poster(p_id text,p_image text,p_caption text,p_event_id text) returns void
language plpgsql security definer set search_path = ''
as $$
declare png bytea;
begin
 if p_id is null or p_image is null or p_caption is null or p_event_id is null
 or length(p_image)>4000000 or length(p_caption)>12000 or length(p_event_id)>300
 or length(trim(p_caption))=0 or length(p_event_id)=0
 or p_id !~ '^[a-f0-9]{64}$' or p_image !~ '^[A-Za-z0-9+/=]+$'
 then raise exception 'Invalid poster snapshot'; end if;
 png := decode(p_image,'base64');
 if length(png)<24 or substring(png from 1 for 8) <> decode('89504e470d0a1a0a','hex')
 or substring(png from 17 for 8) <> decode('000004b000000276','hex')
 or encode(extensions.digest(png || convert_to(p_caption,'UTF8') || convert_to(p_event_id,'UTF8'),'sha256'),'hex') <> p_id
 then raise exception 'Invalid poster PNG or identifier'; end if;
 if exists(select 1 from public.geocam_shared_posters where id=p_id) then return; end if;
 perform pg_advisory_xact_lock(20261031,630);
 if (select count(*) from public.geocam_shared_posters where created_at > now()-interval '1 hour') >= 50
 or (select coalesce(sum(octet_length(image)),0) from public.geocam_shared_posters)+octet_length(p_image)>67108864
 then raise exception 'Poster snapshot capacity reached'; end if;
 insert into public.geocam_shared_posters(id,image,caption,event_id)
 values(p_id,p_image,p_caption,p_event_id) on conflict(id) do nothing;
end;
$$;
revoke all on function public.geocam_get_shared_poster(text) from public;
revoke all on function public.geocam_save_shared_poster(text,text,text,text) from public;
grant execute on function public.geocam_get_shared_poster(text) to anon,authenticated;
grant execute on function public.geocam_save_shared_poster(text,text,text,text) to anon,authenticated;
