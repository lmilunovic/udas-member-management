import { http, HttpResponse } from 'msw';

import type { ApplicationUser, Member } from '../api/types';

export const adminUser: ApplicationUser = {
  id: '1',
  email: 'admin@test.com',
  name: 'Admin User',
  role: 'ADMIN',
  active: true,
  createdAt: '2024-01-01T00:00:00Z',
};

export const readOnlyUser: ApplicationUser = {
  id: '2',
  email: 'readonly@test.com',
  name: 'Read Only User',
  role: 'READ_ONLY',
  active: true,
  createdAt: '2024-01-01T00:00:00Z',
};

export const sampleMember: Member = {
  id: '101',
  firstName: 'Jane',
  lastName: 'Doe',
  email: ['jane.doe@example.com'],
  phone: ['123456789'],
  address: { street: '1 Main St', city: 'Springfield', postalCode: '12345', country: 'USA' },
};

export const sampleMember2: Member = {
  id: '102',
  firstName: 'John',
  lastName: 'Smith',
  email: ['john.smith@example.com'],
  phone: [],
  address: {},
};

export const handlers = [
  // Current user
  http.get('/api/v1/users/me', () => HttpResponse.json(adminUser)),

  // Members list
  http.get('/api/v1/members', () =>
    HttpResponse.json({
      content: [sampleMember, sampleMember2],
      totalElements: 2,
      totalPages: 1,
      page: 0,
      size: 20,
    })
  ),

  // Single member
  http.get('/api/v1/members/:id', ({ params }) => {
    if (params.id === sampleMember.id) return HttpResponse.json(sampleMember);
    if (params.id === sampleMember2.id) return HttpResponse.json(sampleMember2);
    return HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),

  // Create member
  http.post('/api/v1/members', async ({ request }) => {
    const body = (await request.json()) as Member;
    return HttpResponse.json({ id: '999', ...body }, { status: 201 });
  }),

  // Update member
  http.put('/api/v1/members/:id', async ({ request, params }) => {
    const body = (await request.json()) as Member;
    return HttpResponse.json({ id: params.id as string, ...body });
  }),

  // Delete member
  http.delete('/api/v1/members/:id', () => new HttpResponse(null, { status: 204 })),

  // Users list
  http.get('/api/v1/users', () =>
    HttpResponse.json({
      content: [adminUser, readOnlyUser],
      totalElements: 2,
      totalPages: 1,
      page: 0,
      size: 20,
    })
  ),

  // Single user
  http.get('/api/v1/users/:id', ({ params }) => {
    if (params.id === adminUser.id) return HttpResponse.json(adminUser);
    if (params.id === readOnlyUser.id) return HttpResponse.json(readOnlyUser);
    return HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),

  // Create user
  http.post('/api/v1/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '999', ...(body as object) }, { status: 201 });
  }),

  // Update user
  http.put('/api/v1/users/:id', async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({ id: params.id as string, ...(body as object) });
  }),

  // Delete user
  http.delete('/api/v1/users/:id', () => new HttpResponse(null, { status: 204 })),
];
