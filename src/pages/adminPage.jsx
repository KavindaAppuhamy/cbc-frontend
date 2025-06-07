import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, Star } from "lucide-react";
import AdminProductPage from "./admin/AdminProductPage";
import AddProductPage from "./admin/addProduct";

export default function AdminPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="w-full h-screen flex font-sans bg-gray-50">
            {/* Sidebar */}
            <div
                className={`h-full ${isSidebarOpen ? "w-[280px]" : "w-20"} bg-gradient-to-b from-[#1e3a5f] to-[#0f2a44] text-white flex flex-col transition-all duration-300 ease-in-out shadow-xl relative border-r border-gray-700`}
                onMouseEnter={() => setIsSidebarOpen(true)}
                onMouseLeave={() => setIsSidebarOpen(false)}
            >
                {/* Header */}
                <div className="flex items-center p-6 border-b border-gray-600/30">
                    <img
                        src="/eventora.png"
                        alt="Eventora Logo"
                        className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-10 h-10" : "w-8 h-8"} rounded-lg shadow-sm`}
                    />
                    {/* Use a container with overflow-hidden and controlled width for smoother text appearance */}
                    <div className={`ml-3 overflow-hidden ${isSidebarOpen ? "w-auto max-w-[180px] opacity-100" : "w-0 max-w-0 opacity-0"} transition-all duration-300 ease-in-out`}>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent whitespace-nowrap">
                            Eventora
                        </span>
                        <div className="text-xs text-blue-200 opacity-80 whitespace-nowrap">Admin Panel</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">
                    <div className="space-y-2">
                        <SidebarLink 
                            to="/admin/products" 
                            icon={<ShoppingCart size={20} />} 
                            label="Products" 
                            show={isSidebarOpen}
                        />
                        <SidebarLink 
                            to="/admin/users" 
                            icon={<Users size={20} />} 
                            label="Users" 
                            show={isSidebarOpen}
                        />
                        <SidebarLink 
                            to="/admin/orders" 
                            icon={<LayoutDashboard size={20} />} 
                            label="Orders" 
                            show={isSidebarOpen}
                        />
                        <SidebarLink 
                            to="/admin/reviews" 
                            icon={<Star size={20} />} 
                            label="Reviews" 
                            show={isSidebarOpen}
                        />
                    </div>
                </nav>

                {/* Footer */}
                <div className={`p-4 border-t border-gray-600/30 transition-opacity duration-300 ease-in-out ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <div className="text-xs text-blue-200 opacity-60 text-center">
                        © 2024 Eventora Admin
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className={`h-full ${isSidebarOpen ? "w-[calc(100%-280px)]" : "w-[calc(100%-80px)]"} transition-all duration-300 ease-in-out overflow-auto`}>
                <Routes path="/*">
                    <Route path="/products" element={<AdminProductPage/>}/>
                    <Route path="/users" element={<h1 className="p-6 text-2xl font-bold text-gray-800">Users Management</h1>}/>
                    <Route path="/orders" element={<h1 className="p-6 text-2xl font-bold text-gray-800">Order History</h1>}/>
                    <Route path="/reviews" element={<h1 className="p-6 text-2xl font-bold text-gray-800">Customer Reviews</h1>}/>
                    <Route path="/add-product" element={<AddProductPage/>}/>
                </Routes>
            </div>
        </div>
    );
}

// Enhanced Component for sidebar links
function SidebarLink({ to, icon, label, show }) {
    return (
        <Link 
            to={to} 
            className={`
                group flex items-center px-3 py-3 rounded-xl transition-all duration-200 ease-in-out relative overflow-hidden
                text-blue-100 hover:bg-white/10 hover:text-white hover:shadow-md
                ${!show ? "justify-center" : ""}
            `}
        >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-xl"></div>
            
            <div className="flex items-center relative z-10">
                {/* Icon with subtle hover effect */}
                <div className={`p-1 rounded-lg group-hover:scale-110 transition-transform duration-200 ease-in-out ${show ? "mr-3" : ""}`}>
                    {icon}
                </div>
                {show && (
                    <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-200 ease-in-out whitespace-nowrap">
                        {label}
                    </span>
                )}
            </div>
        </Link>
    );
}