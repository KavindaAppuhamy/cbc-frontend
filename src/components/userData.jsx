import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import { LogOut } from "lucide-react";

export default function UserData(){
    const navigate = useNavigate();
    const user = getUser();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return(
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Guest"}
            </h1>
            <button
                onClick={handleLogout}
                className="mt-4 flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition duration-300"
            >
                <LogOut size={16} /> Logout
            </button>
        </div>
    )
}
