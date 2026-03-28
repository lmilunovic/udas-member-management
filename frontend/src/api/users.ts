import { UsersApi, Configuration } from './generated';
import type { ApplicationUserRequest } from './generated';

export type { ApplicationUser, ApplicationUserRequest } from './generated';

const api = new UsersApi(
  new Configuration({
    basePath: (import.meta.env.VITE_BACKEND_URL as string | undefined) || '/api/v1',
  })
);

export const usersApi = {
  list: () => api.listUsers().then((res) => res.data),
  get: (id: string) => api.getUser(id).then((res) => res.data),
  create: (data: ApplicationUserRequest) => api.createUser(data).then((res) => res.data),
  update: (id: string, data: ApplicationUserRequest) =>
    api.updateUser(id, data).then((res) => res.data),
  delete: (id: string) => api.deleteUser(id),
  getCurrentUser: () => api.getCurrentUser().then((res) => res.data),
};
