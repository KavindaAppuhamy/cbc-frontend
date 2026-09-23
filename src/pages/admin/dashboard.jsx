import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Users, ShoppingBag, Star, TrendingUp, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api, { extractList, getErrorMessage } from "../../utils/api";

function Stat({ icon: Icon, label, value, to }) {
    return (
        <Link
            to={to}
            className="
                bg-white
                rounded-2xl
                p-5
                border border-[#E9E5DC]
                hover:border-[#D9CBA6]
                transition-all
            "
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-[#8A867E]">{label}</p>
                    <p className="text-3xl font-semibold text-[#1C1B18] mt-1">{value}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#F6EFE0] text-[#A6803D] flex items-center justify-center shrink-0">
                    <Icon size={20} />
                </div>
            </div>
        </Link>
    );
}

function BarChart({ data, title }) {
    const max = Math.max(1, ...data.map((d) => d.value));

    return (
        <div className="bg-white rounded-2xl border border-[#E9E5DC] p-5">
            <h3 className="font-medium text-[#1C1B18] mb-5">{title}</h3>
            <div className="h-48 flex items-end gap-3 border-b border-[#F2EFE7] px-2">
                {data.map((d) => (
                    <div
                        key={d.label}
                        className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                    >
                        <div
                            title={`${d.label}: ${d.value}`}
                            className="w-full max-w-10 bg-[#A6803D] rounded-t-md min-h-[3px]"
                            style={{ height: `${Math.max(3, (d.value / max) * 82)}%` }}
                        />
                        <span className="text-[10px] text-[#B4AFA5] truncate max-w-full">
                            {d.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Donut({ data, title }) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let cursor = 0;
    const stops = data
        .map((d) => {
            const a = (cursor / total) * 360;
            cursor += d.value;
            return `${d.color} ${a}deg ${(cursor / total) * 360}deg`;
        })
        .join(",");

    return (
        <div className="bg-white rounded-2xl border border-[#E9E5DC] p-5">
            <h3 className="font-medium text-[#1C1B18] mb-5">{title}</h3>
            <div className="flex items-center gap-6">
                <div
                    className="w-36 h-36 rounded-full relative shrink-0"
                    style={{ background: `conic-gradient(${stops})` }}
                >
                    <div className="absolute inset-5 rounded-full bg-white flex items-center justify-center font-semibold text-[#1C1B18]">
                        {total}
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    {data.map((d) => (
                        <div key={d.label} className="flex items-center gap-2">
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ background: d.color }}
                            />
                            <span className="text-[#6E6A62]">{d.label}</span>
                            <b className="text-[#1C1B18]">{d.value}</b>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LineChart({ orders, title }) {
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
            key: `${d.getFullYear()}-${d.getMonth()}`,
            label: d.toLocaleString("en", { month: "short" }),
            value: orders.filter((o) => {
                const x = new Date(o.date);
                return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth();
            }).length,
        };
    });

    const max = Math.max(1, ...months.map((m) => m.value));
    const points = months
        .map((m, i) => `${i * (100 / (months.length - 1))},${90 - (m.value / max) * 70}`)
        .join(" ");

    return (
        <div className="bg-white rounded-2xl border border-[#E9E5DC] p-5">
            <h3 className="font-medium text-[#1C1B18] mb-5">{title}</h3>
            <svg viewBox="0 0 100 100" className="w-full h-48">
                <polyline
                    fill="none"
                    stroke="#A6803D"
                    strokeWidth="1.8"
                    points={points}
                />
                {months.map((m, i) => (
                    <g key={m.key}>
                        <circle
                            cx={i * (100 / (months.length - 1))}
                            cy={90 - (m.value / max) * 70}
                            r="2"
                            fill="#A6803D"
                        />
                        <text
                            x={i * (100 / (months.length - 1))}
                            y="98"
                            textAnchor="middle"
                            fontSize="5"
                            fill="#B4AFA5"
                        >
                            {m.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

export default function AdminDashboard() {
    const [data, setData] = useState({ products: [], users: [], orders: [], reviews: [] });
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        Promise.allSettled([
            api.get("/api/products"),
            api.get("/api/users"),
            api.get("/api/orders"),
            api.get("/api/reviews"),
        ])
            .then((r) => {
                const next = {
                    products: r[0].status === "fulfilled" ? extractList(r[0].value.data, "products") : [],
                    users: r[1].status === "fulfilled" ? extractList(r[1].value.data, "users") : [],
                    orders: r[2].status === "fulfilled" ? extractList(r[2].value.data, "orders") : [],
                    reviews: r[3].status === "fulfilled" ? extractList(r[3].value.data, "reviews") : [],
                };
                setData(next);
                if (r.some((x) => x.status === "rejected")) {
                    toast.error("Some dashboard data could not be loaded");
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const statuses = useMemo(
        () =>
            ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => ({
                label: s,
                value: data.orders.filter((o) => o.status === s).length,
            })),
        [data.orders]
    );

    const stock = useMemo(
        () =>
            data.products.slice(0, 8).map((p) => ({
                label: (p.name || "Product").slice(0, 10),
                value: Number(p.stock || 0),
            })),
        [data.products]
    );

    const roles = useMemo(
        () => [
            {
                label: "Customers",
                value: data.users.filter((u) => u.role !== "admin").length,
                color: "#A6803D",
            },
            {
                label: "Admins",
                value: data.users.filter((u) => u.role === "admin").length,
                color: "#6B7A99",
            },
        ],
        [data.users]
    );

    const ratings = useMemo(
        () =>
            [1, 2, 3, 4, 5].map((n) => ({
                label: `${n}★`,
                value: data.reviews.filter((r) => Number(r.rating) === n).length,
                color: ["#B3454B", "#C97B4A", "#C9A227", "#7C9885", "#2F7A54"][n - 1],
            })),
        [data.reviews]
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#F7F6F3] min-h-full">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE0] border border-[#E3DCCC] mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A6803D]" />
                            <span className="text-[11px] font-semibold tracking-wide text-[#8A7B5C]">
                                Overview
                            </span>
                        </div>

                        <h1 className="font-serif text-[28px] sm:text-[32px] text-[#1C1B18] leading-tight">
                            Dashboard
                        </h1>
                        <p className="mt-1.5 text-sm text-[#84807A]">
                            Store performance at a glance.
                        </p>
                    </div>

                    <button
                        onClick={load}
                        disabled={loading}
                        className="
                            w-11 h-11
                            rounded-lg
                            bg-white
                            border border-[#E5E1D8]
                            flex items-center justify-center
                            text-[#4A463F]
                            shadow-[0_1px_2px_rgba(28,27,24,0.04)]
                            hover:border-[#D6D0C2]
                            active:scale-[0.98]
                            transition-all
                            disabled:opacity-60
                            shrink-0
                        "
                        title="Refresh"
                    >
                        <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    <Stat icon={Package} label="Products" value={data.products.length} to="/admin/products" />
                    <Stat icon={Users} label="Users" value={data.users.length} to="/admin/users" />
                    <Stat icon={ShoppingBag} label="Orders" value={data.orders.length} to="/admin/orders" />
                    <Stat icon={Star} label="Reviews" value={data.reviews.length} to="/admin/reviews" />
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-5">
                    <BarChart data={statuses} title="Orders by status" />
                    <LineChart orders={data.orders} title="Orders — last 6 months" />
                    <BarChart data={stock} title="Current product stock" />
                    <Donut data={roles} title="Users by role" />
                    <Donut data={ratings} title="Review rating distribution" />

                    <div className="bg-[#1C1B18] rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp size={20} className="text-[#D9C79A]" />
                            <h3 className="font-medium">Store snapshot</h3>
                        </div>
                        <p className="text-[#C7C2B6] text-sm leading-6">
                            {data.orders.length
                                ? `The store currently has ${data.orders.length} order(s), ${data.products.length} product(s), ${data.users.length} user(s), and ${data.reviews.length} review(s).`
                                : "Once orders are placed, the dashboard will build historical order trends automatically."}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}