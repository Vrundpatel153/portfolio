-- Create a bucket for resume storage
insert into storage.buckets (id, name, public)
values ('resume', 'resume', true)
on conflict (id) do nothing;

-- Set up storage policies for resume bucket
create policy "Resume is publicly accessible"
  on storage.objects for select
  using (bucket_id = 'resume');

create policy "Resume can be updated by authenticated users"
  on storage.objects for insert
  with check (
    bucket_id = 'resume' AND
    auth.role() = 'authenticated'
  );

create policy "Resume can be updated by authenticated users"
  on storage.objects for update
  using (
    bucket_id = 'resume' AND
    auth.role() = 'authenticated'
  );

create policy "Resume can be deleted by authenticated users"
  on storage.objects for delete
  using (
    bucket_id = 'resume' AND
    auth.role() = 'authenticated'
  ); 