import { apiPath } from '../config/env';
const baseFetch = (url: string, options: any) => {
  return fetch(`${apiPath}${url}`, options)
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => {
      throw new Error(err);
    });
};
type Options = {
  data?: { [key: string]: any };
  [prop: string]: any;
};
export const $fetch = {
  get: (url: string, options: Options = {}) => {
    const { data } = options;
    const params: string[] = [];
    if (data) {
      for (const key in data) {
        params.push(`${key}=${encodeURIComponent(data[key])}`);
      }
      url += `?${params.join('&')}`;
    }
    return baseFetch(url, { ...options, method: 'GET' });
  },
  post: (url: string, options: Options = {}) => {
    const { data = {} } = options;
    return baseFetch(url, { ...options, method: 'POST', body: data });
  },
};
