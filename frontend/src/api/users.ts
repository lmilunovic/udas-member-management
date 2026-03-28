import axios from 'axios';
import { ApplicationUser, ApplicationUserRequest, PagedResponse } from './types';

const api = axios.create({
  baseURL: '/api/v1',
});

export const usersApi = {
  list: () => 
    api.get<PagedResponse<ApplicationUser>>('/users').then(res => res.data),
  
  get: (id: string) => 
    api.get<ApplicationUser>(`/users/${id}`).then(res => res.data),
  
  create: (data: ApplicationUserRequest) => 
    api.post<ApplicationUser>('/users', data).then(res => res.data),
  
  update: (id: string, data: ApplicationUserRequest) => 
    api.put<ApplicationUser>(`/users/${id}`, data).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/users/${id}`),
  
  getCurrentUser: () => 
    api.get('/users/me').then(res => res.data),
};
