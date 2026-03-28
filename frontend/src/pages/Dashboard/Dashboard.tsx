import { useQuery } from '@tanstack/react-query';

import { membersApi } from '../../api/members';

export default function Dashboard() {
  const { data: membersData, isLoading } = useQuery({
    queryKey: ['members', { size: 1 }],
    queryFn: () => membersApi.list({ size: 1 }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-4xl font-bold text-blue-600">{membersData?.totalElements ?? 0}</div>
          <div className="text-gray-500 mt-2">Total Members</div>
        </div>
      </div>
    </div>
  );
}
