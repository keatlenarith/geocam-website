create function public.geocam_publish_page_changes(p_changes jsonb)
returns jsonb language plpgsql security invoker set search_path=''
as $$
declare doc jsonb; page_pair record; field_pair record;
begin
 if not geocam_private.is_admin() then raise exception 'Administrator access required' using errcode='42501';end if;
 if p_changes is null or jsonb_typeof(p_changes)<>'object' or octet_length(p_changes::text)>10000000 then raise exception 'Invalid page changes';end if;
 select content into doc from public.geocam_published where id='site' for update;
 if doc is null then raise exception 'Website content not initialized';end if;
 for page_pair in select key,value from jsonb_each(p_changes) loop
  if page_pair.key !~ '^(/|/about|/research|/publications|/events|/membership|/geodata|/environmental-monitoring|/news|/contact|/geopark|/mining|/lexicon|/dashboard)(::(en|km))?$' or jsonb_typeof(page_pair.value)<>'object' then raise exception 'Invalid editable page';end if;
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
