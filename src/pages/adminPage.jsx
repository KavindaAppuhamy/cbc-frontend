import { useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, Star, ShoppingBag, LogOut, Menu, X } from "lucide-react";
import AddProductPage from "./admin/addProductPage";
import AdminProductPage from "./admin/productsPage";
import EditProductPage from "./admin/editProductPage";
import ReviewPage from "./reviewPage";
import UsersPage from "./admin/usersPage";
import OrdersPage from "./admin/ordersPage";
import AdminDashboard from "./admin/dashboard";
import ProtectedAdminRoute from "../components/protectedAdminRoute";
import { logout, getUser } from "../utils/auth";

const NAV_ITEMS = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/products", icon: ShoppingCart, label: "Products" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { to: "/admin/reviews", icon: Star, label: "Reviews" },
];

export default function AdminPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = getUser();

    const isActive = (path) => location.pathname.startsWith(path);

    function handleLogout() {
        logout();
        navigate("/admin/login", { replace: true });
    }

    return (
        <ProtectedAdminRoute>
            <div className="w-full min-h-screen flex font-sans bg-[#F7F6F3]">

                {/* Desktop sidebar */}
                <div
                    className={`hidden md:flex h-screen sticky top-0 ${
                        isSidebarOpen ? "w-[260px]" : "w-20"
                    } bg-[#1C1B18] text-[#EFEAE0] flex-col transition-all duration-300 ease-in-out relative border-r border-black/20`}
                    onMouseEnter={() => setIsSidebarOpen(true)}
                    onMouseLeave={() => setIsSidebarOpen(false)}
                >
                    <div className="flex items-center p-6 border-b border-white/10 h-[88px]">
                        <img
                            src="/Logo.png"
                            alt="CBC Logo"
                            className={`transition-all duration-300 ease-in-out object-contain ${
                                isSidebarOpen ? "w-40 h-14" : "w-10 h-10"
                            }`}
                        />
                    </div>

                    <nav className="flex-1 px-4 py-6">
                        <div className="space-y-1.5">
                            {NAV_ITEMS.map((item) => (
                                <SidebarLink
                                    key={item.to}
                                    to={item.to}
                                    icon={<item.icon size={19} />}
                                    label={item.label}
                                    show={isSidebarOpen}
                                    active={isActive(item.to)}
                                />
                            ))}
                        </div>
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[#B9B4A8] hover:bg-white/5 hover:text-[#EFEAE0] transition-colors ${
                                !isSidebarOpen ? "justify-center" : ""
                            }`}
                        >
                            <LogOut size={19} />
                            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
                        </button>
                        {isSidebarOpen && (
                            <div className="text-[11px] text-[#8A8578] text-center mt-4">
                                © {new Date().getFullYear()} Crystal Beauty Clear
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile top bar */}
                <div className="md:hidden fixed top-0 inset-x-0 z-40 h-16 bg-[#1C1B18] safe-top flex items-center justify-between px-4">
                    <img src="/Logo.png" alt="CBC" className="h-9 w-auto object-contain" />
                    <div className="flex items-center gap-3">
                        {user?.firstName && (
                            <span className="text-[#B9B4A8] text-xs font-medium hidden xs:inline">
                                {user.firstName}
                            </span>
                        )}
                        <button onClick={() => setMobileMenuOpen(true)} className="text-[#EFEAE0] p-2">
                            <Menu size={21} />
                        </button>
                    </div>
                </div>

                {/* Mobile drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
                        <div className="absolute top-0 left-0 h-full w-72 max-w-[80%] bg-[#1C1B18] text-[#EFEAE0] flex flex-col safe-top safe-bottom">
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <img src="/Logo.png" alt="CBC" className="h-10 w-auto object-contain" />
                                <button onClick={() => setMobileMenuOpen(false)} className="text-[#EFEAE0] p-1">
                                    <X size={21} />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-5 space-y-1">
                                {NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3.5 rounded-lg text-[15px] font-medium transition-colors ${
                                            isActive(item.to)
                                                ? "bg-[#F6EFE0]/10 text-[#EFEAE0]"
                                                : "text-[#B9B4A8] hover:bg-white/5 hover:text-[#EFEAE0]"
                                        }`}
                                    >
                                        <item.icon
                                            size={19}
                                            className={isActive(item.to) ? "text-[#C9A96B]" : ""}
                                        />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[#B9B4A8] hover:bg-white/5 hover:text-[#EFEAE0] transition-colors"
                                >
                                    <LogOut size={19} /> <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main content */}
                <div className="flex-1 w-full min-w-0 pt-16 md:pt-0 pb-16 md:pb-0">
                    <Routes path="/*">
                        <Route path="/" element={<AdminDashboard/>}/>
                        <Route path="/dashboard" element={<AdminDashboard/>}/>
                        <Route path="/products" element={<AdminProductPage/>}/>
                        <Route path="/users" element={<UsersPage/>}/>
                        <Route path="/orders" element={<OrdersPage/>}/>
                        <Route path="/reviews" element={<ReviewPage/>}/>
                        <Route path="/add-product" element={<AddProductPage/>}/>
                        <Route path="/edit-product" element={<EditProductPage/>}/>
                    </Routes>
                </div>

                {/* Mobile bottom nav */}
                <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E9E5DC] safe-bottom flex justify-around py-2">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-medium transition-colors ${
                                isActive(item.to) ? "text-[#A6803D]" : "text-[#B4AFA5]"
                            }`}
                        >
                            <item.icon size={19} />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </ProtectedAdminRoute>
    );
}

function SidebarLink({ to, icon, label, show, active }) {
    return (
        <Link
            to={to}
            className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 ease-in-out relative overflow-hidden
                ${active ? "bg-[#F6EFE0]/10 text-[#EFEAE0]" : "text-[#B9B4A8] hover:bg-white/5 hover:text-[#EFEAE0]"}
                ${!show ? "justify-center" : ""}`}
        >
            {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#C9A96B]" />
            )}
            <div className="flex items-center relative z-10">
                <div
                    className={`flex items-center justify-center transition-transform duration-200 ease-in-out ${
                        active ? "text-[#C9A96B]" : ""
                    } ${show ? "mr-3" : ""}`}
                >
                    {icon}
                </div>
                {show && (
                    <span className="font-medium text-sm whitespace-nowrap">
                        {label}
                    </span>
                )}
            </div>
        </Link>
    );
}