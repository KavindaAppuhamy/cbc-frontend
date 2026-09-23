import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api, { extractList, getErrorMessage } from "../../utils/api";
import {
    Search,
    RefreshCw,
    AlertTriangle,
    ShoppingBag,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAGE_SIZE = 5;

const STATUS_STYLES = {
    pending: "bg-[#FBF3E3] text-[#9C7A1F]",
    processing: "bg-[#EAF0FB] text-[#3B5FA6]",
    shipped: "bg-[#F0EAFB] text-[#6B4FA6]",
    delivered: "bg-[#EAF3EE] text-[#2F7A54]",
    cancelled: "bg-[#FBEAEA] text-[#B3454B]",
};

function StatusBadge({ status }) {
    return (
        <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                STATUS_STYLES[status] || "bg-[#F5F3EC] text-[#6E6A62]"
            }`}
        >
            {status || "unknown"}
        </span>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [page, setPage] = useState(1);

    function loadOrders() {
        setStatus("loading");
        api.get("/api/orders")
            .then((res) => {
                setOrders(extractList(res.data, "orders"));
                setStatus("success");
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage(
                    getErrorMessage(
                        err,
                        "Could not load orders. The /api/orders endpoint may be missing or requires a different admin permission."
                    )
                );
                setStatus("error");
            });
    }

    useEffect(() => {
        loadOrders();
    }, []);

    // Reset back to page 1 whenever the search term changes.
    useEffect(() => {
        setPage(1);
    }, [search]);

    function updateStatus(order, newStatus) {
        const orderId = order._id || order.orderId;
        setUpdatingId(orderId);
        api.put(`/api/orders/${orderId}`, { status: newStatus })
            .then(() => {
                setOrders((prev) =>
                    prev.map((o) =>
                        (o._id || o.orderId) === orderId ? { ...o, status: newStatus } : o
                    )
                );
                toast.success("Order status updated");
            })
            .catch((err) => toast.error(getErrorMessage(err, "Could not update order status")))
            .finally(() => setUpdatingId(null));
    }

    const filtered = orders.filter((o) => {
        if (!search.trim()) return true;
        const haystack = [o.orderId, o._id, o.email, o.name, o.status]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        return haystack.includes(search.toLowerCase());
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
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

    function getTotal(order) {
        if (order.total !== undefined) return order.total;
        if (order.amount !== undefined) return order.amount;
        if (Array.isArray(order.items)) {
            return order.items.reduce(
                (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
                0
            );
        }
        return null;
    }

    function getItemCount(order) {
        if (Array.isArray(order.items)) return order.items.length;
        if (Array.isArray(order.products)) return order.products.length;
        return null;
    }

    return (
        <div className="w-full h-full max-h-full overflow-y-auto bg-[#F7F6F3] p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE0] border border-[#E3DCCC] mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A6803D]" />
                            <span className="text-[11px] font-semibold tracking-wide text-[#8A7B5C]">
                                Order Management
                            </span>
                        </div>

                        <h1 className="font-serif text-[28px] sm:text-[32px] text-[#1C1B18] leading-tight">
                            Order history
                        </h1>

                        <p className="mt-1.5 text-sm text-[#84807A]">
                            Track orders and update their fulfilment status.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">

                        <div className="relative w-full sm:w-72 lg:w-80">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFA5] pointer-events-none"
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by order ID, customer or status"
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
                            onClick={loadOrders}
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
                            title="Refresh"
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
                            orders
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
                        <p className="mt-5 text-sm text-[#8A867E]">Loading orders…</p>
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
                        <div className="w-12 h-12 rounded-full bg-[#FBEAEA] flex items-center justify-center">
                            <AlertTriangle className="text-[#B3454B]" size={22} />
                        </div>
                        <h2 className="mt-5 text-base font-semibold text-[#1C1B18]">
                            Unable to load orders
                        </h2>
                        <p className="mt-2 text-sm text-[#8A867E] max-w-md leading-6">
                            {errorMessage}
                        </p>
                        <button
                            onClick={loadOrders}
                            className="
                                mt-5 px-5 py-2.5 rounded-lg
                                bg-[#1C1B18] text-white text-sm font-medium
                                hover:bg-[#332F27] transition-colors
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
                        <div className="w-16 h-16 rounded-full bg-[#F2EFE7] flex items-center justify-center">
                            <ShoppingBag className="text-[#B4AFA5]" size={28} />
                        </div>
                        <h2 className="mt-5 text-base font-semibold text-[#1C1B18]">
                            No orders found
                        </h2>
                        <p className="mt-2 text-sm text-[#8A867E]">
                            {search.trim()
                                ? "Try adjusting your search."
                                : "There are no orders yet."}
                        </p>
                        {search.trim() && (
                            <button
                                onClick={() => setSearch("")}
                                className="
                                    mt-5 px-5 py-2.5 rounded-lg
                                    bg-[#1C1B18] text-white text-sm font-medium
                                    hover:bg-[#332F27] transition-colors
                                "
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* Orders */}
                {status === "success" && filtered.length > 0 && (
                    <>

                        {/* ================= DESKTOP ================= */}
                        <div className="hidden md:block">
                            <div className="bg-white border border-[#E9E5DC] rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">

                                        <thead>
                                            <tr className="bg-[#1C1B18]">
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Order ID
                                                </th>
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Customer
                                                </th>
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Date
                                                </th>
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Items
                                                </th>
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Total
                                                </th>
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginated.map((o, i) => {
                                                const orderId = o._id || o.orderId;
                                                const total = getTotal(o);
                                                const items = getItemCount(o);
                                                const isUpdating = updatingId === orderId;

                                                return (
                                                    <tr
                                                        key={orderId || i}
                                                        className="
                                                            border-b border-[#F2EFE7]
                                                            last:border-b-0
                                                            hover:bg-[#FBFAF7]
                                                            transition-colors
                                                        "
                                                    >
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
                                                                {o.orderId || orderId || "—"}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="text-sm text-[#1C1B18]">
                                                                {o.name || o.email || o.userId || "—"}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="text-sm text-[#8A867E]">
                                                                {o.date
                                                                    ? new Date(o.date).toLocaleDateString()
                                                                    : o.createdAt
                                                                    ? new Date(o.createdAt).toLocaleDateString()
                                                                    : "—"}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="text-sm text-[#8A867E]">
                                                                {items ?? "—"}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="text-sm font-semibold text-[#1C1B18]">
                                                                {total !== null
                                                                    ? `LKR ${Number(total).toFixed(2)}`
                                                                    : "—"}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="relative inline-flex items-center w-40">
                                                                <select
                                                                    value={o.status || "pending"}
                                                                    disabled={isUpdating}
                                                                    onChange={(e) =>
                                                                        updateStatus(o, e.target.value)
                                                                    }
                                                                    className={`
                                                                        w-full
                                                                        appearance-none
                                                                        pl-3 pr-8 py-1.5
                                                                        rounded-full
                                                                        text-xs font-medium
                                                                        border border-transparent
                                                                        outline-none
                                                                        cursor-pointer
                                                                        capitalize
                                                                        transition-all
                                                                        disabled:opacity-60
                                                                        disabled:cursor-not-allowed
                                                                        ${
                                                                            STATUS_STYLES[
                                                                                o.status || "pending"
                                                                            ] || "bg-[#F5F3EC] text-[#6E6A62]"
                                                                        }
                                                                    `}
                                                                >
                                                                    {STATUS_OPTIONS.map((s) => (
                                                                        <option key={s} value={s}>
                                                                            {s}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                                {isUpdating ? (
                                                                    <Loader2
                                                                        size={13}
                                                                        className="absolute right-2.5 animate-spin text-[#A6803D]"
                                                                    />
                                                                ) : (
                                                                    <ChevronDown
                                                                        size={13}
                                                                        className="absolute right-2.5 pointer-events-none opacity-60"
                                                                    />
                                                                )}
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
                            {paginated.map((o, i) => {
                                const orderId = o._id || o.orderId;
                                const total = getTotal(o);
                                const items = getItemCount(o);
                                const isUpdating = updatingId === orderId;

                                return (
                                    <div
                                        key={orderId || i}
                                        className="bg-white border border-[#E9E5DC] rounded-2xl p-4"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-[#8A867E]">
                                                {o.orderId || orderId}
                                            </span>
                                            <StatusBadge status={o.status} />
                                        </div>

                                        <p className="font-medium text-[#1C1B18]">
                                            {o.name || o.email || "Customer"}
                                        </p>

                                        <div className="flex items-center justify-between mt-2 text-sm text-[#8A867E]">
                                            <span>
                                                {items !== null ? `${items} item(s)` : ""}
                                            </span>
                                            <span className="font-semibold text-[#1C1B18]">
                                                {total !== null
                                                    ? `LKR ${Number(total).toFixed(2)}`
                                                    : ""}
                                            </span>
                                        </div>

                                        <div className="relative inline-flex items-center w-full mt-3">
                                            <select
                                                value={o.status || "pending"}
                                                disabled={isUpdating}
                                                onChange={(e) => updateStatus(o, e.target.value)}
                                                className="
                                                    w-full
                                                    appearance-none
                                                    pl-3 pr-8 py-2
                                                    rounded-lg
                                                    bg-[#F5F3EC]
                                                    text-xs font-medium
                                                    text-[#6E6A62]
                                                    border border-[#E9E5DC]
                                                    outline-none
                                                    cursor-pointer
                                                    capitalize
                                                    transition-all
                                                    disabled:opacity-60
                                                    disabled:cursor-not-allowed
                                                "
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>

                                            {isUpdating ? (
                                                <Loader2
                                                    size={13}
                                                    className="absolute right-3 animate-spin text-[#A6803D]"
                                                />
                                            ) : (
                                                <ChevronDown
                                                    size={13}
                                                    className="absolute right-3 text-[#B4AFA5] pointer-events-none"
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </>
                )}

                {/* ================= PAGINATION ================= */}
                {status === "success" && filtered.length > 0 && totalPages > 1 && (
                    <div className="mt-6 relative flex items-center justify-center min-h-[36px]">

                        <p className="hidden sm:block absolute left-0 text-xs text-[#8A867E]">
                            Page{" "}
                            <span className="font-semibold text-[#4A463F]">{safePage}</span>{" "}
                            of{" "}
                            <span className="font-semibold text-[#4A463F]">{totalPages}</span>
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
                    </div>
                )}

            </div>
        </div>
    );
}