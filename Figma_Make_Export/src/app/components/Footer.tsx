import { Link } from "react-router";
import { Linkedin, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#f5f5f5] mt-24">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="grid grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 clip-polygon"></div>
              <span className="text-xl tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>AFGT</span>
            </div>
            <p className="text-sm text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              AL Farhan General Trading is a diversified general trading company operating across multiple commodity sectors.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-span-2">
            <h4 className="text-sm mb-4 text-[#2c2c2c]" style={{ fontFamily: 'Inter, sans-serif' }}>Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/who-we-are" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Who we are
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Products & Services
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-2">
            <h4 className="text-sm mb-4 text-[#2c2c2c]" style={{ fontFamily: 'Inter, sans-serif' }}>Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Newsroom
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Global sites
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-2">
            <h4 className="text-sm mb-4 text-[#2c2c2c]" style={{ fontFamily: 'Inter, sans-serif' }}>Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-3">
            <h4 className="text-sm mb-4 text-[#2c2c2c]" style={{ fontFamily: 'Inter, sans-serif' }}>Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-[#5c5c5c] hover:text-[#000] transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#5c5c5c] hover:text-[#000] transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#5c5c5c] hover:text-[#000] transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2026 AL Farhan General Trading. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
