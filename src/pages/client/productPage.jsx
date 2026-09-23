import { useEffect, useState } from "react";
import api, { extractList, getErrorMessage } from "../../utils/api";
import ProductCard from "../../components/productCard";
import { Search, AlertTriangle, PackageSearch } from "lucide-react";

function SkeletonCard() {
    return (
        <div className="w-full sm:w-[280px] h-[420px] rounded-2xl bg-secondary/60 animate-pulse" />
    );
}

export default function ProductPage({ limit, hideHeading }) {
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [errorMessage, setErrorMessage] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        let mounted = true;
        api.get("/api/products")
            .then((res) => {
                if (!mounted) return;
                setProducts(extractList(res.data, "products"));
                setStatus("success");
            })
            .catch((err) => {
                if (!mounted) return;
                console.error(err);
                setErrorMessage(getErrorMessage(err, "Could not load products right now."));
                setStatus("error");
            });
        return () => { mounted = false; };
    }, []);

    const filtered = query.trim()
        ? products.filter((p) =>
            (p.name || "").toLowerCase().includes(query.toLowerCase()) ||
            (p.productId || "").toLowerCase().includes(query.toLowerCase())
        )
        : products;

    const visible = limit ? filtered.slice(0, limit) : filtered;

    return (
        <div className="w-full">
            {!hideHeading && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Our Products</h1>
                    <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-accent/30 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                        />
                    </div>
                </div>
            )}

            {status === "loading" && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
                    {Array.from({ length: limit || 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {status === "error" && (
                <div className="w-full flex flex-col items-center justify-center py-16 text-center gap-3">
                    <AlertTriangle className="text-red-400" size={36} />
                    <p className="text-ink-soft font-medium">{errorMessage}</p>
                </div>
            )}

            {status === "success" && visible.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center py-16 text-center gap-3">
                    <PackageSearch className="text-ink-soft/40" size={40} />
                    <p className="text-ink-soft font-medium">No products found.</p>
                </div>
            )}

            {status === "success" && visible.length > 0 && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
                    {visible.map((product) => (
                        <ProductCard key={product.productId || product._id} product={product}/>
                    ))}
                </div>
            )}
        </div>
    )
}
