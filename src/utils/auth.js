// Small helpers around localStorage so every page reads/writes auth state
// the same way instead of re-implementing token checks inconsistently.

export function saveSession({ token, role, user }) {
    if (token) localStorage.setItem("token", token);
    if (role) localStorage.setItem("role", role);
    if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getRole() {
    return localStorage.getItem("role");
}

export function getUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    return !!getToken();
}

export function isAdmin() {
    return !!getToken() && getRole() === "admin";
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
}
