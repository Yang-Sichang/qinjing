-- 琴境 Qinjing / Supabase schema
-- 匿名用户 + 共享语印 + 每个匿名用户每小时最多 3 条

create table if not exists public.yuyin (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section integer not null check (section >= 1 and section <= 100),
  type text not null check (type in ('难点','易错','节奏','指法','意境','我的点评')),
  content text not null check (char_length(trim(content)) between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.yuyin_reports (
  id uuid primary key default gen_random_uuid(),
  yuyin_id uuid not null references public.yuyin(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.yuyin enable row level security;
alter table public.yuyin_reports enable row level security;

create policy "authenticated users can read yuyin"
on public.yuyin for select to authenticated using (true);

revoke insert, update, delete on public.yuyin from anon, authenticated;

create or replace function public.submit_yuyin(
  p_section integer,
  p_type text,
  p_content text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  recent_count integer;
  new_id uuid;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception '请先建立匿名身份';
  end if;

  p_content := trim(p_content);
  if char_length(p_content) = 0 then
    raise exception '语印内容不能为空';
  end if;
  if char_length(p_content) > 500 then
    raise exception '语印最多500字';
  end if;
  if p_section < 1 or p_section > 100 then
    raise exception '章节编号无效';
  end if;
  if p_type not in ('难点','易错','节奏','指法','意境','我的点评') then
    raise exception '语印类型无效';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(current_user_id::text, 0));

  select count(*) into recent_count
  from public.yuyin
  where user_id = current_user_id
    and created_at > now() - interval '1 hour';

  if recent_count >= 3 then
    raise exception 'RATE_LIMIT: 每个用户每小时最多落3印';
  end if;

  insert into public.yuyin (user_id, section, type, content)
  values (current_user_id, p_section, p_type, p_content)
  returning id into new_id;

  return json_build_object(
    'success', true,
    'id', new_id,
    'remaining', greatest(0, 2 - recent_count)
  );
end;
$$;

grant execute on function public.submit_yuyin(integer, text, text) to authenticated;

create index if not exists yuyin_section_created_idx
on public.yuyin(section, created_at desc);

create index if not exists yuyin_user_created_idx
on public.yuyin(user_id, created_at desc);

create policy "authenticated users can report yuyin"
on public.yuyin_reports for insert to authenticated
with check (auth.uid() = reporter_id);

create policy "users can read own reports"
on public.yuyin_reports for select to authenticated
using (auth.uid() = reporter_id);
