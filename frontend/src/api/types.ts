export interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string[];
  phone?: string[];
  dateOfBirth?: string;
  dateOfDeath?: string;
  ssn?: string;
  address?: Address;
}

export interface MemberCreateRequest {
  firstName: string;
  lastName: string;
  email: string[];
  phone?: string[];
  dateOfBirth?: string;
  dateOfDeath?: string;
  ssn?: string;
  address?: Address;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type UserRole = 'READ_ONLY' | 'READ_WRITE' | 'ADMIN';

export interface ApplicationUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface ApplicationUserRequest {
  email: string;
  role: UserRole;
  active?: boolean;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
