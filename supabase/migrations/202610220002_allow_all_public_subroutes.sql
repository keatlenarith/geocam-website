-- Broaden route regex to allow all public subroutes (e.g. /research/topic, /news/item, /publications/view, /research/tectonics, etc.)

create or replace function public.geocam_update_page_field(p_page text,p_key text,p_entry jsonb)
returns jsonb language plpgsql security invoker set search_path=''
as $$
declare d jsonb; p jsonb; space text; base text; table_name text; content_value jsonb;
begin
 if not geocam_private.is_admin() then raise exception 'Administrator access required' using errcode='42501';end if;
 if p_page !~ '^(/|/(about|research|publications|events|membership|geodata|environmental-monitoring|news|contact|geopark|mining|lexicon|dashboard|articles)(/[a-zA-Z0-9_\-\.]*)*)::(en|km)$' or length(p_key)>512 or length(p_key)=0 then raise exception 'Invalid editable page or field';end if;
 if jsonb_typeof(p_entry)<>'object' or coalesce(p_entry->>'kind','') not in ('text','image') or jsonb_typeof(p_entry->'value') is distinct from 'string' then raise exception 'Invalid field value';end if;
 if octet_length(p_entry::text)>2100000 then raise exception 'Field exceeds size limit';end if;
 if p_entry->>'kind'='image' and (p_entry->>'value') !~ '^(https://|data:image/(png|jpeg|webp|gif);base64,)' then raise exception 'Unsupported image source';end if;
 base:=regexp_replace(p_page,'::(en|km)$','');
 foreach table_name in array array['geocam_drafts','geocam_published'] loop
   execute format('select content from public.%I where id=$1 for update',table_name) into content_value using 'site';
   if content_value is null then raise exception 'Website content not initialized';end if;
   content_value:=jsonb_set(content_value,array[p_page],coalesce(content_value->p_page,'{}'::jsonb)||jsonb_build_object(p_key,p_entry),true);
   if p_entry->>'kind'='image' then
     space:=base||'::en';
     content_value:=jsonb_set(content_value,array[space],coalesce(content_value->space,'{}'::jsonb)||jsonb_build_object(p_key,p_entry),true);
     content_value:=content_value #- array[base||'::km',p_key];
   elsif p_page like '%::en' then
     content_value:=content_value #- array[base||'::km',p_key];
   end if;
   execute format('update public.%I set content=$1,updated_at=now() where id=$2',table_name) using content_value,'site';
   if table_name='geocam_drafts' then d:=content_value; else p:=content_value;end if;
 end loop;
 return jsonb_build_object('draft',d,'published',p);
end $$;
revoke all on function public.geocam_update_page_field(text,text,jsonb) from public,anon;
grant execute on function public.geocam_update_page_field(text,text,jsonb) to authenticated;

create or replace function public.geocam_publish_page_changes(p_changes jsonb)
returns jsonb language plpgsql security invoker set search_path=''
as $$
declare doc jsonb; page_pair record; field_pair record;
begin
 if not geocam_private.is_admin() then raise exception 'Administrator access required' using errcode='42501';end if;
 if p_changes is null or jsonb_typeof(p_changes)<>'object' or octet_length(p_changes::text)>10000000 then raise exception 'Invalid page changes';end if;
 select content into doc from public.geocam_published where id='site' for update;
 if doc is null then raise exception 'Website content not initialized';end if;
 for page_pair in select key,value from jsonb_each(p_changes) loop
  if page_pair.key !~ '^(/|/(about|research|publications|events|membership|geodata|environmental-monitoring|news|contact|geopark|mining|lexicon|dashboard|articles)(/[a-zA-Z0-9_\-\.]*)*)(::(en|km))?$' or jsonb_typeof(page_pair.value)<>'object' then raise exception 'Invalid editable page';end if;
  for field_pair in select key,value from jsonb_each(page_pair.value) loop
   if length(field_pair.key)<1 or length(field_pair.key)>512 then raise exception 'Invalid field';end if;
   if field_pair.value='null'::jsonb then doc:=doc #- array[page_pair.key,field_pair.key];
   else
    if jsonb_typeof(field_pair.value)<>'object' or coalesce(field_pair.value->>'kind','') not in ('text','image') or jsonb_typeof(field_pair.value->'value') is distinct from 'string' or octet_length(field_pair.value::text)>2100000 then raise exception 'Invalid field value';end if;
    doc:=jsonb_set(doc,array[page_pair.key],coalesce(doc->page_pair.key,'{}'::jsonb)||jsonb_build_object(field_pair.key,field_pair.value),true);
   end if;
  end loop;
 end loop;
 update public.geocam_published set content=doc,updated_at=now() where id='site';
 return doc;
end $$;
revoke all on function public.geocam_publish_page_changes(jsonb) from public,anon;
grant execute on function public.geocam_publish_page_changes(jsonb) to authenticated;
