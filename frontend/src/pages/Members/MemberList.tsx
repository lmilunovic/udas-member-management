import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { membersApi } from '../../api/members';

export default function MemberList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['members', { page, search }],
    queryFn: () => membersApi.list({ 
      page, 
      size: 20,
      lastName: search || undefined 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: membersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Members</h2>
        <Link to="/members/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Member
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by last name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border rounded"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">First Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Last Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map(member => (
                  <tr key={member.id} className="border-t">
                    <td className="px-4 py-3">{member.firstName}</td>
                    <td className="px-4 py-3">{member.lastName}</td>
                    <td className="px-4 py-3">{member.email[0] || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link 
                          to={`/members/${member.id}/edit`}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Edit
                        </Link>
                        <button 
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => {
                            if (confirm('Delete this member?')) {
                              deleteMutation.mutate(member.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            <button 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page + 1} of {data?.totalPages ?? 1}
            </span>
            <button 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage(p => p + 1)}
              disabled={(data?.totalPages ?? 1) <= page + 1}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
