import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FiX, FiSave, FiSearch, FiRefreshCw, FiMessageSquare, FiCheck, FiClock, FiEye, FiEyeOff } from 'react-icons/fi';
import { BsStarFill, BsStar } from 'react-icons/bs';
import api, { extractList, getErrorMessage } from '../utils/api';

const AdminReplyModal = ({ review, onClose, onSave, show }) => {
  const [replyText, setReplyText] = useState(review?.adminReply || '');

  useEffect(() => {
    setReplyText(review?.adminReply || '');
  }, [review]);

  if (!show) return null;

  const handleSave = () => {
    onSave(review._id, replyText);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E9E5DC] shadow-xl">
        <div className="sticky top-0 bg-white border-b border-[#EDE9E0] px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#1C1B18]">Admin reply</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A867E] hover:bg-[#F5F3EC] hover:text-[#1C1B18] transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 p-4 bg-[#F5F3EC] rounded-xl">
            <p className="text-sm font-medium text-[#4A463F] mb-1.5">
              Replying to review by {review?.userName}
            </p>
            <p className="text-sm text-[#6E6A62]">{review?.comment}</p>
          </div>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="
                w-full p-3.5
                rounded-xl
                border border-[#E5E1D8]
                text-sm text-[#1C1B18]
                placeholder:text-[#B4AFA5]
                outline-none
                resize-none
                transition-all
                focus:border-[#A6803D]
                focus:ring-2
                focus:ring-[#A6803D]/15
            "
            rows="5"
            placeholder="Write your admin reply..."
          />

          <div className="flex justify-end gap-2.5 mt-5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-[#E5E1D8] text-sm font-medium text-[#4A463F] hover:border-[#D6D0C2] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1C1B18] text-white text-sm font-medium hover:bg-[#332F27] transition-colors"
            >
              <FiSave className="w-4 h-4" />
              Save reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-sm">
          {star <= rating ? (
            <BsStarFill className="text-[#A6803D]" />
          ) : (
            <BsStar className="text-[#D9D4C8]" />
          )}
        </span>
      ))}
      <span className="ml-2 text-xs text-[#8A867E] font-medium">({rating}/5)</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'published') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EAF3EE] text-[#2F7A54]">
        <FiCheck className="w-3 h-3" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FBF3E3] text-[#9C7A1F]">
      <FiClock className="w-3 h-3" />
      Pending
    </span>
  );
};

const ReviewCard = ({ review, onPublishToggle, onAdminReply }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E9E5DC] overflow-hidden transition-colors hover:bg-[#FBFAF7]">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#1C1B18] flex items-center justify-center text-white font-medium shrink-0">
              {review.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-[#1C1B18]">{review.userName || 'Anonymous'}</h4>
              <p className="text-xs text-[#B4AFA5] mt-0.5">User ID: {review.userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <StatusBadge status={review.status} />
            <span className="hidden sm:inline text-xs text-[#8A867E]">
              {new Date(review.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <div className="inline-flex items-center px-2.5 py-1 bg-[#F5F3EC] text-[#6E6A62] rounded-md text-xs font-medium mb-3">
            Product ID: {review.productId}
          </div>

          <div className="space-y-2.5">
            <StarRating rating={review.rating} />
            <p className="text-sm text-[#4A463F] leading-relaxed">{review.comment}</p>
          </div>
        </div>

        {/* Admin Reply Section */}
        {review.adminReply && (
          <div className="mb-5 bg-[#F6EFE0] border-l-2 border-[#A6803D] p-4 rounded-r-xl">
            <div className="flex items-center mb-2 gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#A6803D] flex items-center justify-center text-white text-xs font-semibold">
                A
              </div>
              <span className="text-xs font-semibold text-[#8A7B5C]">Admin reply</span>
            </div>
            <p className="text-sm text-[#6E5C3D] leading-relaxed">{review.adminReply}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-[#F2EFE7]">
          <button
            onClick={() => onPublishToggle(review._id, review.status)}
            className={`
                inline-flex items-center gap-1.5
                px-3.5 py-2
                rounded-lg
                text-xs font-medium
                transition-all
                ${
                    review.status === 'published'
                        ? 'bg-[#FBEAEA] text-[#B3454B] hover:bg-[#F5D9D9]'
                        : 'bg-[#EAF3EE] text-[#2F7A54] hover:bg-[#DCEEE3]'
                }
            `}
          >
            {review.status === 'published' ? (
              <>
                <FiEyeOff className="w-3.5 h-3.5" /> Unpublish
              </>
            ) : (
              <>
                <FiEye className="w-3.5 h-3.5" /> Publish
              </>
            )}
          </button>

          <button
            onClick={() => onAdminReply(review)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#8A867E] hover:text-[#A6803D] hover:bg-[#F5F3EC] transition-all"
            title="Add/edit admin reply"
          >
            <FiMessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      const response = await api.get('/api/reviews');
      setReviews(extractList(response.data, 'reviews'));
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error(getErrorMessage(error, 'Error fetching reviews.'));
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
      const response = await api.get(`/api/reviews/search?q=${encodeURIComponent(searchTerm)}`);
      setReviews(extractList(response.data, 'reviews'));
    } catch (error) {
      console.error('Failed to search reviews:', error);
      toast.error(getErrorMessage(error, 'Error searching reviews.'));
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = async (reviewId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'unpublished' : 'published';

    try {
      await api.put(`/api/reviews/${reviewId}/status`, { status: newStatus });

      setReviews(reviews.map(review =>
        review._id === reviewId ? { ...review, status: newStatus } : review
      ));

      toast.success(`Review ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
    } catch (error) {
      console.error('Failed to update review status:', error);
      toast.error(getErrorMessage(error, 'Error updating review status.'));
    }
  };

  const handleAdminReply = (review) => {
    setSelectedReviewForReply(review);
    setShowAdminReplyModal(true);
  };

  const handleSaveAdminReply = async (reviewId, replyText) => {
    try {
      await api.put(`/api/reviews/${reviewId}/admin-reply`, { adminReply: replyText });

      setReviews(reviews.map(review =>
        review._id === reviewId ? { ...review, adminReply: replyText } : review
      ));

      toast.success('Admin reply saved successfully!');
    } catch (error) {
      console.error('Failed to save admin reply:', error);
      toast.error(getErrorMessage(error, 'Error saving admin reply.'));
    }
  };

  const filteredReviews = statusFilter === 'all'
    ? reviews
    : reviews.filter(review => review.status === statusFilter);

  const publishedCount = reviews.filter(r => r.status === 'published').length;
  const unpublishedCount = reviews.filter(r => r.status !== 'published').length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-[3px] border-[#EAE6DC] border-t-[#A6803D] animate-spin" />
          <p className="mt-5 text-sm text-[#8A867E]">Loading reviews…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] py-8 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1C1B18',
            color: '#fff',
            borderRadius: '10px',
            padding: '14px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#2F7A54',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#B3454B',
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

      <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE0] border border-[#E3DCCC] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A6803D]" />
              <span className="text-[11px] font-semibold tracking-wide text-[#8A7B5C]">
                Review Management
              </span>
            </div>

            <h1 className="font-serif text-[28px] sm:text-[32px] text-[#1C1B18] leading-tight">
              Reviews
            </h1>

            <p className="mt-1.5 text-sm text-[#84807A]">
              Moderate product reviews and reply to your customers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
            <div className="relative w-full sm:w-72 lg:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFA5] pointer-events-none w-4 h-4" />
              <input
                type="text"
                placeholder="Search by product ID or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchReviews()}
                className="
                    w-full
                    pl-10 pr-4 py-2.5
                    rounded-lg
                    bg-white
                    border border-[#E5E1D8]
                    text-sm text-[#1C1B18]
                    placeholder:text-[#B4AFA5]
                    shadow-[0_1px_2px_rgba(28,27,24,0.04)]
                    outline-none
                    transition-all
                    focus:border-[#A6803D]
                    focus:ring-2
                    focus:ring-[#A6803D]/15
                "
              />
            </div>

            <button
              onClick={fetchAllReviews}
              className="
                  inline-flex items-center justify-center gap-2
                  px-4 py-2.5
                  rounded-lg
                  bg-white
                  border border-[#E5E1D8]
                  text-sm font-medium text-[#4A463F]
                  shadow-[0_1px_2px_rgba(28,27,24,0.04)]
                  hover:border-[#D6D0C2]
                  active:scale-[0.98]
                  transition-all
              "
              title="Refresh"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats + filter */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#E9E5DC]">
            <FiMessageSquare className="w-3.5 h-3.5 text-[#8A867E]" />
            <span className="text-xs text-[#8A867E]">Total</span>
            <span className="text-sm font-semibold text-[#1C1B18]">{reviews.length}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#E9E5DC]">
            <FiCheck className="w-3.5 h-3.5 text-[#2F7A54]" />
            <span className="text-xs text-[#8A867E]">Published</span>
            <span className="text-sm font-semibold text-[#1C1B18]">{publishedCount}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#E9E5DC]">
            <FiClock className="w-3.5 h-3.5 text-[#9C7A1F]" />
            <span className="text-xs text-[#8A867E]">Pending</span>
            <span className="text-sm font-semibold text-[#1C1B18]">{unpublishedCount}</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
                ml-auto
                px-3.5 py-2
                rounded-lg
                bg-white
                border border-[#E9E5DC]
                text-xs font-medium text-[#4A463F]
                outline-none
                cursor-pointer
                transition-all
                focus:border-[#A6803D]
            "
          >
            <option value="all">All reviews</option>
            <option value="published">Published only</option>
            <option value="unpublished">Pending only</option>
          </select>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-[#E9E5DC] rounded-2xl min-h-[320px] flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[#F2EFE7] flex items-center justify-center">
              <FiMessageSquare className="text-[#B4AFA5]" size={26} />
            </div>
            <h3 className="mt-5 text-base font-semibold text-[#1C1B18]">No reviews found</h3>
            <p className="mt-2 text-sm text-[#8A867E]">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onPublishToggle={handlePublishToggle}
                onAdminReply={handleAdminReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}