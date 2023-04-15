import { request } from '@/service/request';

export const getDataName = async () => {
  return request.post<DataAuth.Data_name | null>('/getDataName');
}
