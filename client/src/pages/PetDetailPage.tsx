import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getApiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  status: string;
  photo_url: string;
  shelter_id: string;
}

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get(`/pets/${id}`);
      return response.data;
    },
  });

  const applicationMutation = useMutation({
    mutationFn: async () => {
      const api = getApiClient();
      const response = await api.post('/applications', {
        pet_id: id,
        message: applicationMessage,
      });
      return response.data;
    },
    onSuccess: () => {
      setApplicationMessage('');
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to submit application');
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      const api = getApiClient();
      const response = await api.post(`/favorites/${id}`);
      return response.data;
    },
    onSuccess: () => {
      alert('Added to favorites!');
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading pet details...</div>;
  }

  if (!pet) {
    return <div className="text-center py-12">Pet not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/pets')}
          className="mb-6 text-babypink-500 hover:text-babypink-600"
        >
          ← Back to Pets
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {pet.photo_url && (
              <img
                src={`http://localhost:3000${pet.photo_url}`}
                alt={pet.name}
                className="w-full h-96 object-cover"
              />
            )}

            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{pet.name}</h1>
              <p className="text-lg text-gray-600 mb-4">
                {pet.species} • {pet.breed} • {pet.age} years old
              </p>

              <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-full text-lg font-medium ${
                  pet.status === 'available' ? 'bg-butteryellow-100 text-butteryellow-600' :
                  pet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {pet.status}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">About {pet.name}</h2>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>

              {isAuthenticated && user?.role === 'adopter' && pet.status === 'available' && (
                <div className="space-y-4">
                  {!showApplicationForm ? (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowApplicationForm(true)}
                        className="flex-1 bg-babypink-500 hover:bg-babypink-600 text-white font-bold py-3 px-4 rounded"
                      >
                        Apply for Adoption
                      </button>
                      <button
                        onClick={() => favoriteMutation.mutate()}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-4 rounded"
                      >
                        ❤️ Add to Favorites
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={applicationMessage}
                        onChange={(e) => setApplicationMessage(e.target.value)}
                        placeholder="Tell us why you'd like to adopt this pet..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-babypink-400"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => applicationMutation.mutate()}
                          disabled={applicationMutation.isPending}
                          className="flex-1 bg-butteryellow-500 hover:bg-butteryellow-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                          {applicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                        </button>
                        <button
                          onClick={() => {
                            setShowApplicationForm(false);
                            setApplicationMessage('');
                          }}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}