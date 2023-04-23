import { request } from '@/service/request';
export function getPreprocessor() {
  return request.post<DataAuth.Preprocessor>('/getPreprocessor');
}

export function getTokenizer() {
  return request.post<DataAuth.Tokenizer>('/getTokenizer');
}

export function getDistanceFunction() {
  return request.post<DataAuth.DistanceFunction>('/getDistanceFunction');
}
