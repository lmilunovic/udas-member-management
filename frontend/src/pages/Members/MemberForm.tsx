import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { membersApi } from '../../api/members';
import { type MemberCreateRequest } from '../../api/types';

export default function MemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<MemberCreateRequest>({
    firstName: '',
    lastName: '',
    email: [],
    phone: [],
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
        phone: member.phone || [],
        dateOfBirth: member.dateOfBirth,
        dateOfDeath: member.dateOfDeath,
        ssn: member.ssn,
        address: member.address,
      });
    }
  }, [member]);

  const mutation = useMutation({
    mutationFn: isEdit
      ? (data: MemberCreateRequest) => membersApi.update(id!, data)
      : membersApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['members'] });
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

  if (isEdit && isLoadingMember) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{isEdit ? 'Edit' : 'New'} Member</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm max-w-xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block mb-1 font-medium">
              First Name *
            </label>
            <input
              id="firstName"
              className="w-full px-3 py-2 border rounded"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block mb-1 font-medium">
              Last Name *
            </label>
            <input
              id="lastName"
              className="w-full px-3 py-2 border rounded"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              className="w-full px-3 py-2 border rounded"
              value={form.email[0] || ''}
              onChange={(e) => handleChange('email', [e.target.value])}
              type="email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">
              Phone
            </label>
            <input
              id="phone"
              className="w-full px-3 py-2 border rounded"
              value={form.phone?.[0] || ''}
              onChange={(e) => handleChange('phone', [e.target.value])}
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block mb-1 font-medium">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              className="w-full px-3 py-2 border rounded"
              value={form.dateOfBirth || ''}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              type="date"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/members')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
