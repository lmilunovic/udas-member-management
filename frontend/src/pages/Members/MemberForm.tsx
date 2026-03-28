import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { membersApi } from '../../api/members';
import type { Address, MemberCreateRequest } from '../../api/types';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

function FormField({ label, children, required, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div>
          <Skeleton className="h-7 w-36 mb-1" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-4 w-16" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function MemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation(['members', 'common']);

  const [form, setForm] = useState<MemberCreateRequest>({
    firstName: '',
    lastName: '',
    email: [],
    phone: [],
    address: {},
  });

  const { data: member, isLoading: isLoadingMember } = useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.get(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (member) {
      setForm({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone ?? [],
        dateOfBirth: member.dateOfBirth,
        dateOfDeath: member.dateOfDeath,
        ssn: member.ssn,
        address: member.address ?? {},
      });
    }
  }, [member]);

  const mutation = useMutation({
    mutationFn: isEdit
      ? (data: MemberCreateRequest) => membersApi.update(id!, data)
      : membersApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['members'] });
      void queryClient.invalidateQueries({ queryKey: ['members-count'] });
      void queryClient.invalidateQueries({ queryKey: ['members-recent'] });
      navigate('/members');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleChange = <K extends keyof MemberCreateRequest>(
    field: K,
    value: MemberCreateRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value || undefined },
    }));
  };

  if (isEdit && isLoadingMember) return <FormSkeleton />;

  return (
    <div className="max-w-3xl animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/members" aria-label={t('members:form.backAriaLabel')}>
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? t('members:form.titleEdit') : t('members:form.titleNew')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('members:form.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section: Identity */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('members:form.sections.identity')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={t('members:form.fields.firstName')} required>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
                placeholder={t('members:form.fields.firstNamePlaceholder')}
              />
            </FormField>
            <FormField label={t('members:form.fields.lastName')} required>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
                placeholder={t('members:form.fields.lastNamePlaceholder')}
              />
            </FormField>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Section: Contact */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('members:form.sections.contact')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={t('members:form.fields.email')}>
              <Input
                id="email"
                type="email"
                value={form.email[0] ?? ''}
                onChange={(e) => handleChange('email', e.target.value ? [e.target.value] : [])}
                placeholder={t('members:form.fields.emailPlaceholder')}
              />
            </FormField>
            <FormField label={t('members:form.fields.phone')}>
              <Input
                id="phone"
                type="tel"
                value={form.phone?.[0] ?? ''}
                onChange={(e) => handleChange('phone', e.target.value ? [e.target.value] : [])}
                placeholder={t('members:form.fields.phonePlaceholder')}
              />
            </FormField>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Section: Personal Details */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('members:form.sections.personalDetails')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label={t('members:form.fields.dateOfBirth')}>
              <Input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth ?? ''}
                onChange={(e) => handleChange('dateOfBirth', e.target.value || undefined)}
              />
            </FormField>
            <FormField label={t('members:form.fields.dateOfDeath')}>
              <Input
                id="dateOfDeath"
                type="date"
                value={form.dateOfDeath ?? ''}
                onChange={(e) => handleChange('dateOfDeath', e.target.value || undefined)}
              />
            </FormField>
            <FormField label={t('members:form.fields.ssn')}>
              <Input
                id="ssn"
                value={form.ssn ?? ''}
                onChange={(e) => handleChange('ssn', e.target.value || undefined)}
                placeholder={t('members:form.fields.ssnPlaceholder')}
              />
            </FormField>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Section: Address */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('members:form.sections.address')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={t('members:form.fields.street')} className="sm:col-span-2">
              <Input
                id="street"
                value={form.address?.street ?? ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder={t('members:form.fields.streetPlaceholder')}
              />
            </FormField>
            <FormField label={t('members:form.fields.city')}>
              <Input
                id="city"
                value={form.address?.city ?? ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder={t('members:form.fields.cityPlaceholder')}
              />
            </FormField>
            <FormField label={t('members:form.fields.postalCode')}>
              <Input
                id="postalCode"
                value={form.address?.postalCode ?? ''}
                onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                placeholder={t('members:form.fields.postalCodePlaceholder')}
              />
            </FormField>
            <FormField label={t('members:form.fields.country')} className="sm:col-span-2">
              <Input
                id="country"
                value={form.address?.country ?? ''}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                placeholder={t('members:form.fields.countryPlaceholder')}
              />
            </FormField>
          </div>
        </section>

        {/* Error state */}
        {mutation.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3 mt-6">
            <AlertCircle size={16} className="shrink-0" />
            <span>{t('members:form.error')}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-6">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {t('common:saving')}
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {isEdit ? t('members:form.updateButton') : t('members:form.createButton')}
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/members')}>
            {t('common:cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
