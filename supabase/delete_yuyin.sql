-- 琴境：允许匿名用户删除自己发布的语印
-- 仅删除 auth.uid() 所属记录，其他用户无法删除。

drop function if exists public.delete_yuyin(uuid);

create or replace function public.delete_yuyin(p_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  deleted_id uuid;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception '请先建立匿名身份';
  end if;

  delete from public.yuyin
  where id = p_id and user_id = current_user_id
  returning id into deleted_id;

  if deleted_id is null then
    return json_build_object('success', false, 'message', '只能删除自己的语印');
  end if;

  return json_build_object('success', true, 'id', deleted_id);
end;
$$;

grant execute on function public.delete_yuyin(uuid) to authenticated;
