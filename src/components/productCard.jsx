import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { ShoppingCart, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { addToCart } from '../utils/cart';

/* =========================================================
   STAR RATING
========================================================= */
const StarRating = ({ rating = 0, totalReviews = 0 }) => {
  const roundedRating = Math.round(Number(rating) || 0);

  return (
    <div className="flex h-5 items-center gap-2">
      <div className="flex items-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="flex h-3.5 w-3.5 items-center justify-center"
          >
            {star <= roundedRating ? (
              <BsStarFill className="text-[12px] text-amber-400" />
            ) : (
              <BsStar className="text-[12px] text-gray-300" />
            )}
          </span>
        ))}
      </div>

      <span className="truncate text-[11px] font-medium text-gray-500">
        {totalReviews > 0
          ? `${totalReviews} ${
              totalReviews === 1 ? 'review' : 'reviews'
            }`
          : 'No reviews'}
      </span>
    </div>
  );
};

/* =========================================================
   PRODUCT CARD
========================================================= */
export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

  const [loading, setLoading] = useState(true);

  /* =======================================================
     DISCOUNT
  ======================================================= */
  const discountPercentage =
    product?.labelledPrice > product?.price
      ? Math.round(
          ((Number(product.labelledPrice) - Number(product.price)) /
            Number(product.labelledPrice)) *
            100
        )
      : 0;

  /* =======================================================
     REVIEWS
  ======================================================= */
  useEffect(() => {
    let active = true;

    if (!product?.productId) {
      setLoading(false);
      return;
    }

    api
      .get(`/api/reviews/stats/${product.productId}`)
      .then((res) => {
        if (active && res?.data) {
          setRatingStats({
            averageRating: Number(res.data.averageRating) || 0,
            totalReviews: Number(res.data.totalReviews) || 0,
          });
        }
      })
      .catch(() => {
        // Keep default rating values if request fails.
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [product?.productId]);

  /* =======================================================
     AVAILABILITY
  ======================================================= */
  const available =
    Boolean(product?.isAvailable) && Number(product?.stock) > 0;

  /* =======================================================
     ADD TO CART
  ======================================================= */
  const add = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!available) return;

    addToCart(product, 1);

    toast.success(`${product.name} added to cart`);
  };

  /* =======================================================
     BUY NOW
  ======================================================= */
  const buy = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!available) return;

    addToCart(product, 1);
    navigate('/checkout');
  };

  /* =======================================================
     DISPLAY RATING
  ======================================================= */
  const displayRating =
    product?.rating !== undefined
      ? Number(product.rating) || 0
      : ratingStats.averageRating;

  const displayTotalReviews =
    product?.totalReviews !== undefined
      ? Number(product.totalReviews) || 0
      : ratingStats.totalReviews;

  /* =======================================================
     DESCRIPTION
  ======================================================= */
  const description = product?.description
    ? product.description
    : 'No description available';

  /* =======================================================
     RENDER
  ======================================================= */
  return (
    <Link
      to={`/overview/${product.productId}`}
      className="
        group
        flex
        w-full
        max-w-[310px]
        flex-col
        overflow-hidden
        rounded-[22px]
        border
        border-gray-100
        bg-white
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-gray-200
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
      "
    >
      {/* ===================================================
          PRODUCT IMAGE
      =================================================== */}
      <div
        className="
          relative
          h-[210px]
          w-full
          shrink-0
          overflow-hidden
          bg-gradient-to-br
          from-gray-50
          via-gray-100
          to-gray-200
        "
      >
        {product?.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name || 'Product'}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.045]
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-gray-300">
            📱
          </div>
        )}

        {/* Image overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/10
            via-transparent
            to-transparent
          "
        />

        {/* =================================================
            DISCOUNT BADGE
        ================================================= */}
        {discountPercentage > 0 && (
          <div
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-[11px]
              font-bold
              tracking-wide
              text-red-600
              shadow-sm
              backdrop-blur-md
            "
          >
            {discountPercentage}% OFF
          </div>
        )}

        {/* =================================================
            STOCK BADGE
        ================================================= */}
        <div className="absolute right-3 top-3">
          {available ? (
            <div
              className={`
                rounded-full
                px-3
                py-1.5
                text-[11px]
                font-semibold
                text-white
                shadow-sm
                backdrop-blur-md
                ${
                  Number(product.stock) <= 5
                    ? 'bg-amber-500/95'
                    : 'bg-emerald-500/95'
                }
              `}
            >
              {Number(product.stock) <= 5
                ? `Only ${product.stock} left`
                : '✓ In Stock'}
            </div>
          ) : (
            <div
              className="
                rounded-full
                bg-gray-700/90
                px-3
                py-1.5
                text-[11px]
                font-semibold
                text-white
                shadow-sm
                backdrop-blur-md
              "
            >
              Sold Out
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          PRODUCT INFORMATION
      =================================================== */}
      <div
        className="
          flex
          min-h-[260px]
          flex-1
          flex-col
          px-5
          pb-5
          pt-4
        "
      >
        {/* =================================================
            PRODUCT NAME
        ================================================= */}
        <div className="h-[46px] shrink-0 overflow-hidden">
          <h3
            className="
              line-clamp-2
              text-[17px]
              font-semibold
              leading-[1.35]
              tracking-[-0.01em]
              text-gray-900
              transition-colors
              duration-200
              group-hover:text-gray-700
            "
          >
            {product?.name || 'Unnamed Product'}
          </h3>
        </div>

        {/* =================================================
            RATING
        ================================================= */}
        <div className="mt-1 h-[25px] shrink-0">
          {loading ? (
            <div className="flex h-5 items-center text-[11px] text-gray-400">
              Loading reviews...
            </div>
          ) : (
            <StarRating
              rating={displayRating}
              totalReviews={displayTotalReviews}
            />
          )}
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}
        <div className="mt-2 h-[56px] shrink-0 overflow-hidden">
          <p
            className="
              line-clamp-3
              text-[13px]
              leading-[1.45]
              text-gray-500
            "
          >
            {description}
          </p>
        </div>

        {/* =================================================
            FLEXIBLE SPACE
        ================================================= */}
        <div className="min-h-[18px] flex-1" />

        {/* =================================================
            PRICE
        ================================================= */}
        <div className="flex min-h-[42px] shrink-0 items-center">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            <span
              className="
                whitespace-nowrap
                text-[20px]
                font-bold
                tracking-tight
                text-gray-900
              "
            >
              LKR {Number(product?.price || 0).toFixed(2)}
            </span>

            {discountPercentage > 0 && (
              <span
                className="
                  whitespace-nowrap
                  text-xs
                  font-medium
                  text-gray-400
                  line-through
                "
              >
                LKR {Number(product.labelledPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}
        <div
          className="
            mt-3
            grid
            min-h-[42px]
            grid-cols-2
            gap-2.5
          "
        >
          {/* ADD TO CART */}
          <button
            type="button"
            onClick={add}
            disabled={!available}
            className={`
              flex
              h-[42px]
              min-w-0
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              px-2.5
              text-xs
              font-semibold
              transition-all
              duration-200
              ${
                available
                  ? `
                    border-gray-200
                    bg-gray-50
                    text-gray-800
                    hover:border-gray-300
                    hover:bg-gray-100
                    active:scale-[0.98]
                  `
                  : `
                    cursor-not-allowed
                    border-gray-100
                    bg-gray-100
                    text-gray-400
                  `
              }
            `}
          >
            <ShoppingCart
              size={15}
              strokeWidth={2}
              className="shrink-0"
            />

            <span className="truncate whitespace-nowrap">
              {available ? 'Add to Cart' : 'Unavailable'}
            </span>
          </button>

          {/* BUY NOW */}
          <button
            type="button"
            onClick={buy}
            disabled={!available}
            className={`
              flex
              h-[42px]
              min-w-0
              items-center
              justify-center
              gap-1.5
              rounded-xl
              px-2.5
              text-xs
              font-semibold
              transition-all
              duration-200
              ${
                available
                  ? `
                    bg-accent
                    text-white
                    shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                    hover:bg-accent-dark
                    hover:shadow-[0_8px_22px_rgba(0,0,0,0.16)]
                    active:scale-[0.98]
                  `
                  : `
                    cursor-not-allowed
                    bg-gray-200
                    text-gray-500
                  `
              }
            `}
          >
            <Zap
              size={15}
              strokeWidth={2.2}
              className="shrink-0"
            />

            <span className="truncate whitespace-nowrap">
              {available ? 'Buy Now' : 'Unavailable'}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}

