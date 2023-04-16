import { request } from '@/service/request';

export const getDataName = async () => {
  return request.post<DataAuth.Data_name | null>('/getDataName');
}

export const getDataTable = async (data_name: string) => {
	return request.post<object>('/getDataTable', { data_name });
}
