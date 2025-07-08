import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FiEdit, FiX, FiSave, FiSearch, FiRefreshCw, FiMessageSquare, FiCheck, FiClock, FiFilter, FiEye, FiEyeOff } from 'react-icons/fi';
import { BsStarFill, BsStar } from 'react-icons/bs';

const AdminReplyModal = ({ review, onClose, onSave, show }) => {
  const [replyText, setReplyText] = useState(review?.adminReply || '');

  if (!show) return null;

  const handleSave = () => {
    onSave(review._id, replyText);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Admin Reply</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Replying to review by {review?.userName}
            </p>
            <p className="text-gray-600">{review?.comment}</p>
          </div>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="5"
            placeholder="Write your admin reply..."
          />
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center font-medium shadow-lg shadow-blue-500/25"
            >
              <FiSave className="mr-2" />
              Save Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating, editable = false, onChange }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={editable ? "button" : "div"}
          onClick={editable ? () => onChange(star) : null}
          className={`text-lg focus:outline-none ${editable ? 'hover:scale-110 transition-transform' : ''}`}
        >
          {star <= rating ? (
            <BsStarFill className="text-amber-400" />
          ) : (
            <BsStar className="text-gray-300" />
          )}
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500 font-medium">({rating}/5)</span>
    </div>
  );
};

const ReviewCard = ({ 
  review, 
  isEditing, 
  editForm, 
  onEditChange, 
  onSave, 
  onCancel, 
  onEdit,
  onPublishToggle,
  onAdminReply
}) => {
  const getStatusBadge = (status) => {
    if (status === 'published') {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <FiCheck className="mr-1.5 w-3 h-3" />
          Published
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <FiClock className="mr-1.5 w-3 h-3" />
          Pending
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              {review.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">{review.userName || 'Anonymous'}</h4>
              <p className="text-sm text-gray-500">User ID: {review.userId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(review.status)}
            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
              {new Date(review.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-3">
            Product ID: {review.productId}
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <StarRating 
                rating={editForm.rating} 
                editable 
                onChange={(rating) => onEditChange({ ...editForm, rating })} 
              />
              <textarea
                value={editForm.comment}
                onChange={(e) => onEditChange({ ...editForm, comment: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Write your review..."
              />
            </div>
          ) : (
            <div className="space-y-3">
              <StarRating rating={review.rating} />
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          )}
        </div>

        {/* Admin Reply Section */}
        {review.adminReply && (
          <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mr-3 shadow-sm">
                A
              </div>
              <span className="text-sm font-semibold text-blue-900">Admin Reply</span>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">{review.adminReply}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex space-x-3">
            <button
              onClick={() => onPublishToggle(review._id, review.status)}
              className={`px-4 py-2.5 rounded-xl flex items-center text-sm font-semibold transition-all duration-200 ${
                review.status === 'published'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
              }`}
            >
              {review.status === 'published' ? (
                <>
                  <FiEyeOff className="mr-2 w-4 h-4" /> Unpublish
                </>
              ) : (
                <>
                  <FiEye className="mr-2 w-4 h-4" /> Publish
                </>
              )}
            </button>
          </div>

          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={onSave}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  <FiSave className="mr-2 w-4 h-4" /> Save
                </button>
                <button
                  onClick={onCancel}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl flex items-center text-sm font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  <FiX className="mr-2 w-4 h-4" /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onAdminReply(review)}
                  className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="Add/Edit admin reply"
                >
                  <FiMessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onEdit(review)}
                  className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="Edit review"
                >
                  <FiEdit className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdminReplyModal, setShowAdminReplyModal] = useState(false);
  const [selectedReviewForReply, setSelectedReviewForReply] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`);
      const data = await response.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error(error.response?.data?.message || 'Error fetching reviews.');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchReviews = async () => {
    if (!searchTerm.trim()) {
      fetchAllReviews();
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/search?q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Failed to search reviews:', error);
      toast.error(error.response?.data?.message || 'Error searching reviews.');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editForm.rating || !editForm.comment.trim()) {
      toast.error('Please provide both rating and comment.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${reviewId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rating: parseInt(editForm.rating),
            comment: editForm.comment
          })
        }
      );
      
      const data = await response.json();
      setReviews(reviews.map(review => 
        review._id === reviewId ? data : review
      ));
      setEditingReview(null);
      toast.success('Review updated successfully!');
    } catch (error) {
      console.error('Failed to update review:', error);
      toast.error(error.response?.data?.message || 'Error updating review.');
    }
  };

  const handlePublishToggle = async (reviewId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${reviewId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, status: newStatus } : review
      ));
      
      toast.success(`Review ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
    } catch (error) {
      console.error('Failed to update review status:', error);
      toast.error(error.response?.data?.message || 'Error updating review status.');
    }
  };

  const handleAdminReply = (review) => {
    setSelectedReviewForReply(review);
    setShowAdminReplyModal(true);
  };

  const handleSaveAdminReply = async (reviewId, replyText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${reviewId}/admin-reply`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ adminReply: replyText })
        }
      );

      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, adminReply: replyText } : review
      ));
      
      toast.success('Admin reply saved successfully!');
    } catch (error) {
      console.error('Failed to save admin reply:', error);
      toast.error(error.response?.data?.message || 'Error saving admin reply.');
    }
  };

  const filteredReviews = statusFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.status === statusFilter);

  const publishedCount = reviews.filter(r => r.status === 'published').length;
  const unpublishedCount = reviews.filter(r => r.status !== 'published').length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <AdminReplyModal
        review={selectedReviewForReply}
        show={showAdminReplyModal}
        onClose={() => {
          setShowAdminReplyModal(false);
          setSelectedReviewForReply(null);
        }}
        onSave={handleSaveAdminReply}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Review Management
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage product reviews and engage with your customers
              </p>
            </div>
            
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex rounded-xl shadow-sm overflow-hidden">
                <input
                  type="text"
                  placeholder="Search by Product ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchReviews()}
                  className="flex-1 min-w-0 block w-full px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
                <button
                  onClick={searchReviews}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 font-medium"
                >
                  <FiSearch className="mr-2 w-4 h-4" />
                  Search
                </button>
              </div>
              <button
                onClick={fetchAllReviews}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 font-medium shadow-sm"
              >
                <FiRefreshCw className="mr-2 w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-100">
                  <FiMessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-emerald-100">
                  <FiCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-amber-100">
                  <FiClock className="w-6 h-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{unpublishedCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-purple-100">
                  <FiFilter className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Filter</p>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-lg font-bold text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="published">Published</option>
                    <option value="unpublished">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  isEditing={editingReview === review._id}
                  editForm={editForm}
                  onEditChange={setEditForm}
                  onSave={() => handleUpdateReview(review._id)}
                  onCancel={() => setEditingReview(null)}
                  onEdit={handleEditReview}
                  onPublishToggle={handlePublishToggle}
                  onAdminReply={handleAdminReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}