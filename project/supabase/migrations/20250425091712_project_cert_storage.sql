-- Create storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Create storage bucket for certification images
insert into storage.buckets (id, name, public)
values ('certification-images', 'certification-images', true)
on conflict (id) do nothing;

-- Set up remaining policies for project images
create policy "Authenticated users can upload project images"
  on storage.objects for insert
  with check ( bucket_id = 'project-images' AND auth.role() = 'authenticated' );

create policy "Authenticated users can update project images"
  on storage.objects for update
  using ( bucket_id = 'project-images' AND auth.role() = 'authenticated' )
  with check ( bucket_id = 'project-images' AND auth.role() = 'authenticated' );

create policy "Authenticated users can delete project images"
  on storage.objects for delete
  using ( bucket_id = 'project-images' AND auth.role() = 'authenticated' );

-- Set up policies for certification images
create policy "Certification images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'certification-images' );

create policy "Authenticated users can upload certification images"
  on storage.objects for insert
  with check ( bucket_id = 'certification-images' AND auth.role() = 'authenticated' );

create policy "Authenticated users can update certification images"
  on storage.objects for update
  using ( bucket_id = 'certification-images' AND auth.role() = 'authenticated' )
  with check ( bucket_id = 'certification-images' AND auth.role() = 'authenticated' );

create policy "Authenticated users can delete certification images"
  on storage.objects for delete
  using ( bucket_id = 'certification-images' AND auth.role() = 'authenticated' ); 