create function public.geocam_update_fonts(p_english text,p_khmer text,p_publish boolean default false)
returns jsonb language plpgsql security invoker set search_path=''
as $$
declare fonts jsonb; d jsonb; p jsonb;
begin
 if not geocam_private.is_admin() then raise exception 'Administrator access required' using errcode='42501';end if;
 if p_english is null or p_english not in ('times','georgia','arial','inter','lora') or p_khmer is null or p_khmer not in ('noto-sans-khmer','battambang','siemreap','kantumruy-pro') then raise exception 'Choose a supported English and Khmer font';end if;
 fonts:=jsonb_build_object('englishFont',jsonb_build_object('kind','text','value',p_english),'khmerFont',jsonb_build_object('kind','text','value',p_khmer));
 update public.geocam_drafts set content=jsonb_set(content,array['__appearance'],fonts,true),updated_at=now() where id='site' returning content into d;
 if p_publish then
 update public.geocam_published set content=jsonb_set(content,array['__appearance'],fonts,true),updated_at=now() where id='site' returning content into p;
 else select content into p from public.geocam_published where id='site';end if;
 if d is null or p is null then raise exception 'Website content not initialized';end if;
 return jsonb_build_object('draft',d,'published',p);
end $$;
revoke all on function public.geocam_update_fonts(text,text,boolean) from public,anon;
grant execute on function public.geocam_update_fonts(text,text,boolean) to authenticated;
