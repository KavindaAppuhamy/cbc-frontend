import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import api, { getErrorMessage } from "../../utils/api";
import { Minus, Plus, ShoppingCart, Zap, ChevronLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import ClientReviews from "../../components/clientReviews";
import { addToCart } from "../../utils/cart";

export default function ProductOverview() {
    const params = useParams();
    const productId = params.id;
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // "loading", "error", "success"
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        let mounted = true;
        api.get("/api/products/" + productId).then(
            (response) => {
                if (!mounted) return;
                setProduct(response.data);
                setStatus("success");
            }
        ).catch(
            (error) => {
                if (!mounted) return;
                console.error(error);
                toast.error(getErrorMessage(error, "Failed to load product data."));
                setStatus("error");
            }
        );
        return () => { mounted = false; };
    }, [productId]);

    const handleAddToCart = () => { addToCart(product, quantity); toast.success(`${product.name} added to cart`); };
    const handleBuyNow = () => { addToCart(product, quantity); navigate("/checkout"); };

    const discountPercentage = product?.labelledPrice > product?.price
        ? Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)
        : 0;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
            {status === "loading" && (
                <div className="w-full py-24"><Loading/></div>
            )}

            {status === "error" && (
                <div className="w-full py-24 text-center">
                    <p className="text-ink-soft font-medium mb-4">We couldn't find that product.</p>
                    <Link to="/products" className="text-accent-dark font-semibold hover:underline">← Back to products</Link>
                </div>
            )}

            {status === "success" && product && (
                <div>
                    <Link to="/products" className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-accent-dark mb-6"><ChevronLeft size={16} /> Back to products</Link>
                    <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 lg:gap-12 rounded-[2rem] bg-white border border-gray-100 p-5 sm:p-8 shadow-sm">
                        <ImageSlider images={product.images || []}/>
                        <div className="flex flex-col justify-center">
                            <p className="text-xs font-bold uppercase tracking-[.2em] text-accent-dark mb-2">Crystal Beauty Clear</p>
                            <h1 className="font-display text-3xl sm:text-5xl font-black text-ink leading-tight">{product.name}</h1>
                            <div className="mt-4 flex items-center gap-3"><span className="text-3xl font-black text-ink">LKR {Number(product.price).toFixed(2)}</span>{discountPercentage > 0 && <><span className="text-base text-ink-soft/60 line-through">LKR {Number(product.labelledPrice).toFixed(2)}</span><span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">{discountPercentage}% OFF</span></>}</div>
                            <p className="mt-5 leading-7 text-ink-soft">{product.description || "A carefully selected beauty product for your everyday routine."}</p>
                            <div className="mt-5">{product.stock > 0 ? <span className="font-semibold text-emerald-600">✓ In stock · {product.stock} available</span> : <span className="font-semibold text-red-500">Currently sold out</span>}</div>
                            <div className="mt-6 flex items-center gap-4"><span className="text-sm font-semibold text-ink-soft">Quantity</span><div className="flex items-center overflow-hidden rounded-full border border-accent/30"><button className="w-10 h-10 hover:bg-secondary" onClick={() => setQuantity(q=>Math.max(1,q-1))}><Minus size={16} className="mx-auto"/></button><span className="w-10 text-center font-bold">{quantity}</span><button className="w-10 h-10 hover:bg-secondary" onClick={() => setQuantity(q=>Math.min(product.stock||99,q+1))}><Plus size={16} className="mx-auto"/></button></div></div>
                            <div className="mt-7 flex flex-col sm:flex-row gap-3"><button disabled={!product.stock} onClick={handleAddToCart} className="flex-1 rounded-full border border-accent/40 py-3.5 font-bold hover:bg-secondary disabled:opacity-40"><ShoppingCart size={18} className="inline mr-2"/>Add to Cart</button><button disabled={!product.stock} onClick={handleBuyNow} className="flex-1 rounded-full bg-accent py-3.5 font-bold text-white shadow-md hover:bg-accent-dark disabled:opacity-40"><Zap size={18} className="inline mr-2"/>Buy Now</button></div>
                            <div className="mt-7 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5 text-center text-xs text-ink-soft"><div><Truck className="mx-auto mb-2 text-accent-dark" size={20}/><span>Island-wide delivery</span></div><div><ShieldCheck className="mx-auto mb-2 text-accent-dark" size={20}/><span>Secure checkout</span></div><div><RotateCcw className="mx-auto mb-2 text-accent-dark" size={20}/><span>Support available</span></div></div>
                        </div>
                    </div>
                    <ClientReviews productId={product.productId || product._id}/>
                </div>
            )}
        </div>
    );
}
