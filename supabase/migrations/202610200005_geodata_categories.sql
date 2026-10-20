alter table public.geocam_map_layers add column category text not null default 'other'
check(category in ('geology','faults','trends','minerals','geosites','potential-zones','other'));
