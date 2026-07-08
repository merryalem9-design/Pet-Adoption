import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getApiClient } from '../api/client';

interface Application {
  id: string;
  pet_id: string;
  status: string;
  message: string;
  pet?: { name: string; photo_url: string };
}

interface Favorite {
  id: string;
  pet_id: string;
  pet?: { name: string; photo_url: string };
}

export default function AdopterDashboard() {
  const [activeTab, setActiveTab] = useState<'applications' | 'favorites'>('applications');

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/applications/mine');
      return response.data;
    },
  });

  const { data: favorites } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/favorites/mine');
      return response.data;
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (favId: string) => {
      const api = getApiClient();
      await api.delete(`/favorites/${favId}`);
    },
    onSuccess: () => {
      alert('Removed from favorites');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'applications'
              ? 'text-babypink-500 border-b-2 border-babypink-500'
              : 'text-gray-600'
          }`}
        >
          My Applications
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'favorites'
              ? 'text-babypink-500 border-b-2 border-babypink-500'
              : 'text-gray-600'
          }`}
        >
          Favorites
        </button>
      </div>

      {activeTab === 'applications' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">My Applications</h2>
          {appsLoading ? (
            <p>Loading...</p>
          ) : applications?.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app: Application) => (
                <div key={app.id} className="border rounded-lg p-4 flex items-start gap-4">
                  {app.pet?.photo_url && (
                    <img
                      src={`http://localhost:3000${app.pet.photo_url}`}
                      alt={app.pet?.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{app.pet?.name}</h3>
                    <p className="text-gray-600 text-sm">Message: {app.message}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${
                      app.status === 'submitted' ? 'bg-babypink-100 text-babypink-600' :
                      app.status === 'approved' ? 'bg-butteryellow-100 text-butteryellow-600' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No applications yet</p>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
          {favorites?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav: Favorite) => (
                <div key={fav.id} className="border rounded-lg overflow-hidden">
                  {fav.pet?.photo_url && (
                    <img
                      src={`http://localhost:3000${fav.pet.photo_url}`}
                      alt={fav.pet?.name}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold">{fav.pet?.name}</h3>
                    <button
                      onClick={() => removeFavoriteMutation.mutate(fav.id)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No favorites yet</p>
          )}
        </div>
      )}
    </div>
  );
}