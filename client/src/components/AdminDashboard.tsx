import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '../api/client';

interface Shelter {
  id: string;
  name: string;
  address: string;
  is_verified: boolean;
  owner?: { displayName: string; email: string };
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: shelters, isLoading } = useQuery({
    queryKey: ['allShelters'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/admin/shelters');
      return response.data;
    },
  });

  const verifyShelterMutation = useMutation({
    mutationFn: async (shelterId: string) => {
      const api = getApiClient();
      const response = await api.patch(`/admin/shelters/${shelterId}/verify`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShelters'] });
      alert('Shelter verified');
    },
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Verify Shelters</h2>

      {isLoading ? (
        <p>Loading shelters...</p>
      ) : shelters?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Owner</th>
                <th className="px-4 py-3 text-left font-semibold">Address</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {shelters.map((shelter: Shelter) => (
                <tr key={shelter.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{shelter.name}</td>
                  <td className="px-4 py-3">
                    {shelter.owner?.displayName}
                    <br />
                    <span className="text-sm text-gray-600">{shelter.owner?.email}</span>
                  </td>
                  <td className="px-4 py-3">{shelter.address}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        shelter.is_verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {shelter.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!shelter.is_verified && (
                      <button
                        onClick={() => verifyShelterMutation.mutate(shelter.id)}
                        disabled={verifyShelterMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No shelters found</p>
      )}
    </div>
  );
}