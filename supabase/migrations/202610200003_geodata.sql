
create table public.geocam_map_layers (
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(name) between 1 and 150),
 filename text not null,
 source_path text not null unique,
 data jsonb not null check(jsonb_typeof(data)='object' and octet_length(data::text)<=10000000),
 settings jsonb not null default '{}'::jsonb,
 status text not null default 'draft' check(status in ('draft','published')),
 created_at timestamptz not null default now()
);
alter table public.geocam_map_layers enable row level security;
revoke all on public.geocam_map_layers from public,anon,authenticated;
grant select on public.geocam_map_layers to anon;
grant select,insert,update,delete on public.geocam_map_layers to authenticated;
create policy map_public_read on public.geocam_map_layers for select to anon using(status='published');
create policy map_authenticated_read on public.geocam_map_layers for select to authenticated using(status='published' or (select geocam_private.is_admin()));
create policy map_admin_insert on public.geocam_map_layers for insert to authenticated with check((select geocam_private.is_admin()));
create policy map_admin_update on public.geocam_map_layers for update to authenticated using((select geocam_private.is_admin())) with check((select geocam_private.is_admin()));
create policy map_admin_delete on public.geocam_map_layers for delete to authenticated using((select geocam_private.is_admin()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('geocam-geodata','geocam-geodata',false,20971520,array['application/octet-stream','application/vnd.google-earth.kmz','application/vnd.google-earth.kml+xml','application/json','application/geo+json','text/xml','application/xml']);
create policy geodata_public_files on storage.objects for select to anon using(bucket_id='geocam-geodata' and exists(select 1 from public.geocam_map_layers l where l.source_path=name and l.status='published'));
create policy geodata_member_files on storage.objects for select to authenticated using(bucket_id='geocam-geodata' and ((select geocam_private.is_admin()) or exists(select 1 from public.geocam_map_layers l where l.source_path=name and l.status='published')));
create policy geodata_admin_insert on storage.objects for insert to authenticated with check(bucket_id='geocam-geodata' and (select geocam_private.is_admin()));
create policy geodata_admin_delete on storage.objects for delete to authenticated using(bucket_id='geocam-geodata' and (select geocam_private.is_admin()));

