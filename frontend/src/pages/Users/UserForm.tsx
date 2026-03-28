import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { type ApplicationUserRequest, type UserRole } from '../../api/types';
import { usersApi } from '../../api/users';

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

  if (isEdit && isLoadingUser) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{isEdit ? 'Edit' : 'New'} User</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm max-w-lg">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email *
            </label>
            <input
              id="email"
              className="w-full px-3 py-2 border rounded"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              type="email"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1 font-medium">
              Role *
            </label>
            <select
              id="role"
              className="w-full px-3 py-2 border rounded"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
            >
              <option value="READ_ONLY">READ_ONLY</option>
              <option value="READ_WRITE">READ_WRITE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
              />
              Active
            </label>
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
              onClick={() => navigate('/users')}
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
