import { request } from '../request';

/** 获取用户列表 */
export function fetchUserList() {
  return request.post<object>('/getUserList');
}

export function deleteUser(user_name: string) {
  return request.post<ApiAuth.UserFlag>('/deleteUser', { user_name });
}
