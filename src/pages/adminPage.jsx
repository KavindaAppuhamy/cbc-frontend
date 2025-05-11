import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, Star, Menu, X } from "lucide-react";

export default function AdminPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="w-full h-screen flex font-sans bg-gray-100">
            {/* Sidebar */}
            <div
                className={`h-full ${isSidebarOpen ? "w-64" : "w-16"} bg-[#154570] text-white flex flex-col p-4 transition-all duration-300 shadow-lg z-10`}
                onMouseEnter={() => setIsSidebarOpen(true)}
                onMouseLeave={() => setIsSidebarOpen(false)}
            >
                <div className="flex items-center space-x-2 mb-8">
                    <img
                        src="/eventora.png"
                        alt="Eventora Logo"
                        className={`transition-all duration-300 ${isSidebarOpen ? "w-12" : "w-8"} rounded-lg`}
                    />
                    {isSidebarOpen && <span className="text-xl font-bold">Eventora</span>}
                </div>
                <nav className="space-y-4">
                    <Link to="/admin/products" className="flex items-center space-x-2 hover:bg-blue-700 p-2 rounded-md transition">
                        <ShoppingCart size={20} />
                        {isSidebarOpen && <span>Events</span>}
                    </Link>
                    <Link to="/admin/users" className="flex items-center space-x-2 hover:bg-blue-700 p-2 rounded-md transition">
                        <Users size={20} />
                        {isSidebarOpen && <span>Users</span>}
                    </Link>
                    <Link to="/admin/orders" className="flex items-center space-x-2 hover:bg-blue-700 p-2 rounded-md transition">
                        <LayoutDashboard size={20} />
                        {isSidebarOpen && <span>Bookings</span>}
                    </Link>
                    <Link to="/admin/reviews" className="flex items-center space-x-2 hover:bg-blue-700 p-2 rounded-md transition">
                        <Star size={20} />
                        {isSidebarOpen && <span>Reviews</span>}
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
                    <h1 className="text-3xl font-bold mb-4 text-[#154570]">Welcome to Admin Dashboard</h1>
                    <p className="text-gray-600 mb-6">Select a section from the sidebar to manage data.</p>
                    <img
                        src="/eventora.png"
                        alt="Eventora Full"
                        className="w-full max-w-xl rounded-lg shadow-md mt-4"
                    />
                </div>
            </div>
        </div>
    );
}
// Component for sidebar links
function SidebarLink({ to, icon, label, show }) {
    return (
        <Link to={to} className="flex items-center space-x-3 hover:bg-blue-700 p-2 rounded-md transition text-white">
            {icon}
            {show && <span>{label}</span>}
        </Link>
    );
}
