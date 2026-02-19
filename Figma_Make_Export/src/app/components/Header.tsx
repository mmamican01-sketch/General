import { Link } from "react-router";
import { Search, ExternalLink, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-white">
      {/* Utility Bar - Tier A */}
      <div className="w-full bg-[#f5f5f5]">
        <div className="max-w-[1400px] mx-auto px-8 py-3">
          <div className="flex justify-end items-center gap-8">
            <a 
              href="#" 
              className="flex items-center gap-1 text-sm text-[#2c2c2c] hover:text-[#000] transition-colors"
            >
              Apply for a role
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a 
              href="#" 
              className="text-sm text-[#2c2c2c] hover:text-[#000] transition-colors"
            >
              Newsroom
            </a>
            <Link 
              to="/contact" 
              className="text-sm text-[#2c2c2c] hover:text-[#000] transition-colors"
            >
              Contact Us
            </Link>
            <button 
              className="flex items-center gap-1 text-sm text-[#2c2c2c] hover:text-[#000] transition-colors"
            >
              Global sites
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button 
              className="bg-[#2c2c2c] p-2 hover:bg-[#000] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Header - Tier B */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 clip-polygon"></div>
              <span className="text-2xl tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>AFGT</span>
            </Link>

            {/* Primary Navigation */}
            <nav className="flex items-center gap-12">
              <Link 
                to="/who-we-are" 
                className="text-[#2c2c2c] hover:text-[#000] transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Who we are
              </Link>
              <Link 
                to="/products" 
                className="text-[#2c2c2c] hover:text-[#000] transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Products & Services
              </Link>
              <Link 
                to="/sustainability" 
                className="text-[#2c2c2c] hover:text-[#000] transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Sustainability
              </Link>
              <Link 
                to="/careers" 
                className="text-[#2c2c2c] hover:text-[#000] transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Careers
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
