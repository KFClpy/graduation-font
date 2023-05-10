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

export function addOneData(data: object, data_name: string) {
  return request.post<ApiAuth.UserFlag>('/addOneData', { data, data_name });
}

export function getDataInfo() {
  return request.post<object>('/getDataInfo');
}

export function searchSomeData(data_type:string,data_value:string,data_name:string){
  return request.post<object>('/searchSomeData',{data_type,data_value,data_name});
}

export function addOneColumn(data_name: string, column_name: string, default_value: string) {
  return request.post<ApiAuth.UserFlag>('/addOneColumn', { data_name, column_name, default_value });
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

export function editOneColumn(data_name: string, column_id: string, new_column_name: string) {
  return request.post<ApiAuth.UserFlag>('/editOneColumn', { data_name, column_id, new_column_name });
}

// eslint-disable-next-line max-params
export function manualFuzzyJoin(
  data_name_left: string,
  data_name_right: string,
  data_name_generate: string,
  config: string
) {
  return request.post<ApiAuth.UserFlag>('/manualFuzzyJoin', {
    data_name_left,
    data_name_right,
    data_name_generate,
    config
  });
}
