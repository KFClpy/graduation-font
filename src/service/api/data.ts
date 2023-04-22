import { request } from '@/service/request';

export const getDataName = async () => {
  return request.post<DataAuth.Data_name | null>('/getDataName');
};

export const getDataTable = async (data_name: string) => {
  return request.post<object>('/getDataTable', { data_name });
};
export function autoFuzzyJoin(data_name_left: string, data_name_right: string, data_name_generate: string) {
  return request.post<ApiAuth.UserFlag>('/autoFuzzyJoin', { data_name_left, data_name_right, data_name_generate });
}

export function deleteOneData(tid: number) {
  return request.post<ApiAuth.UserFlag>('/deleteOneData', { tid });
}

export function editOneData(tid: number, data: object) {
  return request.post<ApiAuth.UserFlag>('/editOneData', { tid, data });
}

export function getDataInfo(){
  return request.post<object>('/getDataInfo');
}

export function deleteDataInfo(data_name: string) {
  return request.post<ApiAuth.UserFlag>('/deleteDataInfo', { data_name });
}

export function getColumnInfo(data_name: string) {
  return request.post<object>('/getColumnInfo', { data_name });
}

export function deleteOneColumn(data_name: string, column_id: string) {
	return request.post<ApiAuth.UserFlag>('/deleteOneColumn', { data_name, column_id });
}
