import { Link, useNavigate } from "react-router-dom";
import UserData from "./userData";

export default function Header() {
  const navigate = useNavigate();
  console.log("Header component loaded");

  return (
    <header className="w-full h-[80px] shadow-2xl flex items-center justify-between bg-secondary px-6">
      {/* Logo Section */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/Logo.png"
          alt="Logo"
          className="w-[100px] h-[100px] object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center justify-center space-x-6">
        <Link to="/" className="text-[18px] font-bold hover:text-accent">
          Home
        </Link>
        <Link to="/products" className="text-[18px] font-bold hover:text-accent">
          Products
        </Link>
        <Link to="/about" className="text-[18px] font-bold hover:text-accent">
          About
        </Link>
        <Link to="/contact" className="text-[18px] font-bold hover:text-accent">
          Contact
        </Link>
      </nav>

      {/* Right Section (User / Icons etc.) */}
      <div className="w-[60px] h-full flex justify-center items-center bg-accent rounded-l-lg"></div>
    </header>
  );
}
