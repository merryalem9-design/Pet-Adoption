import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';

interface Post {
  id: string;
  caption: string;
  photo_url: string;
  milestone_label: string;
  adopter?: { displayName: string };
  reactions?: Reaction[];
  _count?: { reactions: number };
}

interface Reaction {
  id: string;
  type: string;
  user_id: string;
}

export default function FeedPage() {
  const [page, setPage] = useState(1);
  const [showPostForm, setShowPostForm] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: feedData, isLoading } = useQuery({
    queryKey: ['feed', page],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get(`/feed?page=${page}`);
      return response.data;
    },
  });

  const { data: userApplications } = useQuery({
    queryKey: ['myAdoptedApplications'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/applications/mine');
      return response.data;
    },
    enabled: isAuthenticated && user?.role === 'adopter',
  });

  const hasAdoptedPet = userApplications?.some(
    (app: any) => app.status === 'adopted'
  );

  const reactMutation = useMutation({
    mutationFn: async ({ postId, reactionType }: { postId: string; reactionType: string }) => {
      const api = getApiClient();
      const response = await api.post(`/posts/${postId}/reactions`, { type: reactionType });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const reportMutation = useMutation({
    mutationFn: async ({ postId, reason }: { postId: string; reason: string }) => {
      const api = getApiClient();
      const response = await api.post(`/posts/${postId}/report`, { reason });
      return response.data;
    },
    onSuccess: () => {
      alert('Report submitted');
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Pet Adoption Feed</h1>

        {/* Post Creation */}
        {isAuthenticated && user?.role === 'adopter' && hasAdoptedPet && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Share Your Story</h2>
            {!showPostForm ? (
              <button
                onClick={() => setShowPostForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Post
              </button>
            ) : (
              <CreatePostForm
                onClose={() => setShowPostForm(false)}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ['feed'] });
                  setShowPostForm(false);
                }}
              />
            )}
          </div>
        )}

        {/* Feed */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading feed...</div>
        ) : feedData?.posts?.length > 0 ? (
          <>
            <div className="space-y-6">
              {feedData.posts.map((post: Post) => (
                <FeedPost
                  key={post.id}
                  post={post}
                  onReact={(reactionType) =>
                    reactMutation.mutate({ postId: post.id, reactionType })
                  }
                  onReport={(reason) =>
                    reportMutation.mutate({ postId: post.id, reason })
                  }
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="py-2 px-4">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={feedData?.posts?.length < 10}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No posts yet. Be the first to share!
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePostForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    caption: '',
    milestone_label: 'first_day',
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const api = getApiClient();
      const data = new FormData();
      data.append('caption', formData.caption);
      data.append('milestone_label', formData.milestone_label);
      if (photo) {
        data.append('photo', photo);
      }

      const response = await api.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess() {
      onSuccess();
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to create post');
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPostMutation.mutate();
      }}
      className="space-y-4"
    >
      <textarea
        value={formData.caption}
        onChange={(e) =>
          setFormData({ ...formData, caption: e.target.value })
        }
        placeholder="Write your story..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
        rows={4}
        required
      />

      <select
        value={formData.milestone_label}
        onChange={(e) =>
          setFormData({ ...formData, milestone_label: e.target.value })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
      >
        <option value="first_day">First Day</option>
        <option value="first_week">First Week</option>
        <option value="first_month">First Month</option>
        <option value="adoption_day">Adoption Day</option>
        <option value="other">Other</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={createPostMutation.isPending}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FeedPost({
  post,
  onReact,
  onReport,
  isAuthenticated,
}: {
  post: Post;
  onReact: (type: string) => void;
  onReport: (reason: string) => void;
  isAuthenticated: boolean;
}) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {post.photo_url && (
        <img
          src={`/${post.photo_url}`}
          alt="Post"
          className="w-full h-96 object-cover"
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-semibold text-lg">{post.adopter?.displayName}</p>
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">
              {post.milestone_label}
            </span>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="text-gray-500 hover:text-gray-700"
            >
              ⚠️
            </button>
          )}
        </div>

        <p className="text-gray-700 mb-4">{post.caption}</p>

        {showReportForm && (
          <div className="bg-gray-50 p-4 rounded mb-4">
            <input
              type="text"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Report reason..."
              className="w-full px-3 py-2 border rounded mb-2"
            />
            <button
              onClick={() => {
                onReport(reportReason);
                setShowReportForm(false);
                setReportReason('');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Submit Report
            </button>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex gap-2">
            <button
              onClick={() => onReact('heart')}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              ❤️ {post._count?.reactions || 0}
            </button>
            <button
              onClick={() => onReact('smile')}
              className="flex items-center gap-2 text-yellow-600 hover:text-yellow-800"
            >
              😊
            </button>
          </div>
        )}
      </div>
    </div>
  );
}