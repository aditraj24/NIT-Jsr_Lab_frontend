'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import FileUpload from '@/components/FileUpload/FileUpload';

function EditJournalForm() {
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const journalId = searchParams.get('id');
  const { isAdminLoggedIn: isLoggedIn, isLoading } = useAdminAuth();

  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Link: '',
    Date: '',
    Thumbnail: '',
    Pdf: '',
  });

  const [members, setMembers] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }

    if (!journalId) {
      router.push('/admin/journals');
      return;
    }

    setIsAdminLoggedIn(true);
    fetchMembers();
    fetchJournal();
  }, [isLoggedIn, isLoading, router, journalId]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      if (data.data) {
        setMembers(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchJournal = async () => {
    try {
      const response = await fetch(`/api/journal/${journalId}`);
      if (!response.ok) {
        throw new Error('Journal not found');
      }
      const data = await response.json();
      const attrs = data.data?.attributes;

      if (attrs) {
        setFormData({
          Title: attrs.Title || '',
          Description: attrs.Description || '',
          Link: attrs.Link || '',
          Date: attrs.Date ? new Date(attrs.Date).toISOString().split('T')[0] : '',
          Thumbnail: attrs.Thumbnail || '',
          Pdf: attrs.Pdf || '',
        });

        // Set author if exists
        if (attrs.author?.data?.id) {
          setSelectedAuthor(attrs.author.data.id);
        }
      }
    } catch (err) {
      console.error('Error fetching journal:', err);
      setError('Failed to load journal data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    try {
      const payload = {
        ...formData,
        author: selectedAuthor || null,
      };

      const response = await fetch(`/api/journal/${journalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update journal');
      }

      setSuccess('Journal updated successfully!');
      setTimeout(() => {
        router.push('/admin/journals');
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred while updating the journal');
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-700 animate-pulse">Loading journal data...</div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Journal
          </h1>
          <p className="text-gray-600 mb-8">
            Update the journal entry details below
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="Title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="Title"
                name="Title"
                value={formData.Title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter achievement title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="Description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-2">
                Author
              </label>
              <select
                id="author"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an author (optional)</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.attributes?.name || 'Unknown Member'}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="Date" className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="Date"
                name="Date"
                value={formData.Date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Link */}
            <div>
              <label htmlFor="Link" className="block text-sm font-semibold text-gray-700 mb-2">
                Link (URL to paper/journal)
              </label>
              <input
                type="url"
                id="Link"
                name="Link"
                value={formData.Link}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Thumbnail */}
            <FileUpload
              label="Thumbnail Image"
              accept="image/*"
              folder="mvi_lab/achievements"
              value={formData.Thumbnail}
              onChange={(url) => setFormData((prev) => ({ ...prev, Thumbnail: url }))}
            />

            {/* PDF */}
            <FileUpload
              label="PDF File"
              accept=".pdf"
              folder="mvi_lab/achievements"
              value={formData.Pdf}
              onChange={(url) => setFormData((prev) => ({ ...prev, Pdf: url ? url.replace('/image/upload/', '/raw/upload/') : url }))}
            />

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {submitLoading ? 'Updating...' : 'Update Journal'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/journals')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Back to Journals
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminEditJournalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-2xl text-gray-700 animate-pulse">Loading...</div>
        </div>
      }
    >
      <EditJournalForm />
    </Suspense>
  );
}
