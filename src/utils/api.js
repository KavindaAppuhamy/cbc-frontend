import axios from "axios";

// Single source of truth for the backend URL. Falls back to localhost so the
// app still runs in dev if VITE_BACKEND_URL hasn't been set yet.
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the saved token to every request automatically instead of every
// page having to remember to do it (this was previously inconsistent and a
// source of silent 401s).
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

// Centralize 401/403 handling so an expired/invalid token always kicks the
// user back to the right login screen instead of showing a blank table.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            const onAdminSide = window.location.pathname.startsWith("/admin");
            // Don't clear/redirect if we're already sitting on a login page.
            const alreadyOnLogin = window.location.pathname === "/admin/login" || window.location.pathname === "/login";
            if (!alreadyOnLogin) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("user");
                window.location.href = onAdminSide ? "/admin/login" : "/login";
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Backends (and this one in particular) are inconsistent about how list
 * endpoints wrap their data: sometimes a raw array, sometimes
 * { data: [...] }, sometimes { products: [...] } / { orders: [...] } /
 * { users: [...] }, sometimes a paginated { items: [...], total, page }.
 * This normalizes all of those shapes into a plain array so pages never
 * crash on `.map is not a function` again.
 */
export function extractList(payload, ...knownKeys) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];

    for (const key of knownKeys) {
        if (Array.isArray(payload[key])) return payload[key];
    }

    const genericKeys = ["data", "items", "results", "list", "docs"];
    for (const key of genericKeys) {
        if (Array.isArray(payload[key])) return payload[key];
    }

    // Last resort: first array value found anywhere on the object.
    const firstArray = Object.values(payload).find((v) => Array.isArray(v));
    return firstArray || [];
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === "string" ? error.response.data : null) ||
        error?.message ||
        fallback
    );
}

export default api;
