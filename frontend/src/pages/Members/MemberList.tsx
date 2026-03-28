import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Users,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

import { MemberFilterPanel } from '@/components/members/MemberFilterPanel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemberFilters } from '@/hooks/useMemberFilters';

import type { Member } from '../../api/members';
import { membersApi } from '../../api/members';

const columnHelper = createColumnHelper<Member>();

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-t border-border">
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-40" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-20" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function MemberList() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const { t } = useTranslation(['members', 'common']);

  const initialLastName = searchParams.get('lastName') ?? '';

  const {
    filters,
    sort,
    page,
    pageSize,
    setFilter,
    setSort,
    setPage,
    setPageSize,
    resetFilters,
    activeFilterCount,
    toApiParams,
  } = useMemberFilters({ lastName: initialLastName });

  // Sync sort state to TanStack Table
  const [sorting, setSorting] = useState<SortingState>([
    { id: sort.field, desc: sort.direction === 'desc' },
  ]);

  // When TanStack Table sorting changes, propagate to our hook
  const handleSortingChange = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(next);
    if (next.length > 0) {
      const { id } = next[0];
      setSort(id);
      if (sort.field !== id) {
        // setSort resets to asc for new fields — sync table to match
        setSorting([{ id, desc: false }]);
      }
    }
  };

  // Keep TanStack sorting state in sync with hook
  useEffect(() => {
    setSorting([{ id: sort.field, desc: sort.direction === 'desc' }]);
  }, [sort]);

  const apiParams = toApiParams();

  const { data, isLoading } = useQuery({
    queryKey: ['members', apiParams],
    queryFn: () => membersApi.list(apiParams),
  });

  const deleteMutation = useMutation({
    mutationFn: membersApi.delete,
    onSuccess: () => {
      setMemberToDelete(null);
      void queryClient.invalidateQueries({ queryKey: ['members'] });
      void queryClient.invalidateQueries({ queryKey: ['members-count'] });
      void queryClient.invalidateQueries({ queryKey: ['members-recent'] });
    },
  });

  const columns = [
    columnHelper.accessor('firstName', {
      header: t('members:table.firstName'),
      enableSorting: true,
    }),
    columnHelper.accessor('lastName', {
      header: t('members:table.lastName'),
      enableSorting: true,
    }),
    columnHelper.accessor('email', {
      header: t('members:table.email'),
      cell: (info) => {
        const emails = info.getValue();
        return emails?.[0] ?? <span className="text-muted-foreground">—</span>;
      },
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      header: t('members:table.actions'),
      cell: (info) => {
        const member = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/members/${member.id}/edit`}>{t('common:edit')}</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setMemberToDelete(member)}>
              {t('common:delete')}
            </Button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;
  const startItem = totalElements === 0 ? 0 : page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('members:title')}</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('members:records', { count: totalElements })}
            </p>
          )}
        </div>
        <Button asChild>
          <Link to="/members/new">
            <Plus size={16} className="mr-2" />
            {t('members:addMember')}
          </Link>
        </Button>
      </div>

      {/* Filter panel */}
      <MemberFilterPanel
        filters={filters}
        activeFilterCount={activeFilterCount}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-muted-foreground"
                  >
                    {header.column.getCanSort() ? (
                      <button
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="transition-opacity opacity-40 group-hover:opacity-70">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ArrowDown size={14} />
                          ) : (
                            <ArrowUpDown size={14} />
                          )}
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {isLoading ? (
              <TableSkeleton />
            ) : data?.content.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users size={40} className="text-muted-foreground/40" />
                    <p className="font-medium">{t('members:empty.title')}</p>
                    <p className="text-sm text-muted-foreground">
                      {activeFilterCount > 0
                        ? t('members:empty.withFilters')
                        : t('members:empty.noData')}
                    </p>
                    {activeFilterCount > 0 && (
                      <Button variant="outline" size="sm" onClick={resetFilters} className="mt-1">
                        {t('members:empty.clearFilters')}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && totalElements > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t('members:pagination.showing', {
              start: startItem,
              end: endItem,
              total: totalElements,
            })}
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage(0)}
              aria-label={t('members:pagination.firstPage')}
            >
              <ChevronsLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              aria-label={t('members:pagination.previousPage')}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm px-3 min-w-[6rem] text-center">
              {t('members:pagination.page', { page: page + 1, totalPages })}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              aria-label={t('members:pagination.nextPage')}
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
              aria-label={t('members:pagination.lastPage')}
            >
              <ChevronsRight size={16} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t('members:pagination.rowsPerPage')}
            </span>
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={memberToDelete !== null}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('members:deleteDialog.title')}</DialogTitle>
            <DialogDescription asChild>
              <span
                dangerouslySetInnerHTML={{
                  __html: t('members:deleteDialog.confirm', {
                    firstName: memberToDelete?.firstName ?? '',
                    lastName: memberToDelete?.lastName ?? '',
                  }),
                }}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setMemberToDelete(null)}>
              {t('members:deleteDialog.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => memberToDelete?.id && deleteMutation.mutate(memberToDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? t('members:deleteDialog.deleting')
                : t('members:deleteDialog.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
