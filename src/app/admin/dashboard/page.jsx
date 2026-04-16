'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminDashboard() {
  const [adminId, setAdminId] = useState('');
  const router = useRouter();
  const { isAdminLoggedIn, isLoading, logout } = useAdminAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAdminLoggedIn) {
      router.push('/admin/login');
      return;
    }

    const id = localStorage.getItem('adminId');
    setAdminId(id || '');
  }, [isAdminLoggedIn, isLoading, router]);

  const handleLogout = () => {
    // Use context logout method for instant navbar update
    logout();
    // Redirect to home
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome
          </h2>
          <p className="text-gray-600">
            You are now logged in to the admin panel. Manage your website content from here.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Achievements Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Achievements & Journals</h3>
            <p className="text-gray-600 mb-4">Add and manage achievements and journal publications</p>
            <Link href="/admin/achievements">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Manage
              </button>
            </Link>
          </div>

          {/* Research Fundings Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Research Fundings</h3>
            <p className="text-gray-600 mb-4">Add and manage research funding entries</p>
            <Link href="/admin/fundings">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Manage
              </button>
            </Link>
          </div>

          {/* Patents Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Patents</h3>
            <p className="text-gray-600 mb-4">Add and manage patent entries</p>
            <Link href="/admin/patents">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Manage
              </button>
            </Link>
          </div>

          {/* Members Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Members</h3>
            <p className="text-gray-600 mb-4">Manage collaborators, alumni, and faculty profiles</p>
            <Link href="/admin/members">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Manage
              </button>
            </Link>
          </div>

          {/* Students Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Students</h3>
            <p className="text-gray-600 mb-4">Manage student profiles and project entries</p>
            <Link href="/admin/students">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Manage
              </button>
            </Link>
          </div>

          {/* Notices Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Notices</h3>
            <p className="text-gray-600 mb-4">Manage notices and updates</p>
            <Link href="/admin/notices">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Manage
              </button>
            </Link>
          </div>

          {/* Research Sections Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Research Sections</h3>
            <p className="text-gray-600 mb-4">Manage research projects and content</p>
            <Link href="/admin/research-sections">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Manage
              </button>
            </Link>
          </div>

          {/* Gallery Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gallery</h3>
            <p className="text-gray-600 mb-4">Manage photo galleries and albums</p>
            <Link href="/admin/gallery">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Manage
              </button>
            </Link>
          </div>

          {/* Members Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Members</h3>
            <p className="text-gray-600 mb-4">Manage team members and staff</p>
            <button
              disabled
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
            >
              Coming Soon
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
