import axios from 'axios';
import { Member, MemberCreateRequest, PagedResponse } from './types';

const api = axios.create({
  baseURL: '/api/v1',
});

export interface MemberParams {
  page?: number;
  size?: number;
  sort?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
}

export const membersApi = {
  list: (params: MemberParams = {}) => 
    api.get<PagedResponse<Member>>('/members', { params }).then(res => res.data),
  
  get: (id: string) => 
    api.get<Member>(`/members/${id}`).then(res => res.data),
  
  create: (data: MemberCreateRequest) => 
    api.post<Member>('/members', data).then(res => res.data),
  
  update: (id: string, data: MemberCreateRequest) => 
    api.put<Member>(`/members/${id}`, data).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/members/${id}`),
};
