import { act, renderHook } from '@testing-library/react';

import { useMemberFilters } from '../useMemberFilters';

describe('useMemberFilters', () => {
  it('initialises with default state', () => {
    const { result } = renderHook(() => useMemberFilters());
    expect(result.current.filters).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      country: '',
    });
    expect(result.current.sort).toEqual({ field: 'id', direction: 'asc' });
    expect(result.current.page).toBe(0);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('accepts partial initialFilters', () => {
    const { result } = renderHook(() => useMemberFilters({ lastName: 'Smith' }));
    expect(result.current.filters.lastName).toBe('Smith');
    expect(result.current.filters.firstName).toBe('');
  });

  describe('setFilter', () => {
    it('updates the specified filter field', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setFilter('firstName', 'Alice'));
      expect(result.current.filters.firstName).toBe('Alice');
    });

    it('resets page to 0 when filter changes', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setPage(3));
      act(() => result.current.setFilter('firstName', 'Alice'));
      expect(result.current.page).toBe(0);
    });

    it('increments activeFilterCount for each non-empty filter', () => {
      const { result } = renderHook(() => useMemberFilters());
      expect(result.current.activeFilterCount).toBe(0);
      act(() => result.current.setFilter('firstName', 'A'));
      expect(result.current.activeFilterCount).toBe(1);
      act(() => result.current.setFilter('lastName', 'B'));
      expect(result.current.activeFilterCount).toBe(2);
      act(() => result.current.setFilter('email', 'c@c.com'));
      act(() => result.current.setFilter('phone', '123'));
      act(() => result.current.setFilter('city', 'NYC'));
      act(() => result.current.setFilter('country', 'USA'));
      expect(result.current.activeFilterCount).toBe(6);
    });

    it('does not count whitespace-only values as active filters', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setFilter('firstName', '   '));
      expect(result.current.activeFilterCount).toBe(0);
    });
  });

  describe('setSort', () => {
    it('sets the sort field with asc direction by default', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setSort('firstName'));
      expect(result.current.sort).toEqual({ field: 'firstName', direction: 'asc' });
    });

    it('toggles direction when called with the same field', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setSort('firstName'));
      expect(result.current.sort.direction).toBe('asc');
      act(() => result.current.setSort('firstName'));
      expect(result.current.sort.direction).toBe('desc');
      act(() => result.current.setSort('firstName'));
      expect(result.current.sort.direction).toBe('asc');
    });

    it('resets to asc when switching to a different field', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setSort('firstName'));
      act(() => result.current.setSort('firstName')); // now desc
      act(() => result.current.setSort('lastName')); // new field → asc
      expect(result.current.sort).toEqual({ field: 'lastName', direction: 'asc' });
    });

    it('resets page to 0 when sort changes', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setPage(2));
      act(() => result.current.setSort('firstName'));
      expect(result.current.page).toBe(0);
    });
  });

  describe('setPageSize', () => {
    it('updates pageSize and resets page to 0', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setPage(3));
      act(() => result.current.setPageSize(50));
      expect(result.current.pageSize).toBe(50);
      expect(result.current.page).toBe(0);
    });
  });

  describe('resetFilters', () => {
    it('resets all filters, sort, and page to defaults', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => {
        result.current.setFilter('firstName', 'Alice');
        result.current.setFilter('lastName', 'B');
        result.current.setSort('email');
        result.current.setPage(5);
      });
      act(() => result.current.resetFilters());
      expect(result.current.filters.firstName).toBe('');
      expect(result.current.filters.lastName).toBe('');
      expect(result.current.sort).toEqual({ field: 'id', direction: 'asc' });
      expect(result.current.page).toBe(0);
      expect(result.current.activeFilterCount).toBe(0);
    });
  });

  describe('toApiParams', () => {
    it('returns pagination and sort when no filters set', () => {
      const { result } = renderHook(() => useMemberFilters());
      const params = result.current.toApiParams();
      expect(params).toEqual({ page: 0, size: 20, sort: 'id,asc' });
    });

    it('includes active filter values', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => {
        result.current.setFilter('firstName', 'Alice');
        result.current.setFilter('city', 'NYC');
      });
      const params = result.current.toApiParams();
      expect(params.firstName).toBe('Alice');
      expect(params.city).toBe('NYC');
      expect(params.lastName).toBeUndefined();
    });

    it('excludes whitespace-only filter values', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setFilter('firstName', '   '));
      const params = result.current.toApiParams();
      expect(params.firstName).toBeUndefined();
    });

    it('trims filter values', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setFilter('lastName', '  Smith  '));
      const params = result.current.toApiParams();
      expect(params.lastName).toBe('Smith');
    });

    it('reflects current sort', () => {
      const { result } = renderHook(() => useMemberFilters());
      act(() => result.current.setSort('firstName'));
      act(() => result.current.setSort('firstName')); // desc
      expect(result.current.toApiParams().sort).toBe('firstName,desc');
    });
  });
});
