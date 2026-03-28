import { SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MemberFilters } from '@/hooks/useMemberFilters';
import { cn } from '@/lib/utils';

interface MemberFilterPanelProps {
  filters: MemberFilters;
  activeFilterCount: number;
  onFilterChange: (key: keyof MemberFilters, value: string) => void;
  onReset: () => void;
}

const FILTER_FIELDS: { key: keyof MemberFilters; label: string; placeholder: string }[] = [
  { key: 'firstName', label: 'First Name', placeholder: 'Search by first name...' },
  { key: 'lastName', label: 'Last Name', placeholder: 'Search by last name...' },
  { key: 'email', label: 'Email', placeholder: 'Search by email...' },
  { key: 'phone', label: 'Phone', placeholder: 'Search by phone...' },
  { key: 'city', label: 'City', placeholder: 'Search by city...' },
  { key: 'country', label: 'Country', placeholder: 'Search by country...' },
];

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id: string;
}

function DebouncedInput({ value, onChange, placeholder, id }: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local state when external value is reset
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <div className="relative">
      <Input
        id={id}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pr-8"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function MemberFilterPanel({
  filters,
  activeFilterCount,
  onFilterChange,
  onReset,
}: MemberFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header row — always visible */}
      <div className="flex items-center justify-between px-4 py-3 bg-card">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="h-5 text-xs px-1.5 py-0">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs px-2">
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen((o) => !o)}
            className="h-7 w-7"
            aria-label={isOpen ? 'Collapse filters' : 'Expand filters'}
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      {/* Filter grid */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4 border-t border-border bg-muted/30">
          {FILTER_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={`filter-${key}`} className="text-xs text-muted-foreground">
                {label}
              </Label>
              <DebouncedInput
                id={`filter-${key}`}
                value={filters[key]}
                onChange={(value) => onFilterChange(key, value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
