import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

import { type ApplicationUserRequest, type UserRole } from '../../api/types';
import { usersApi } from '../../api/users';

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  READ_ONLY: 'Can view member records',
  READ_WRITE: 'Can create, edit, and delete members',
  ADMIN: 'Full access including user management',
};

function FormSkeleton() {
  return (
    <div className="max-w-lg space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-7 w-28" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-10 rounded-md" />
        <Skeleton className="h-10 rounded-md" />
        <Skeleton className="h-10 rounded-md" />
      </div>
    </div>
  );
}

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ApplicationUserRequest>({
    email: '',
    role: 'READ_ONLY' as UserRole,
    active: true,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.get(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        role: user.role,
        active: user.active,
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: isEdit
      ? (data: ApplicationUserRequest) => usersApi.update(id!, data)
      : usersApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isEdit && isLoadingUser) return <FormSkeleton />;

  return (
    <div className="max-w-lg animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/users" aria-label="Back to users">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? 'Edit User' : 'New User'}
          </h1>
          <p className="text-sm text-muted-foreground">Manage user access and permissions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
            placeholder="user@example.com"
            disabled={isEdit}
          />
          {isEdit && (
            <p className="text-xs text-muted-foreground">Email cannot be changed after creation</p>
          )}
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">
            Role <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.role}
            onValueChange={(v) => setForm((prev) => ({ ...prev, role: v as UserRole }))}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="READ_ONLY">READ_ONLY</SelectItem>
              <SelectItem value="READ_WRITE">READ_WRITE</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
          {form.role && (
            <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[form.role]}</p>
          )}
        </div>

        {/* Active switch */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="active">Account Status</Label>
          <div className="flex items-center gap-3 h-10">
            <Switch
              id="active"
              checked={form.active ?? true}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
            />
            <span className="text-sm text-muted-foreground">
              {form.active ? 'Account is active' : 'Account is disabled'}
            </span>
          </div>
        </div>

        {/* Error state */}
        {mutation.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3">
            <AlertCircle size={16} className="shrink-0" />
            <span>Failed to save user. Please check the form and try again.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {isEdit ? 'Update User' : 'Create User'}
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/users')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
