import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '../api/client';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  status: string;
  photo_url: string;
}

export default function PetsPage() {
  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    ageMin: '',
    ageMax: '',
    status: '',
  });

  const queryParams = new URLSearchParams();
  if (filters.species) queryParams.append('species', filters.species);
  if (filters.breed) queryParams.append('breed', filters.breed);
  if (filters.ageMin) queryParams.append('ageMin', filters.ageMin);
  if (filters.ageMax) queryParams.append('ageMax', filters.ageMax);
  if (filters.status) queryParams.append('status', filters.status);

  const { data, isLoading, error } = useQuery({
    queryKey: ['pets', filters],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get(`/pets?${queryParams.toString()}`);
      return response.data;
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Find Your Perfect Pet</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Pets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              name="species"
              placeholder="Species (e.g., Dog)"
              value={filters.species}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
            />
            <input
              type="text"
              name="breed"
              placeholder="Breed (e.g., Labrador)"
              value={filters.breed}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
            />
            <input
              type="number"
              name="ageMin"
              placeholder="Min Age"
              value={filters.ageMin}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
            />
            <input
              type="number"
              name="ageMax"
              placeholder="Max Age"
              value={filters.ageMax}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-babypink-400"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="text-center text-gray-500">Loading pets...</div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg text-red-800">
            Failed to load pets. Please try again.
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((pet: Pet) => (
              <Link
                key={pet.id}
                to={`/pets/${pet.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {pet.photo_url && (
                  <img
                    src={`http://localhost:3000${pet.photo_url}`}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                  <p className="text-gray-600">{pet.species} - {pet.breed}</p>
                  <p className="text-sm text-gray-500">Age: {pet.age} years</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    pet.status === 'available' ? 'bg-butteryellow-100 text-butteryellow-600' :
                    pet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pet.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {data?.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No pets found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}