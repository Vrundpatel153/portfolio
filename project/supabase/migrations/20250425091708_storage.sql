-- Enable storage if not already enabled
create extension if not exists "uuid-ossp";

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update their own avatar"
  on storage.objects for update
  using ( bucket_id = 'avatars' )
  with check ( bucket_id = 'avatars' );

create policy "Anyone can delete their own avatar"
  on storage.objects for delete
  using ( bucket_id = 'avatars' ); 