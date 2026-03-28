import { useState, useCallback } from 'react';

import type { MemberParams } from '../api/members';

export interface MemberFilters {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

const DEFAULT_FILTERS: MemberFilters = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  country: '',
};

const DEFAULT_SORT: SortState = { field: 'id', direction: 'asc' };
const DEFAULT_PAGE_SIZE = 20;

export function useMemberFilters(initialFilters?: Partial<MemberFilters>) {
  const [filters, setFilters] = useState<MemberFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const setFilter = useCallback((key: keyof MemberFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleSetSort = useCallback((field: string) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'asc' };
    });
    setPage(0);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort(DEFAULT_SORT);
    setPage(0);
  }, []);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(0);
  }, []);

  const activeFilterCount = (Object.values(filters) as string[]).filter(
    (v) => v.trim() !== ''
  ).length;

  const toApiParams = useCallback((): MemberParams => {
    const params: MemberParams = {
      page,
      size: pageSize,
      sort: `${sort.field},${sort.direction}`,
    };
    if (filters.firstName.trim()) params.firstName = filters.firstName.trim();
    if (filters.lastName.trim()) params.lastName = filters.lastName.trim();
    if (filters.email.trim()) params.email = filters.email.trim();
    if (filters.phone.trim()) params.phone = filters.phone.trim();
    if (filters.city.trim()) params.city = filters.city.trim();
    if (filters.country.trim()) params.country = filters.country.trim();
    return params;
  }, [filters, sort, page, pageSize]);

  return {
    filters,
    sort,
    page,
    pageSize,
    setFilter,
    setSort: handleSetSort,
    setPage,
    setPageSize: handleSetPageSize,
    resetFilters,
    activeFilterCount,
    toApiParams,
  };
}
