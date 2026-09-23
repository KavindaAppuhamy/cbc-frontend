import { useEffect, useMemo, useState } from "react";
import api, { extractList, getErrorMessage } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
    Search,
    RefreshCw,
    AlertTriangle,
    PackageSearch,
    Plus,
    Package,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 5;

export default function AdminProductPage() {
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const navigate = useNavigate();

    function loadProducts() {
        setStatus("loading");

        api.get("/api/products")
            .then((res) => {
                setProducts(extractList(res.data, "products"));
                setStatus("success");
            })
            .catch((err) => {
                console.error(err);

                setErrorMessage(
                    getErrorMessage(
                        err,
                        "Could not load products. Please check the /api/products endpoint."
                    )
                );

                setStatus("error");
            });
    }

    useEffect(() => {
        loadProducts();
    }, []);

    // Reset back to page 1 whenever the search term changes.
    useEffect(() => {
        setPage(1);
    }, [search]);

    function deleteProduct(productId) {
        const token = localStorage.getItem("token");

        if (token == null) {
            toast.error("Please login first");
            return;
        }

        if (!window.confirm("Delete this product? This cannot be undone.")) {
            return;
        }

        api.delete("/api/products/" + productId)
            .then(() => {
                toast.success("Product deleted successfully");

                setProducts((prev) =>
                    prev.filter((p) => p.productId !== productId)
                );
            })
            .catch((e) => {
                toast.error(
                    getErrorMessage(e, "Could not delete product")
                );
            });
    }

    const filtered = products.filter((item) => {
        if (!search.trim()) return true;

        const haystack = [item.productId, item.name]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(search.toLowerCase());
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    // Keep the current page in range if the filtered list shrinks
    // (e.g. after a delete or a new search).
    const safePage = Math.min(page, totalPages);

    useEffect(() => {
        if (page !== safePage) setPage(safePage);
    }, [safePage, page]);

    const paginated = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, safePage]);

    const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

    function goToPage(n) {
        setPage(Math.min(Math.max(1, n), totalPages));
    }

    // Compact page-number list with ellipses for longer runs.
    const pageNumbers = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const nums = new Set([1, totalPages, safePage, safePage - 1, safePage + 1]);
        const sorted = [...nums].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

        const withGaps = [];
        sorted.forEach((n, i) => {
            if (i > 0 && n - sorted[i - 1] > 1) withGaps.push("...");
            withGaps.push(n);
        });

        return withGaps;
    }, [totalPages, safePage]);

    return (
        <div className="w-full h-full max-h-full overflow-y-auto bg-[#F7F6F3] p-4 sm:p-6 lg:p-8 relative pb-28">

            {/* Page Header */}
            <div className="max-w-[1600px] mx-auto">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                    {/* Heading */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE0] border border-[#E3DCCC] mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A6803D]" />
                            <span className="text-[11px] font-semibold tracking-wide text-[#8A7B5C]">
                                Product Management
                            </span>
                        </div>

                        <h1 className="font-serif text-[28px] sm:text-[32px] text-[#1C1B18] leading-tight">
                            Products
                        </h1>

                        <p className="mt-1.5 text-sm text-[#84807A]">
                            Manage your catalogue, pricing and inventory in one place.
                        </p>
                    </div>

                    {/* Search + Refresh */}
                    <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">

                        <div className="relative w-full sm:w-72 lg:w-80">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFA5] pointer-events-none"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or product ID"
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
                            onClick={loadProducts}
                            disabled={status === "loading"}
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
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                            title="Refresh products"
                        >
                            <RefreshCw
                                size={15}
                                className={status === "loading" ? "animate-spin" : ""}
                            />
                            <span className="sm:hidden">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Result count */}
                {status === "success" && filtered.length > 0 && (
                    <div className="flex items-center justify-between mb-3 px-1">
                        <p className="text-xs text-[#8A867E]">
                            Showing{" "}
                            <span className="font-semibold text-[#4A463F]">
                                {rangeStart}–{rangeEnd}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-[#4A463F]">
                                {filtered.length}
                            </span>{" "}
                            products
                        </p>

                        {search.trim() && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-xs font-medium text-[#8A7B5C] hover:text-[#A6803D] transition-colors"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* Loading */}
                {status === "loading" && (
                    <div className="
                        bg-white
                        border border-[#E9E5DC]
                        rounded-2xl
                        min-h-[420px]
                        flex flex-col items-center justify-center
                    ">
                        <div className="
                            w-10 h-10
                            rounded-full
                            border-[3px]
                            border-[#EAE6DC]
                            border-t-[#A6803D]
                            animate-spin
                        " />

                        <p className="mt-5 text-sm text-[#8A867E]">
                            Loading products…
                        </p>
                    </div>
                )}

                {/* Error */}
                {status === "error" && (
                    <div className="
                        bg-white
                        border border-[#E9E5DC]
                        rounded-2xl
                        min-h-[420px]
                        flex flex-col items-center justify-center
                        text-center
                        px-6
                    ">
                        <div className="
                            w-12 h-12
                            rounded-full
                            bg-[#FBEAEA]
                            flex items-center justify-center
                        ">
                            <AlertTriangle
                                className="text-[#B3454B]"
                                size={22}
                            />
                        </div>

                        <h2 className="mt-5 text-base font-semibold text-[#1C1B18]">
                            Unable to load products
                        </h2>

                        <p className="mt-2 text-sm text-[#8A867E] max-w-md leading-6">
                            {errorMessage}
                        </p>

                        <button
                            onClick={loadProducts}
                            className="
                                mt-5
                                px-5 py-2.5
                                rounded-lg
                                bg-[#1C1B18]
                                text-white
                                text-sm font-medium
                                hover:bg-[#332F27]
                                transition-colors
                            "
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {status === "success" && filtered.length === 0 && (
                    <div className="
                        bg-white
                        border border-[#E9E5DC]
                        rounded-2xl
                        min-h-[420px]
                        flex flex-col items-center justify-center
                        text-center
                        px-6
                    ">
                        <div className="
                            w-16 h-16
                            rounded-full
                            bg-[#F2EFE7]
                            flex items-center justify-center
                        ">
                            <PackageSearch
                                className="text-[#B4AFA5]"
                                size={28}
                            />
                        </div>

                        <h2 className="mt-5 text-base font-semibold text-[#1C1B18]">
                            No products found
                        </h2>

                        <p className="mt-2 text-sm text-[#8A867E]">
                            {search.trim()
                                ? "Try adjusting your search."
                                : "You haven't added any products yet."}
                        </p>

                        {search.trim() ? (
                            <button
                                onClick={() => setSearch("")}
                                className="
                                    mt-5
                                    px-5 py-2.5
                                    rounded-lg
                                    bg-[#1C1B18]
                                    text-white
                                    text-sm font-medium
                                    hover:bg-[#332F27]
                                    transition-colors
                                "
                            >
                                Clear search
                            </button>
                        ) : (
                            <Link
                                to="/admin/add-product"
                                className="
                                    mt-5
                                    inline-flex items-center gap-2
                                    px-5 py-2.5
                                    rounded-lg
                                    bg-[#1C1B18]
                                    text-white
                                    text-sm font-medium
                                    hover:bg-[#332F27]
                                    transition-colors
                                "
                            >
                                <Plus size={16} />
                                Add product
                            </Link>
                        )}
                    </div>
                )}

                {/* Products */}
                {status === "success" && filtered.length > 0 && (
                    <>

                        {/* ================= DESKTOP ================= */}
                        <div className="hidden md:block">

                            <div className="
                                bg-white
                                border border-[#E9E5DC]
                                rounded-2xl
                                overflow-hidden
                            ">

                                <div className="overflow-x-auto">
                                    <table className="min-w-full">

                                        <thead>
                                            <tr className="bg-[#1C1B18]">

                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Product
                                                </th>

                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Product ID
                                                </th>

                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Labelled price
                                                </th>

                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Selling price
                                                </th>

                                                <th className="text-center px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Stock
                                                </th>

                                                <th className="text-right px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Actions
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginated.map((item, index) => {

                                                const stock = Number(item.stock || 0);
                                                const isOutOfStock = stock <= 0;
                                                const isLowStock = stock > 0 && stock <= 5;

                                                return (
                                                    <tr
                                                        key={item.productId || index}
                                                        className="
                                                            border-b border-[#F2EFE7]
                                                            last:border-b-0
                                                            hover:bg-[#FBFAF7]
                                                            transition-colors
                                                        "
                                                    >

                                                        {/* Product */}
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3.5 min-w-[240px]">

                                                                <div className="
                                                                    w-12 h-12
                                                                    rounded-xl
                                                                    bg-[#F5F3EC]
                                                                    overflow-hidden
                                                                    shrink-0
                                                                ">
                                                                    {item.images?.[0] ? (
                                                                        <img
                                                                            src={item.images[0]}
                                                                            alt={item.name}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center">
                                                                            <Package
                                                                                size={18}
                                                                                className="text-[#C7C2B6]"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="font-medium text-[#1C1B18] truncate max-w-[260px]">
                                                                        {item.name}
                                                                    </p>

                                                                    <p className="text-xs text-[#B4AFA5] mt-0.5">
                                                                        {item.images?.length || 0}{" "}
                                                                        {item.images?.length === 1
                                                                            ? "image"
                                                                            : "images"}
                                                                    </p>
                                                                </div>

                                                            </div>
                                                        </td>

                                                        {/* ID */}
                                                        <td className="px-5 py-4">
                                                            <span className="
                                                                inline-flex
                                                                px-2.5 py-1
                                                                rounded-md
                                                                bg-[#F5F3EC]
                                                                text-xs
                                                                font-medium
                                                                text-[#6E6A62]
                                                            ">
                                                                {item.productId}
                                                            </span>
                                                        </td>

                                                        {/* Labelled */}
                                                        <td className="px-5 py-4">
                                                            <span className="text-sm text-[#B4AFA5] line-through">
                                                                ${item.labelledPrice}
                                                            </span>
                                                        </td>

                                                        {/* Selling */}
                                                        <td className="px-5 py-4">
                                                            <span className="text-sm font-semibold text-[#1C1B18]">
                                                                ${item.price}
                                                            </span>
                                                        </td>

                                                        {/* Stock */}
                                                        <td className="px-5 py-4 text-center">
                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    min-w-[56px]
                                                                    justify-center
                                                                    px-2.5 py-1
                                                                    rounded-full
                                                                    text-xs
                                                                    font-medium
                                                                    ${
                                                                        isOutOfStock
                                                                            ? "bg-[#FBEAEA] text-[#B3454B]"
                                                                            : isLowStock
                                                                                ? "bg-[#FBF3E3] text-[#9C7A1F]"
                                                                                : "bg-[#EAF3EE] text-[#2F7A54]"
                                                                    }
                                                                `}
                                                            >
                                                                {isOutOfStock
                                                                    ? "Out"
                                                                    : stock}
                                                            </span>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-5 py-4">
                                                            <div className="flex justify-end items-center gap-2">

                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            "/admin/edit-product",
                                                                            {
                                                                                state: item,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="
                                                                        w-8 h-8
                                                                        rounded-lg
                                                                        border border-[#E9E5DC]
                                                                        bg-white
                                                                        text-[#8A867E]
                                                                        flex items-center justify-center
                                                                        hover:text-[#A6803D]
                                                                        hover:border-[#D9CBA6]
                                                                        transition-all
                                                                    "
                                                                    title="Edit product"
                                                                >
                                                                    <FaEdit size={13} />
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        deleteProduct(
                                                                            item.productId
                                                                        )
                                                                    }
                                                                    className="
                                                                        w-8 h-8
                                                                        rounded-lg
                                                                        bg-[#FBEAEA]
                                                                        text-[#B3454B]
                                                                        flex items-center justify-center
                                                                        hover:bg-[#F5D9D9]
                                                                        transition-all
                                                                    "
                                                                    title="Delete product"
                                                                >
                                                                    <FaTrash size={12} />
                                                                </button>

                                                            </div>
                                                        </td>

                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* ================= MOBILE ================= */}
                        <div className="md:hidden flex flex-col gap-3">

                            {paginated.map((item, index) => {

                                const stock = Number(item.stock || 0);
                                const isOutOfStock = stock <= 0;
                                const isLowStock = stock > 0 && stock <= 5;

                                return (
                                    <div
                                        key={item.productId || index}
                                        className="
                                            bg-white
                                            border border-[#E9E5DC]
                                            rounded-2xl
                                            p-4
                                        "
                                    >

                                        <div className="flex gap-3.5">

                                            {/* Image */}
                                            <div className="
                                                w-16 h-16
                                                rounded-xl
                                                bg-[#F5F3EC]
                                                overflow-hidden
                                                shrink-0
                                            ">
                                                {item.images?.[0] ? (
                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package
                                                            size={22}
                                                            className="text-[#C7C2B6]"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Main information */}
                                            <div className="flex-1 min-w-0">

                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <h3 className="font-medium text-[#1C1B18] truncate">
                                                            {item.name}
                                                        </h3>

                                                        <p className="text-[11px] text-[#B4AFA5] mt-1 truncate">
                                                            ID: {item.productId}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`
                                                            shrink-0
                                                            px-2 py-1
                                                            rounded-full
                                                            text-[10px]
                                                            font-medium
                                                            ${
                                                                isOutOfStock
                                                                    ? "bg-[#FBEAEA] text-[#B3454B]"
                                                                    : isLowStock
                                                                        ? "bg-[#FBF3E3] text-[#9C7A1F]"
                                                                        : "bg-[#EAF3EE] text-[#2F7A54]"
                                                            }
                                                        `}
                                                    >
                                                        {isOutOfStock
                                                            ? "Out"
                                                            : `${stock} in stock`}
                                                    </span>
                                                </div>

                                                <div className="flex items-end gap-2 mt-3">
                                                    <span className="text-base font-semibold text-[#1C1B18]">
                                                        ${item.price}
                                                    </span>

                                                    <span className="text-xs text-[#B4AFA5] line-through">
                                                        ${item.labelledPrice}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-[#F2EFE7] my-3.5" />

                                        {/* Bottom row */}
                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-1.5 text-xs text-[#B4AFA5]">
                                                <Package size={13} />
                                                <span>
                                                    {item.images?.length || 0}{" "}
                                                    {item.images?.length === 1
                                                        ? "image"
                                                        : "images"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            "/admin/edit-product",
                                                            {
                                                                state: item,
                                                            }
                                                        )
                                                    }
                                                    className="
                                                        inline-flex items-center gap-1.5
                                                        px-3 py-2
                                                        rounded-lg
                                                        bg-[#F5F3EC]
                                                        text-xs font-medium
                                                        text-[#6E6A62]
                                                        hover:text-[#A6803D]
                                                        transition-all
                                                    "
                                                >
                                                    <FaEdit size={12} />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteProduct(
                                                            item.productId
                                                        )
                                                    }
                                                    className="
                                                        w-9 h-9
                                                        rounded-lg
                                                        bg-[#FBEAEA]
                                                        text-[#B3454B]
                                                        flex items-center justify-center
                                                        hover:bg-[#F5D9D9]
                                                        transition-all
                                                    "
                                                    title="Delete product"
                                                >
                                                    <FaTrash size={12} />
                                                </button>

                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                    </>
                )}

                {/* ================= PAGINATION + ADD PRODUCT ================= */}
                {status === "success" && filtered.length > 0 && (
                    <div className="mt-6 relative flex items-center justify-center min-h-[36px]">

                        {totalPages > 1 && (
                            <>
                                <p className="hidden sm:block absolute left-0 text-xs text-[#8A867E]">
                                    Page{" "}
                                    <span className="font-semibold text-[#4A463F]">
                                        {safePage}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-[#4A463F]">
                                        {totalPages}
                                    </span>
                                </p>

                                <div className="flex items-center gap-1.5">

                                    <button
                                        onClick={() => goToPage(safePage - 1)}
                                        disabled={safePage === 1}
                                        className="
                                            w-8 h-8
                                            rounded-lg
                                            border border-[#E9E5DC]
                                            flex items-center justify-center
                                            text-[#6E6A62]
                                            hover:border-[#D9CBA6]
                                            hover:text-[#A6803D]
                                            disabled:opacity-40
                                            disabled:hover:border-[#E9E5DC]
                                            disabled:hover:text-[#6E6A62]
                                            disabled:cursor-not-allowed
                                            transition-all
                                        "
                                        title="Previous page"
                                    >
                                        <ChevronLeft size={15} />
                                    </button>

                                    {pageNumbers.map((n, i) =>
                                        n === "..." ? (
                                            <span
                                                key={`ellipsis-${i}`}
                                                className="w-8 h-8 flex items-center justify-center text-xs text-[#B4AFA5]"
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={n}
                                                onClick={() => goToPage(n)}
                                                aria-current={n === safePage ? "page" : undefined}
                                                className={`
                                                    w-8 h-8
                                                    rounded-lg
                                                    text-xs font-medium
                                                    transition-all
                                                    ${
                                                        n === safePage
                                                            ? "bg-[#1C1B18] text-white"
                                                            : "text-[#6E6A62] hover:bg-[#F5F3EC]"
                                                    }
                                                `}
                                            >
                                                {n}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => goToPage(safePage + 1)}
                                        disabled={safePage === totalPages}
                                        className="
                                            w-8 h-8
                                            rounded-lg
                                            border border-[#E9E5DC]
                                            flex items-center justify-center
                                            text-[#6E6A62]
                                            hover:border-[#D9CBA6]
                                            hover:text-[#A6803D]
                                            disabled:opacity-40
                                            disabled:hover:border-[#E9E5DC]
                                            disabled:hover:text-[#6E6A62]
                                            disabled:cursor-not-allowed
                                            transition-all
                                        "
                                        title="Next page"
                                    >
                                        <ChevronRight size={15} />
                                    </button>

                                </div>
                            </>
                        )}

                        {/* Add product — same row, same size/alignment as the page buttons */}
                        <Link
                            to="/admin/add-product"
                            className="
                                absolute right-0
                                w-8 h-8
                                rounded-lg
                                flex items-center justify-center
                                shrink-0
                                bg-[#1C1B18]
                                hover:bg-[#332F27]
                                text-white
                                transition-all
                            "
                            title="Add product"
                        >
                            <Plus size={16} />
                        </Link>

                    </div>
                )}

            </div>
        </div>
    );
}