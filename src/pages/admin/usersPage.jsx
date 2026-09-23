import { useEffect, useState } from "react";
import api, { extractList, getErrorMessage } from "../../utils/api";
import { toast } from "react-hot-toast";
import {
    Search,
    RefreshCw,
    AlertTriangle,
    Users as UsersIcon,
    ChevronDown,
    Loader2,
} from "lucide-react";

const ROLES = ["customer", "admin"];

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [savingId, setSavingId] = useState(null);

    function loadUsers() {
        setStatus("loading");
        api.get("/api/users")
            .then((res) => {
                setUsers(extractList(res.data, "users"));
                setStatus("success");
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage(
                    getErrorMessage(
                        err,
                        "Could not load users. The /api/users endpoint may be missing or requires a different admin permission."
                    )
                );
                setStatus("error");
            });
    }

    useEffect(() => {
        loadUsers();
    }, []);

    function updateRole(user, newRole) {
        const id = user._id;
        const prevRole = user.role || "customer";

        if (!id || newRole === prevRole) return;

        // Optimistic update, so the row reflects the choice immediately.
        setUsers((prev) =>
            prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
        setSavingId(id);

        api.patch(`/api/users/${id}/role`, { role: newRole })
            .then(() => {
                toast.success("Role updated");
            })
            .catch((err) => {
                // Revert on failure.
                setUsers((prev) =>
                    prev.map((u) => (u._id === id ? { ...u, role: prevRole } : u))
                );
                toast.error(getErrorMessage(err, "Could not update role"));
            })
            .finally(() => setSavingId(null));
    }

    const filtered = users.filter((u) => {
        if (!search.trim()) return true;
        const haystack = [u.firstName, u.lastName, u.email, u.role, u._id]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        return haystack.includes(search.toLowerCase());
    });

    return (
        <div className="w-full h-full max-h-full overflow-y-auto bg-[#F7F6F3] p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE0] border border-[#E3DCCC] mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A6803D]" />
                            <span className="text-[11px] font-semibold tracking-wide text-[#8A7B5C]">
                                User Management
                            </span>
                        </div>

                        <h1 className="font-serif text-[28px] sm:text-[32px] text-[#1C1B18] leading-tight">
                            Users
                        </h1>

                        <p className="mt-1.5 text-sm text-[#84807A]">
                            View your customers and manage account roles.
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
                                placeholder="Search by name, email or role"
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
                            onClick={loadUsers}
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
                                {filtered.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-[#4A463F]">
                                {users.length}
                            </span>{" "}
                            users
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
                        <p className="mt-5 text-sm text-[#8A867E]">Loading users…</p>
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
                            Unable to load users
                        </h2>
                        <p className="mt-2 text-sm text-[#8A867E] max-w-md leading-6">
                            {errorMessage}
                        </p>
                        <button
                            onClick={loadUsers}
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
                            <UsersIcon className="text-[#B4AFA5]" size={28} />
                        </div>
                        <h2 className="mt-5 text-base font-semibold text-[#1C1B18]">
                            No users found
                        </h2>
                        <p className="mt-2 text-sm text-[#8A867E]">
                            {search.trim()
                                ? "Try adjusting your search."
                                : "There are no registered users yet."}
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

                {/* Users */}
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
                                                    Name
                                                </th>
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Email
                                                </th>
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Joined
                                                </th>
                                                <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#EFEAE0]">
                                                    Role
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filtered.map((u, i) => {
                                                const role = u.role || "customer";
                                                const isAdmin = role === "admin";
                                                const isSaving = savingId === u._id;

                                                return (
                                                    <tr
                                                        key={u._id || u.email || i}
                                                        className="
                                                            border-b border-[#F2EFE7]
                                                            last:border-b-0
                                                            hover:bg-[#FBFAF7]
                                                            transition-colors
                                                        "
                                                    >
                                                        <td className="px-5 py-4">
                                                            <p className="font-medium text-[#1C1B18]">
                                                                {[u.firstName, u.lastName]
                                                                    .filter(Boolean)
                                                                    .join(" ") ||
                                                                    u.name ||
                                                                    "—"}
                                                            </p>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="text-sm text-[#6E6A62]">
                                                                {u.email || "—"}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="text-sm text-[#8A867E]">
                                                                {u.createdAt
                                                                    ? new Date(
                                                                          u.createdAt
                                                                      ).toLocaleDateString()
                                                                    : "—"}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="relative inline-flex items-center w-36">
                                                                <select
                                                                    value={role}
                                                                    disabled={
                                                                        !u._id || isSaving
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateRole(
                                                                            u,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className={`
                                                                        w-full
                                                                        appearance-none
                                                                        pl-3 pr-8 py-1.5
                                                                        rounded-full
                                                                        text-xs font-medium
                                                                        border
                                                                        outline-none
                                                                        cursor-pointer
                                                                        transition-all
                                                                        disabled:opacity-60
                                                                        disabled:cursor-not-allowed
                                                                        ${
                                                                            isAdmin
                                                                                ? "bg-[#F6EFE0] text-[#8A7B5C] border-[#E3DCCC]"
                                                                                : "bg-[#F5F3EC] text-[#6E6A62] border-[#E9E5DC]"
                                                                        }
                                                                    `}
                                                                >
                                                                    {ROLES.map((r) => (
                                                                        <option key={r} value={r}>
                                                                            {r.charAt(0).toUpperCase() +
                                                                                r.slice(1)}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                                {isSaving ? (
                                                                    <Loader2
                                                                        size={13}
                                                                        className="absolute right-2.5 animate-spin text-[#A6803D]"
                                                                    />
                                                                ) : (
                                                                    <ChevronDown
                                                                        size={13}
                                                                        className="absolute right-2.5 text-[#B4AFA5] pointer-events-none"
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
                            {filtered.map((u, i) => {
                                const role = u.role || "customer";
                                const isAdmin = role === "admin";
                                const isSaving = savingId === u._id;

                                return (
                                    <div
                                        key={u._id || u.email || i}
                                        className="bg-white border border-[#E9E5DC] rounded-2xl p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-medium text-[#1C1B18] truncate">
                                                    {[u.firstName, u.lastName]
                                                        .filter(Boolean)
                                                        .join(" ") ||
                                                        u.name ||
                                                        "Unnamed user"}
                                                </p>
                                                <p className="text-sm text-[#8A867E] truncate mt-0.5">
                                                    {u.email}
                                                </p>
                                            </div>

                                            <div className="relative inline-flex items-center w-32 shrink-0">
                                                <select
                                                    value={role}
                                                    disabled={!u._id || isSaving}
                                                    onChange={(e) =>
                                                        updateRole(u, e.target.value)
                                                    }
                                                    className={`
                                                        w-full
                                                        appearance-none
                                                        pl-3 pr-7 py-1.5
                                                        rounded-full
                                                        text-[11px] font-medium
                                                        border
                                                        outline-none
                                                        cursor-pointer
                                                        transition-all
                                                        disabled:opacity-60
                                                        disabled:cursor-not-allowed
                                                        ${
                                                            isAdmin
                                                                ? "bg-[#F6EFE0] text-[#8A7B5C] border-[#E3DCCC]"
                                                                : "bg-[#F5F3EC] text-[#6E6A62] border-[#E9E5DC]"
                                                        }
                                                    `}
                                                >
                                                    {ROLES.map((r) => (
                                                        <option key={r} value={r}>
                                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>

                                                {isSaving ? (
                                                    <Loader2
                                                        size={12}
                                                        className="absolute right-2 animate-spin text-[#A6803D]"
                                                    />
                                                ) : (
                                                    <ChevronDown
                                                        size={12}
                                                        className="absolute right-2 text-[#B4AFA5] pointer-events-none"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {u.createdAt && (
                                            <p className="text-xs text-[#B4AFA5] mt-3">
                                                Joined{" "}
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </>
                )}

            </div>
        </div>
    );
}