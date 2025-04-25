-- Update user_profiles policies
drop policy if exists "Users can view their own profile" on user_profiles;
create policy "Anyone can view admin profile"
  on user_profiles
  for select
  using (true);

-- Update skills policies
drop policy if exists "Public can view skills" on skills;
create policy "Anyone can view skills"
  on skills
  for select
  using (true);

-- Update projects policies
drop policy if exists "Public can view projects" on projects;
create policy "Anyone can view projects"
  on projects
  for select
  using (true);

-- Update certifications policies
drop policy if exists "Public can view certifications" on certifications;
create policy "Anyone can view certifications"
  on certifications
  for select
  using (true);

-- Update storage policies for avatars
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Update storage policies for skill icons
drop policy if exists "Skill icons are publicly accessible" on storage.objects;
create policy "Skill icons are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'skill-icons');

-- Update storage policies for project images
drop policy if exists "Project images are publicly accessible" on storage.objects;
create policy "Project images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'project-images'); 