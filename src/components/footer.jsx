import { Link } from "react-router-dom";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-admin-900 text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img src="/Logo.png" alt="Crystal Beauty Clear" className="h-12 w-auto object-contain mb-4" />
          <p className="text-sm leading-relaxed text-white/60">
            Premium, dermatologist-loved skincare and cosmetics crafted for radiant, healthy skin.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-accent transition-colors">Products</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-center gap-2"><MapPin size={15} /> Colombo, Sri Lanka</li>
            <li className="flex items-center gap-2"><Phone size={15} /> +94 11 234 5678</li>
            <li className="flex items-center gap-2"><Mail size={15} /> hello@crystalbeautyclear.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-4">Follow Us</h4>
          <div className="flex gap-3">
            <a href="mailto:hello@crystalbeautyclear.com" aria-label="Email us" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
              <Mail size={18} />
            </a>
            <a href="tel:+94112345678" aria-label="Call us" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
              <Phone size={18} />
            </a>
            <a href="https://wa.me/94772345678" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40 px-4">
        © {new Date().getFullYear()} Crystal Beauty Clear. All rights reserved.
      </div>
    </footer>
  );
}
