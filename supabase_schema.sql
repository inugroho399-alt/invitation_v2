-- Create the RSVPs table
create table rsvps (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  group_name text,
  whatsapp text,
  attendance text not null,
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table rsvps enable row level security;

-- Create policy to allow anyone to insert RSVPs (anonymous guest registration)
create policy "Allow anonymous inserts" on rsvps
  for insert with check (true);

-- Create policy to allow anyone to read RSVPs (display comments publicly)
create policy "Allow anonymous reads" on rsvps
  for select using (true);

-- Enable Realtime for live comment updates
alter publication supabase_realtime add table rsvps;
