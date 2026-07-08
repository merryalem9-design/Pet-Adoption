import React from 'react';
import { useAuthStore } from '../stores/authStore';
import AdopterDashboard from '../components/AdopterDashboard';
import ShelterDashboard from '../components/ShelterDashboard';
import AdminDashboard from '../components/AdminDashboard';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <div className="text-center py-12">Not authenticated</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {user.role === 'adopter' && 'Your Dashboard'}
          {user.role === 'shelter_staff' && 'Shelter Dashboard'}
          {user.role === 'admin' && 'Admin Dashboard'}
        </h1>

        {user.role === 'adopter' && <AdopterDashboard />}
        {user.role === 'shelter_staff' && <ShelterDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}