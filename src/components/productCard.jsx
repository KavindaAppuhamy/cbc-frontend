import { useEffect, useState } from 'react';
import axios from 'axios';
import { BsStarFill, BsStar } from 'react-icons/bs';

const StarRating = ({ rating = 0, totalReviews = 0 }) => {
  const roundedRating = Math.round(rating); // ensure full star units

  return (
    <div className="flex items-center mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-xl">
          {star <= roundedRating ? (
            <BsStarFill className="text-yellow-400" />
          ) : (
            <BsStar className="text-gray-300" />
          )}
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-500">
        {totalReviews > 0 ? `(${totalReviews} reviews)` : "(No reviews yet)"}
      </span>
    </div>
  );
};

export default function ProductCard({ product }) {
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  const discountPercentage = product?.labelledPrice > product?.price
    ? Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)
    : 0;

  useEffect(() => {
    async function fetchRatingStats() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/reviews/stats/${product.productId}`);
        setRatingStats(res.data);
      } catch (err) {
        console.error("Failed to load review stats", err);
        // Set default values on error
        setRatingStats({ averageRating: 0, totalReviews: 0 });
      } finally {
        setLoading(false);
      }
    }

    if (product?.productId) {
      fetchRatingStats();
    }
  }, [product?.productId]);

  // Use product's embedded rating/totalReviews if available, otherwise use fetched stats
  const displayRating = product?.rating !== undefined ? product.rating : ratingStats.averageRating;
  const displayTotalReviews = product?.totalReviews !== undefined ? product.totalReviews : ratingStats.totalReviews;

  return (
    <div className="w-[300px] h-[450px] flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 m-2 group">
      {/* Image Container */}
      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {product?.images?.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name || "Product"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
            📱
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}

        <div className="absolute top-3 right-3">
          {product?.isAvailable && product?.stock > 0 ? (
            product.stock <= 5 ? (
              <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                Only {product.stock} left
              </div>
            ) : (
              <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                ✓ In Stock
              </div>
            )
          ) : (
            <div className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
              Sold Out
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5 bg-white">
        <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
          {product?.name || "Unnamed Product"}
        </h3>

        {loading ? (
          <div className="flex items-center mb-2">
            <div className="text-sm text-gray-400">Loading reviews...</div>
          </div>
        ) : (
          <StarRating 
            rating={displayRating} 
            totalReviews={displayTotalReviews} 
          />
        )}

        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
          {product?.description?.length > 80 
            ? product.description.substring(0, 80) + "..."
            : product?.description || "No description available"}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              LKR {product?.price?.toFixed(2) || "0.00"}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through font-medium">
                LKR {product?.labelledPrice?.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button 
            className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
              product?.isAvailable && product?.stock > 0
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 hover:border-gray-400'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
            disabled={!product?.isAvailable || product?.stock <= 0}
          >
            {product?.isAvailable && product?.stock > 0 
              ? '🛒 Add to Cart' 
              : '❌ Unavailable'}
          </button>

          <button 
            className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
              product?.isAvailable && product?.stock > 0
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!product?.isAvailable || product?.stock <= 0}
          >
            {product?.isAvailable && product?.stock > 0 
              ? '⚡ Buy Now' 
              : '❌ Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}