do $$
declare tab text; doc jsonb; page_pair record; field_pair record; english_space text;
begin
 foreach tab in array array['geocam_drafts','geocam_published'] loop
  execute format('select content from public.%I where id=$1 for update',tab) into doc using 'site';
  for page_pair in select key,value from jsonb_each(doc) where key like '%::km' loop
   english_space:=regexp_replace(page_pair.key,'::km$','::en');
   for field_pair in select key,value from jsonb_each(page_pair.value) where value->>'kind'='image' loop
    doc:=jsonb_set(doc,array[english_space],coalesce(doc->english_space,'{}'::jsonb)||jsonb_build_object(field_pair.key,field_pair.value),true);
   end loop;
  end loop;
  for page_pair in select key,value from jsonb_each(doc) where key like '%::en' loop
   for field_pair in select key,value from jsonb_each(page_pair.value) where value->>'kind'='image' loop
    doc:=jsonb_set(doc,array[regexp_replace(page_pair.key,'::en$','::km')],coalesce(doc->regexp_replace(page_pair.key,'::en$','::km'),'{}'::jsonb)||jsonb_build_object(field_pair.key,field_pair.value),true);
   end loop;
  end loop;
  execute format('update public.%I set content=$1,updated_at=now() where id=$2',tab) using doc,'site';
 end loop;
end $$;
