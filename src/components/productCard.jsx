export default function ProductCard(props){
    const product = props.product;
    
    // Sample product data for demonstration
    const sampleProduct = {
        productId: "PROD001",
        name: "Premium Wireless Headphones",
        altNames: ["BT Headphones", "Wireless Audio"],
        description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 40-hour battery life.",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"],
        labelledPrice: 299.99,
        price: 199.99,
        stock: 15,
        isAvailable: true,
        rating: 4.5,
        totalReviews: 128
    };
    
    // Use sample data if no product is provided
    const displayProduct = product || sampleProduct;
    
    const discountPercentage = displayProduct.labelledPrice > displayProduct.price 
        ? Math.round(((displayProduct.labelledPrice - displayProduct.price) / displayProduct.labelledPrice) * 100)
        : 0;
    
    // Star rating component
    const StarRating = ({ rating, totalReviews }) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 !== 0;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="text-yellow-400">★</span>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-yellow-400">☆</span>
                );
            } else {
                stars.push(
                    <span key={i} className="text-gray-300">☆</span>
                );
            }
        }
        
        return (
            <div className="flex items-center space-x-1 mb-2">
                <div className="flex">{stars}</div>
                <span className="text-xs text-gray-500">
                    ({totalReviews || 0} reviews)
                </span>
            </div>
        );
    };
    
    return(   
        <div className="w-[300px] h-[450px] flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 m-2 group">
            {/* Image Container */}
            <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {displayProduct.images && displayProduct.images.length > 0 ? (
                    <img 
                        src={displayProduct.images[0]} 
                        alt={displayProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                        📱
                    </div>
                )}
                
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {discountPercentage}% OFF
                    </div>
                )}
                
                {/* Availability Status */}
                <div className="absolute top-3 right-3">
                    {displayProduct.isAvailable && displayProduct.stock > 0 ? (
                        displayProduct.stock <= 5 ? (
                            <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                                Only {displayProduct.stock} left
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
                {/* Product Name */}
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
                    {displayProduct.name}
                </h3>
                
                {/* Star Rating */}
                <StarRating rating={displayProduct.rating} totalReviews={displayProduct.totalReviews} />
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                    {displayProduct.description && displayProduct.description.length > 80 
                        ? displayProduct.description.substring(0, 80) + "..."
                        : displayProduct.description || "No description available"
                    }
                </p>
                
                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                            LKR {displayProduct.price?.toFixed(2) || "0.00"}
                        </span>
                        {discountPercentage > 0 && (
                            <span className="text-sm text-gray-400 line-through font-medium">
                                LKR {displayProduct.labelledPrice?.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                    {/* Add to Cart Button */}
                    <button 
                        className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                            displayProduct.isAvailable && displayProduct.stock > 0
                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 hover:border-gray-400'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                        disabled={!displayProduct.isAvailable || displayProduct.stock <= 0}
                    >
                        {displayProduct.isAvailable && displayProduct.stock > 0 
                            ? '🛒 Add to Cart' 
                            : '❌ Unavailable'
                        }
                    </button>
                    
                    {/* Buy Now Button */}
                    <button 
                        className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
                            displayProduct.isAvailable && displayProduct.stock > 0
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!displayProduct.isAvailable || displayProduct.stock <= 0}
                    >
                        {displayProduct.isAvailable && displayProduct.stock > 0 
                            ? '⚡ Buy Now' 
                            : '❌ Unavailable'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}