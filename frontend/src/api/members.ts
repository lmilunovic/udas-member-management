import { MembersApi, Configuration } from './generated';
import type { Member } from './generated';

export type { Member, PagedMember } from './generated';

const api = new MembersApi(
  new Configuration({
    basePath: (import.meta.env.VITE_BACKEND_URL as string | undefined) || '/api/v1',
  })
);

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
    api
      .listMembers(
        params.firstName,
        params.lastName,
        params.email,
        params.phone,
        params.city,
        params.country,
        params.page,
        params.size,
        params.sort
      )
      .then((res) => res.data),
  get: (id: string) => api.getMember(id).then((res) => res.data),
  create: (data: Member) => api.createMember(data).then((res) => res.data),
  update: (id: string, data: Member) => api.updateMember(id, data).then((res) => res.data),
  delete: (id: string) => api.deleteMember(id),
};
