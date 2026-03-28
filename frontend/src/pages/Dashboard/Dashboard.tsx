import { useQuery } from '@tanstack/react-query';
import { Users, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

import { membersApi } from '../../api/members';

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: countData, isLoading: isCountLoading } = useQuery({
    queryKey: ['members-count'],
    queryFn: () => membersApi.list({ size: 1 }),
  });

  const { data: recentData, isLoading: isRecentLoading } = useQuery({
    queryKey: ['members-recent'],
    queryFn: () => membersApi.list({ size: 5, sort: 'id,desc' }),
  });

  const isLoading = isCountLoading || isRecentLoading;

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  if (isLoading) return <DashboardSkeleton />;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/members?lastName=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/members');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6">
        {/* Total members card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users size={18} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Members</p>
          </div>
          <p className="text-4xl font-bold tracking-tighter text-foreground">
            {countData?.totalElements ?? 0}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Registered in the system</p>
        </div>

        {/* Quick search card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Search size={18} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Quick Search</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Last name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-sm"
            />
            <Button type="submit" size="sm" variant="outline">
              Go
            </Button>
          </form>
        </div>

        {/* Browse members card */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
          <p className="text-sm font-medium text-muted-foreground mb-4">Browse</p>
          <p className="text-sm text-foreground mb-4 flex-1">
            View and filter all members using the advanced search panel.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/members">View all members</Link>
          </Button>
        </div>
      </div>

      {/* Recent members */}
      {recentData && recentData.content.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recently Added
          </h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {recentData.content.map((member, index) => (
              <Link
                key={member.id}
                to={`/members/${member.id}/edit`}
                className={`flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors ${
                  index > 0 ? 'border-t border-border' : ''
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                  {getInitials(member.firstName, member.lastName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {member.firstName} {member.lastName}
                  </p>
                  {member.email?.[0] && (
                    <p className="text-xs text-muted-foreground truncate">{member.email[0]}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
