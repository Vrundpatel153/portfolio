-- Create storage bucket for skill icons
insert into storage.buckets (id, name, public)
values ('skill-icons', 'skill-icons', true)
on conflict (id) do nothing;

-- Set up storage policies for skill icons
create policy "Skill icons are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'skill-icons' );

create policy "Authenticated users can upload skill icons"
  on storage.objects for insert
  with check ( bucket_id = 'skill-icons' AND auth.role() = 'authenticated' );

create policy "Authenticated users can update skill icons"
  on storage.objects for update
  using ( bucket_id = 'skill-icons' AND auth.role() = 'authenticated' )
  with check ( bucket_id = 'skill-icons' AND auth.role() = 'authenticated' );

create policy "Authenticated users can delete skill icons"
  on storage.objects for delete
  using ( bucket_id = 'skill-icons' AND auth.role() = 'authenticated' );

-- Modify skills table to use icon_url instead of icon
alter table skills rename column icon to icon_url;
comment on column skills.icon_url is 'URL to the skill icon image'; 