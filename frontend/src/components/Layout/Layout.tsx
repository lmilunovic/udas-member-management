import { LogOut, LayoutDashboard, Users, UserCog } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { useAuth } from '../../hooks/useAuth';
import { LanguageSwitcher } from '../LanguageSwitcher';

function roleBadgeVariant(role: string) {
  if (role === 'ADMIN') return 'accent' as const;
  if (role === 'READ_WRITE') return 'default' as const;
  return 'secondary' as const;
}

function getInitials(name: string | undefined) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function LayoutSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-14 border-b border-border bg-card px-6 flex items-center gap-6">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <div className="ml-auto">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </main>
    </div>
  );
}

export default function Layout() {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation('layout');

  if (isLoading) return <LayoutSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  const navItems = [
    { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/members', label: t('nav.members'), icon: Users },
    ...(user?.role === 'ADMIN' ? [{ path: '/users', label: t('nav.users'), icon: UserCog }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-6">
          <Link to="/" className="text-base font-semibold tracking-tight text-foreground shrink-0">
            UDAS
          </Link>
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                  {getInitials(user.name)}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <Badge variant={roleBadgeVariant(user.role)} className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('userMenu.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
