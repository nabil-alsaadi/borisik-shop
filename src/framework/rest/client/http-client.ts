import { Routes } from '@/config/routes';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import type { SearchParamOptions } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 5000000,
  headers: {
    'Content-Type': 'application/json',
    'x-environment': process.env.NEXT_PUBLIC_APPLICATION_MODE
  },
});
// Change request data/error here
Axios.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  console.log('Axios.interceptors.request.use((config) => {',token);
  //@ts-ignore
  
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token ? token : ''}`,
    'x-environment': process.env.NEXT_PUBLIC_APPLICATION_MODE
  };
  return config;
});


let notifyUnauthorized = () => {};

export const setNotifyUnauthorizedHandler = (handler: () => void) => {
  notifyUnauthorized = handler;
};

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403) ||
      (error.response &&
        error.response.data.message === 'PICKBAZAR_ERROR.NOT_AUTHORIZED')
    ) {
      Cookies.remove(AUTH_TOKEN_KEY);

      notifyUnauthorized();
      
      Router.replace(Routes.home);
      const token = Cookies.get(AUTH_TOKEN_KEY);
      console.log('const token = Cookies.get(AUTH_TOKEN_KEY);',token)
    }
    return Promise.reject(error);
  }
);

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    console.log('static async get<T>(url: string, params?: unknown) {',url,params)
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }

  static formatSearchParams(params: Partial<SearchParamOptions>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) =>
        ['type', 'categories', 'tags', 'author', 'manufacturer','shops'].includes(k)
          ? `${k}.slug:${v}`
          : `${k}:${v}`
      )
      .join(';');
  }
}

export function getFormErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.message;
  }
  return null;
}