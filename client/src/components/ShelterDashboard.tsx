import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '../api/client';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  photo_url: string;
  status: string;
}

interface Application {
  id: string;
  pet_id: string;
  adopter_id: string;
  status: string;
  message: string;
  pet?: Pet;
  adopter?: { displayName: string; email: string };
}

export default function ShelterDashboard() {
  const [activeTab, setActiveTab] = useState<'pets' | 'applications'>('pets');
  const queryClient = useQueryClient();

  const { data: pets, isLoading: petsLoading } = useQuery({
    queryKey: ['shelterPets'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/shelters/my/pets');
      return response.data;
    },
  });

  const { data: applications } = useQuery({
    queryKey: ['shelterApplications'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/applications/shelter');
      return response.data;
    },
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ appId, status }: { appId: string; status: string }) => {
      const api = getApiClient();
      const response = await api.patch(`/applications/${appId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelterApplications'] });
      alert('Application status updated');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('pets')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'pets'
              ? 'text-babypink-500 border-b-2 border-babypink-500'
              : 'text-gray-600'
          }`}
        >
          Manage Pets
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'applications'
              ? 'text-babypink-500 border-b-2 border-babypink-500'
              : 'text-gray-600'
          }`}
        >
          Review Applications
        </button>
      </div>

      {activeTab === 'pets' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Pets</h2>
          {petsLoading ? (
            <p>Loading...</p>
          ) : pets?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet: Pet) => (
                <div key={pet.id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg">
                  {pet.photo_url && (
                    <img
                      src={`http://localhost:3000${pet.photo_url}`}
                      alt={pet.name}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{pet.name}</h3>
                    <p className="text-gray-600 text-sm">{pet.species} - {pet.breed}</p>
                    <p className="text-gray-600 text-sm">Age: {pet.age}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-babypink-100 text-babypink-600 rounded">
                      {pet.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pets yet</p>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Applications</h2>
          {applications?.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app: Application) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Application for {app.pet?.name}
                      </h3>
                      <p className="text-gray-600">From: {app.adopter?.displayName}</p>
                      <p className="text-gray-600">{app.adopter?.email}</p>
                      <p className="text-sm text-gray-700 mt-2">"{app.message}"</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      app.status === 'submitted' ? 'bg-babypink-100 text-babypink-600' :
                      app.status === 'approved' ? 'bg-butteryellow-100 text-butteryellow-600' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  {app.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateApplicationMutation.mutate({ appId: app.id, status: 'approved' })
                        }
                        className="bg-butteryellow-500 hover:bg-butteryellow-600 text-white px-4 py-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateApplicationMutation.mutate({ appId: app.id, status: 'rejected' })
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {app.status === 'approved' && (
                    <button
                      onClick={() =>
                        updateApplicationMutation.mutate({ appId: app.id, status: 'adopted' })
                      }
                      className="bg-babypink-500 hover:bg-babypink-600 text-white px-4 py-2 rounded"
                    >
                      Finalize Adoption
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No applications</p>
          )}
        </div>
      )}
    </div>
  );
}
