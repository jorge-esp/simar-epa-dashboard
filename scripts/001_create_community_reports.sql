-- Create community_reports table
create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  user_name text,
  report_type text not null check (report_type in ('condiciones_mar', 'visibilidad', 'seguridad', 'actividad_portuaria', 'otro')),
  description text not null,
  location text,
  severity text not null check (severity in ('info', 'precaucion', 'alerta')),
  created_at timestamptz not null default now(),
  confirmations integer not null default 0,
  status text not null default 'activo' check (status in ('activo', 'resuelto', 'desactualizado'))
);

-- Enable Row Level Security
alter table public.community_reports enable row level security;

-- Policy: Anyone can read reports
create policy "community_reports_select_all"
  on public.community_reports for select
  using (true);

-- Policy: Anyone can insert reports (anonymous or with name)
create policy "community_reports_insert_all"
  on public.community_reports for insert
  with check (true);

-- Policy: Anyone can update confirmations count
create policy "community_reports_update_confirmations"
  on public.community_reports for update
  using (true)
  with check (true);

-- Create index for faster queries
create index if not exists community_reports_created_at_idx on public.community_reports(created_at desc);
create index if not exists community_reports_status_idx on public.community_reports(status);
create index if not exists community_reports_report_type_idx on public.community_reports(report_type);

-- Function to automatically mark old reports as outdated
create or replace function mark_old_reports_outdated()
returns void
language plpgsql
as $$
begin
  update public.community_reports
  set status = 'desactualizado'
  where status = 'activo'
    and created_at < now() - interval '12 hours';
end;
$$;
