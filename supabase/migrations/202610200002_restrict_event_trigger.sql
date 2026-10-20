-- The platform event trigger remains active; browser roles cannot invoke it.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
