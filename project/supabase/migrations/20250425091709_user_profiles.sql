-- Create user_profiles table
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text,
  bio text,
  avatar_url text,
  location text,
  website_url text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  constraint user_profiles_user_id_key unique (user_id)
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.user_profiles
  for select using (
    auth.uid() = user_id
  );

create policy "Users can insert their own profile"
  on public.user_profiles
  for insert with check (
    auth.uid() = user_id
  );

create policy "Users can update their own profile"
  on public.user_profiles
  for update using (
    auth.uid() = user_id
  );

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 