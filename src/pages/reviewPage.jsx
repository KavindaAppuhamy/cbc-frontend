import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiEdit, FiTrash2, FiX, FiSave, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { BsStarFill, BsStar } from 'react-icons/bs';

const ConfirmationModal = ({ message, onConfirm, onCancel, show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center"
          >
            <FiTrash2 className="mr-2" />
            Delete
          </button>
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
          className="text-xl focus:outline-none"
        >
          {star <= rating ? (
            <BsStarFill className="text-yellow-400" />
          ) : (
            <BsStar className="text-gray-300" />
          )}
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500">({rating}/5)</span>
    </div>
  );
};

const ReviewCard = ({ review, isEditing, editForm, onEditChange, onSave, onCancel, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium mr-3">
              {review.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{review.userName || 'Anonymous'}</h4>
              <p className="text-xs text-gray-500">ID: {review.userId}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(review.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Product ID: {review.productId}</div>
          
          {isEditing ? (
            <>
              <StarRating 
                rating={editForm.rating} 
                editable 
                onChange={(rating) => onEditChange({ ...editForm, rating })} 
              />
              <textarea
                value={editForm.comment}
                onChange={(e) => onEditChange({ ...editForm, comment: e.target.value })}
                className="w-full mt-3 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Write your review..."
              />
            </>
          ) : (
            <>
              <StarRating rating={review.rating} />
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <FiSave className="mr-1.5" /> Save
              </button>
              <button
                onClick={onCancel}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg flex items-center text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <FiX className="mr-1.5" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onDelete(review._id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete review"
              >
                <FiTrash2 />
              </button>
              <button
                onClick={() => onDelete(review._id)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit review"
              >
                <FiEdit />
              </button>
            </>
          )}
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
  const [searchType, setSearchType] = useState('productId');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`);
      setReviews(response.data || []);
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
      let url;
      if (searchType === 'productId') {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${searchTerm}`;
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/reviews/user/${searchTerm}`;
      }

      const response = await axios.get(url);
      setReviews(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Failed to search reviews:', error);
      toast.error(error.response?.data?.message || 'Error searching reviews.');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    setShowDeleteModal(false);
    if (!reviewToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${reviewToDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setReviews(reviews.filter(review => review._id !== reviewToDelete));
      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error(error.response?.data?.message || 'Error deleting review.');
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
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${reviewId}`,
        {
          rating: parseInt(editForm.rating),
          comment: editForm.comment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setReviews(reviews.map(review => 
        review._id === reviewId ? response.data : review
      ));
      setEditingReview(null);
      toast.success('Review updated successfully!');
    } catch (error) {
      console.error('Failed to update review:', error);
      toast.error(error.response?.data?.message || 'Error updating review.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <ConfirmationModal
        message="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDeleteReview}
        onCancel={() => setShowDeleteModal(false)}
        show={showDeleteModal}
      />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
              <p className="mt-2 text-gray-600">
                Manage all product reviews in one place
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex rounded-md shadow-sm">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-4 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="productId">Product ID</option>
                  <option value="userId">User ID</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${searchType === 'productId' ? 'Product ID' : 'User ID'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchReviews()}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={searchReviews}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                >
                  <FiSearch className="mr-2" />
                  Search
                </button>
              </div>
              <button
                onClick={fetchAllReviews}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">All Reviews</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  isEditing={editingReview === review._id}
                  editForm={editForm}
                  onEditChange={setEditForm}
                  onSave={() => handleUpdateReview(review._id)}
                  onCancel={() => setEditingReview(null)}
                  onDelete={(id) => {
                    setReviewToDelete(id);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}