import { request } from '@/service/request';

export function uploadFile(form: FormData) {
  return request.post<ApiAuth.UserFlag>('/uploadFile', form);
}
