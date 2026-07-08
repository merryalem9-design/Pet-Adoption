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

interface Shelter {
  id: string;
  name: string;
  description: string | null;
  address: string;
  is_verified: boolean;
}

function CreateShelterForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const createShelterMutation = useMutation({
    mutationFn: async () => {
      const api = getApiClient();
      const response = await api.post('/shelters', { name, description, address });
      return response.data;
    },
    onSuccess: () => {
      onCreated();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to create shelter');
    },
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-2">Set Up Your Shelter</h2>
      <p className="text-gray-600 text-sm mb-4">
        You need a shelter profile before you can list pets. An admin will need
        to verify it before it's visible.
      </p>
      {error && (
        <div className="rounded-md bg-red-50 p-3 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createShelterMutation.mutate();
        }}
        className="space-y-3"
      >
        <input
          type="text"
          placeholder="Shelter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
          rows={3}
        />
        <button
          type="submit"
          disabled={createShelterMutation.isPending}
          className="w-full bg-babypink-500 hover:bg-babypink-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {createShelterMutation.isPending ? 'Creating...' : 'Create Shelter'}
        </button>
      </form>
    </div>
  );
}

function AddPetForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState('');

  const createPetMutation = useMutation({
    mutationFn: async () => {
      const api = getApiClient();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('species', species);
      formData.append('breed', breed);
      formData.append('age', age);
      formData.append('description', description);
      if (photo) formData.append('photo', photo);

      // Do NOT set Content-Type manually — the browser generates the
      // multipart boundary automatically for FormData bodies.
      const response = await api.post('/shelters/my/pets', formData);
      return response.data;
    },
    onSuccess: () => {
      setName('');
      setSpecies('');
      setBreed('');
      setAge('');
      setDescription('');
      setPhoto(null);
      setError('');
      onCreated();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to create pet');
    },
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Add a Pet</h3>
      {error && (
        <div className="rounded-md bg-red-50 p-3 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPetMutation.mutate();
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
          required
        />
        <input
          type="text"
          placeholder="Species (e.g. Dog)"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
          required
        />
        <input
          type="text"
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400 md:col-span-2"
          rows={2}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="md:col-span-2"
        />
        <button
          type="submit"
          disabled={createPetMutation.isPending}
          className="md:col-span-2 bg-butteryellow-500 hover:bg-butteryellow-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {createPetMutation.isPending ? 'Creating...' : 'Create Pet'}
        </button>
      </form>
    </div>
  );
}

export default function ShelterDashboard() {
  const [activeTab, setActiveTab] = useState<'pets' | 'applications'>('pets');
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: shelter,
    isLoading: shelterLoading,
    error: shelterError,
    refetch: refetchShelter,
  } = useQuery<Shelter>({
    queryKey: ['myShelter'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/shelters/mine');
      return response.data;
    },
    retry: false,
  });

  const { data: pets, isLoading: petsLoading } = useQuery({
    queryKey: ['shelterPets'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/shelters/my/pets');
      return response.data;
    },
    enabled: !!shelter,
  });

  const { data: applications } = useQuery({
    queryKey: ['shelterApplications'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/applications/shelter');
      return response.data;
    },
    enabled: !!shelter,
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ appId, status }: { appId: string; status: string }) => {
      const api = getApiClient();
      const response = await api.patch(`/applications/${appId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelterApplications'] });
      queryClient.invalidateQueries({ queryKey: ['shelterPets'] });
      alert('Application status updated');
    },
  });

  if (shelterLoading) {
    return <div className="text-center py-12">Loading your shelter...</div>;
  }

  if (shelterError || !shelter) {
    return <CreateShelterForm onCreated={() => refetchShelter()} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold">{shelter.name}</h2>
        <p className="text-sm text-gray-500">{shelter.address}</p>
        <span
          className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
            shelter.is_verified
              ? 'bg-butteryellow-100 text-butteryellow-600'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {shelter.is_verified ? 'Verified' : 'Pending verification'}
        </span>
      </div>

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Pets</h2>
            <button
              onClick={() => setShowAddPetForm(!showAddPetForm)}
              className="bg-babypink-500 hover:bg-babypink-600 text-white px-4 py-2 rounded"
            >
              {showAddPetForm ? 'Cancel' : '+ Add Pet'}
            </button>
          </div>

          {showAddPetForm && (
            <AddPetForm
              onCreated={() => {
                setShowAddPetForm(false);
                queryClient.invalidateQueries({ queryKey: ['shelterPets'] });
              }}
            />
          )}

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
            <p className="text-gray-500">No pets yet — add your first one above.</p>
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