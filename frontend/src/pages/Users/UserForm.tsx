import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(['users', 'common']);

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
          <Link to="/users" aria-label={t('users:form.backAriaLabel')}>
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? t('users:form.titleEdit') : t('users:form.titleNew')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('users:form.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">
            {t('users:form.fields.email')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
            placeholder={t('users:form.fields.emailPlaceholder')}
            disabled={isEdit}
          />
          {isEdit && (
            <p className="text-xs text-muted-foreground">{t('users:form.fields.emailReadOnly')}</p>
          )}
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">
            {t('users:form.fields.role')} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.role}
            onValueChange={(v) => setForm((prev) => ({ ...prev, role: v as UserRole }))}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder={t('users:form.fields.rolePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="READ_ONLY">READ_ONLY</SelectItem>
              <SelectItem value="READ_WRITE">READ_WRITE</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
          {form.role && (
            <p className="text-xs text-muted-foreground">{t(`users:form.roles.${form.role}`)}</p>
          )}
        </div>

        {/* Active switch */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="active">{t('users:form.fields.accountStatus')}</Label>
          <div className="flex items-center gap-3 h-10">
            <Switch
              id="active"
              checked={form.active ?? true}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
            />
            <span className="text-sm text-muted-foreground">
              {form.active
                ? t('users:form.fields.accountActive')
                : t('users:form.fields.accountDisabled')}
            </span>
          </div>
        </div>

        {/* Error state */}
        {mutation.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3">
            <AlertCircle size={16} className="shrink-0" />
            <span>{t('users:form.error')}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {t('common:saving')}
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {isEdit ? t('users:form.updateButton') : t('users:form.createButton')}
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/users')}>
            {t('common:cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
