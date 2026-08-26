'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Columns,
  CheckSquare,
  Square,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '../../lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  hideable?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T | string;
  pageSize?: number;
  actions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  filterOptions?: FilterOption[];
  filterKey?: keyof T | string;
  exportFilename?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  bulkActions?: (selectedItems: T[], clearSelection: () => void) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data = [],
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKey,
  pageSize = 10,
  actions,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your search or filters.',
  onRowClick,
  filterOptions,
  filterKey,
  exportFilename = 'export_data',
  selectable = false,
  onSelectionChange,
  bulkActions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(pageSize);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(handler);
  }, [search]);

  // 1. Filter by Status/Category Pill
  const filteredByOption = useMemo(() => {
    if (!filterKey || activeFilter === 'ALL') return data;
    return data.filter((item) => {
      const val = item[filterKey as string];
      return String(val).toUpperCase() === activeFilter.toUpperCase();
    });
  }, [data, filterKey, activeFilter]);

  // 2. Search Filter
  const searchedData = useMemo(() => {
    if (!debouncedSearch.trim()) return filteredByOption;
    const term = debouncedSearch.toLowerCase();

    return filteredByOption.filter((item) => {
      if (searchKey) {
        const val = item[searchKey as string];
        return val ? String(val).toLowerCase().includes(term) : false;
      }
      return Object.values(item).some((val) =>
        val !== null && val !== undefined
          ? String(val).toLowerCase().includes(term)
          : false,
      );
    });
  }, [filteredByOption, debouncedSearch, searchKey]);

  // 3. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return searchedData;

    return [...searchedData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortOrder === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [searchedData, sortKey, sortOrder]);

  // 4. Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return sortedData.slice(start, start + limit);
  }, [sortedData, currentPage, limit]);

  // Handle Sort Toggle
  const handleSort = (key?: keyof T | string) => {
    if (!key) return;
    const k = String(key);
    if (sortKey === k) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(k);
      setSortOrder('asc');
    }
  };

  // Row Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      const newSelected = new Set(
        paginatedData.map((item, idx) => item.id || String(idx)),
      );
      setSelectedIds(newSelected);
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectedItemsList = useMemo(() => {
    return data.filter((item, idx) => selectedIds.has(item.id || String(idx)));
  }, [data, selectedIds]);

  useEffect(() => {
    onSelectionChange?.(selectedItemsList);
  }, [selectedItemsList, onSelectionChange]);

  // CSV Export
  const handleExportCSV = () => {
    if (!data.length) return;
    const exportColumns = columns.filter(
      (c) => c.accessorKey && !hiddenColumns.has(String(c.accessorKey)),
    );
    const headers = exportColumns.map((c) => c.header).join(',');
    const rows = sortedData.map((item) =>
      exportColumns
        .map((c) => {
          const val = item[c.accessorKey as string];
          if (val === null || val === undefined) return '""';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(','),
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFilename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleColumns = useMemo(() => {
    return columns.filter(
      (c) => !c.accessorKey || !hiddenColumns.has(String(c.accessorKey)),
    );
  }, [columns, hiddenColumns]);

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Search & Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {searchable && (
            <div className="relative w-full sm:w-72">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                className="py-1.5 text-xs rounded-xl"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {filterOptions && filterOptions.length > 0 && (
            <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
                  activeFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
                )}
              >
                All ({data.length})
              </button>
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap',
                    activeFilter === opt.value
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
                  )}
                >
                  {opt.label} {typeof opt.count === 'number' && `(${opt.count})`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Column Vis, Export, Extra Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {data.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export
            </Button>
          )}

          {actions}
        </div>
      </div>

      {/* Contextual Bulk Action Bar */}
      {selectable && selectedIds.size > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between gap-4 animate-fade-in text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {selectedIds.size} Selected
            </Badge>
            <span className="text-slate-600 dark:text-slate-300">
              of {totalItems} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            {bulkActions?.(selectedItemsList, () => setSelectedIds(new Set()))}
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/50">
                {selectable && (
                  <th className="p-3.5 w-10 text-center">
                    <button
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {selectedIds.size === paginatedData.length && paginatedData.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                )}

                {visibleColumns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => col.sortable && handleSort(col.accessorKey)}
                    className={cn(
                      'p-3.5 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] select-none',
                      col.sortable ? 'cursor-pointer hover:text-slate-900 dark:hover:text-slate-100' : '',
                      col.className,
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="flex flex-col">
                          {sortKey === col.accessorKey ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            )
                          ) : (
                            <ChevronUp className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                Array.from({ length: limit }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {selectable && (
                      <td className="p-3.5 text-center">
                        <Skeleton className="w-4 h-4 mx-auto rounded" />
                      </td>
                    )}
                    {visibleColumns.map((_, cIdx) => (
                      <td key={cIdx} className="p-3.5">
                        <Skeleton
                          className={cn(
                            'h-4',
                            cIdx === 0 ? 'w-28' : cIdx === 1 ? 'w-40' : 'w-20',
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                    className="p-8 text-center"
                  >
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      actionText={search || activeFilter !== 'ALL' ? 'Clear Filters' : undefined}
                      onAction={() => {
                        setSearch('');
                        setActiveFilter('ALL');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rIdx) => {
                  const itemId = item.id || String(rIdx);
                  const isSelected = selectedIds.has(itemId);
                  return (
                    <tr
                      key={itemId}
                      onClick={() => onRowClick?.(item)}
                      className={cn(
                        'transition-colors duration-150',
                        isSelected
                          ? 'bg-blue-50/50 dark:bg-blue-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40',
                        onRowClick ? 'cursor-pointer' : '',
                      )}
                    >
                      {selectable && (
                        <td
                          className="p-3.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectItem(itemId);
                          }}
                        >
                          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      )}

                      {visibleColumns.map((col, cIdx) => (
                        <td key={cIdx} className={cn('p-3.5 text-slate-800 dark:text-slate-200', col.className)}>
                          {col.cell
                            ? col.cell(item)
                            : col.accessorKey
                            ? String(item[col.accessorKey as string] ?? '—')
                            : null}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Toolbar */}
        {!isLoading && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 gap-3 bg-slate-50/50 dark:bg-slate-950/30">
            {/* Page Size & Count */}
            <div className="flex items-center gap-3">
              <span>
                Showing <span className="font-bold text-slate-800 dark:text-slate-200">{(currentPage - 1) * limit + 1}</span> to{' '}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Math.min(currentPage * limit, totalItems)}
                </span>{' '}
                of <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span> entries
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">Rows:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Prev
              </Button>

              <span className="px-2 font-semibold text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="xs"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
