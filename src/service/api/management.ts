import { request } from '../request';

/** 获取用户列表 */
export function fetchUserList() {
  return request.post<object>('/getUserList');
}

export function deleteUser(user_name: string) {
  return request.post<ApiAuth.UserFlag>('/deleteUser', { user_name });
}

export function deleteUsers(user_names: string[]) {
  return request.post<ApiAuth.UserFlag>('/deleteUsers', { user_names });
}

export function editUser(user_name: string, model: object) {
  return request.post<ApiAuth.UserFlag>('/editUser', { user_name, model });
}

export function fetchUser(user_name: string) {
  return request.post<object>('/searchUser', { user_name });
}

export function fetchSelf() {
  return request.post<object>('/getSelfInfo');
}

export function changeUserInfo(userInfo: object) {
  return request.post<ApiAuth.UserFlag>('/changeUserInfo', { userInfo });
}
