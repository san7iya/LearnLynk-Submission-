-- leads table --
create table leads (
  id uuid default gen_random_uuid() primary key,
  tenant_id varchar(4) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  owner_id uuid,
  stage text
);

create index idx_leads_ten_id ON leads (tenant_id);
create index idx_leads_owner_id ON leads (owner_id);
create index idx_leads_stage ON leads (stage);
create index idx_leads_created_at ON leads (created_at);


-- applications table --
create table applications (
  id uuid default gen_random_uuid() primary key,
  tenant_id varchar(4) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  lead_id uuid not null REFERENCES leads(id)
);

create index idx_app_ten_id ON applications (tenant_id);
create index idx_app_lead_id ON applications (lead_id);

-- tasks table --
create table tasks (
  id uuid default gen_random_uuid() primary key,
  tenant_id varchar(4) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  related_id uuid not null REFERENCES applications(id),
  type text NOT NULL CHECK (type IN ('call', 'email', 'review')),
  status text DEFAULT 'pending',
  due_at timestamptz NOT NULL CHECK (due_at >= created_at)
);

create index idx_tasks_tenant_id ON tasks (tenant_id);
create index idx_tasks_due_at ON tasks (due_at);
create index idx_tasks_status ON tasks (status);
