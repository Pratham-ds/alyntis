-- Alyntis Space Passport / gamification persistence.
-- Progress is owned by the authenticated student. XP is awarded only by the
-- SECURITY DEFINER RPC below so the browser cannot choose an arbitrary amount.

create table if not exists public.student_space_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('module','activity','mission','challenge')),
  item_id text not null,
  status text not null default 'completed' check (status in ('in_progress','completed')),
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table if not exists public.student_space_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index if not exists student_space_progress_user_idx on public.student_space_progress(user_id);
create index if not exists student_space_badges_user_idx on public.student_space_badges(user_id);

alter table public.student_space_progress enable row level security;
alter table public.student_space_badges enable row level security;

drop policy if exists "students_read_own_space_progress" on public.student_space_progress;
create policy "students_read_own_space_progress"
on public.student_space_progress for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "students_read_own_space_badges" on public.student_space_badges;
create policy "students_read_own_space_badges"
on public.student_space_badges for select
to authenticated
using (user_id = auth.uid());

-- No direct INSERT/UPDATE/DELETE policies are granted to students. Progress
-- mutations go through the controlled RPC so XP cannot be supplied by a client.

create or replace function public.complete_space_item(p_item_type text, p_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  reward integer;
  existing public.student_space_progress;
  total_xp integer;
  mission_count integer;
  badge_count integer;
  new_badges text[] := '{}';
  required_items text[];
  badge text;
begin
  if uid is null then
    raise exception 'Authentication required';
  end if;

  reward := case p_item_type
    when 'module' then 50
    when 'activity' then 100
    when 'mission' then 150
    when 'challenge' then 100
    else null
  end;

  if reward is null then
    raise exception 'Invalid space item type';
  end if;

  -- Allow-list the current Phase 4 content. Future CMS content can extend this
  -- list deliberately rather than accepting arbitrary client-created rewards.
  if p_item_type = 'module' and p_item_id not in
    ('astronomy','rocket-engineering','mars-rover','satellite-engineering','space-communication','moon-base','earth-observation','ai-space') then
    raise exception 'Unknown space module';
  end if;
  if p_item_type = 'activity' and p_item_id not in
    ('astronomy','rocket-engineering','mars-rover','satellite-engineering','space-communication','moon-base','earth-observation','ai-space') then
    raise exception 'Unknown space activity';
  end if;
  if p_item_type = 'mission' and p_item_id not in
    ('mission-01','mission-02','mission-03','mission-04','mission-05','mission-06','mission-07','mission-08') then
    raise exception 'Unknown space mission';
  end if;
  if p_item_type = 'challenge' and p_item_id not in
    ('astronomy','rocket-engineering','mars-rover','satellite-engineering','space-communication','moon-base','earth-observation','ai-space','mission-01','mission-02','mission-03','mission-04','mission-05','mission-06','mission-07','mission-08') then
    raise exception 'Unknown space challenge';
  end if;

  select * into existing
  from public.student_space_progress
  where user_id = uid and item_type = p_item_type and item_id = p_item_id;

  if existing.id is null then
    insert into public.student_space_progress(user_id,item_type,item_id,status,xp_awarded,completed_at)
    values (uid,p_item_type,p_item_id,'completed',reward,now());
  elsif existing.status <> 'completed' then
    update public.student_space_progress
    set status='completed', xp_awarded=reward, completed_at=now(), updated_at=now()
    where id=existing.id;
  end if;

  -- Badge requirements are deliberately derived from persisted completions.
  -- They cannot be unlocked by inserting a badge row from the browser.
  for badge, required_items in
    select * from (values
      ('rocket-engineer', array['module:rocket-engineering','activity:rocket-engineering']),
      ('mars-explorer', array['module:mars-rover','mission:mission-01']),
      ('rover-engineer', array['module:mars-rover','activity:mars-rover']),
      ('satellite-engineer', array['module:satellite-engineering','activity:satellite-engineering']),
      ('communications-engineer', array['module:space-communication','activity:space-communication']),
      ('lunar-scientist', array['module:moon-base','activity:moon-base']),
      ('space-ai-engineer', array['module:ai-space','activity:ai-space']),
      ('earth-observation-scientist', array['module:earth-observation','activity:earth-observation']),
      ('astronomer', array['module:astronomy','activity:astronomy'])
    ) as b(badge, required_items)
  loop
    if not exists (select 1 from public.student_space_badges where user_id=uid and badge_id=badge)
       and (select count(*) from unnest(required_items) req
            where exists (
              select 1 from public.student_space_progress p
              where p.user_id=uid
                and (p.item_type || ':' || p.item_id)=req
                and p.status='completed')) = cardinality(required_items)
    then
      insert into public.student_space_badges(user_id,badge_id) values(uid,badge);
      new_badges := array_append(new_badges,badge);
    end if;
  end loop;

  select coalesce(sum(xp_awarded),0), count(*) filter (where item_type='mission' and status='completed')
    into total_xp, mission_count
  from public.student_space_progress where user_id=uid;

  select count(*) into badge_count from public.student_space_badges where user_id=uid;

  return jsonb_build_object(
    'xp', total_xp,
    'missions_completed', mission_count,
    'badges', badge_count,
    'new_badges', to_jsonb(new_badges)
  );
end;
$$;

revoke all on function public.complete_space_item(text,text) from public, anon;
grant execute on function public.complete_space_item(text,text) to authenticated;
