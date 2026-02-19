import { Link } from "react-router";

export function Home() {
  const products = [
    {
      name: "Sugar",
      slug: "sugar",
      image: "https://images.unsplash.com/photo-1607980276836-232ac6344978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWdhciUyMHByb2R1Y3Rpb24lMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MDc0MTYxMXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Wheat",
      slug: "wheat",
      image: "https://images.unsplash.com/photo-1657626625832-2c0851cdaa9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdyYWluJTIwZmFybWluZ3xlbnwxfHx8fDE3NzA3NDE2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Oils",
      slug: "oils",
      image: "https://images.unsplash.com/photo-1759332637000-50311b115c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBvaWwlMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc3MDc0MTYxMnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Urea",
      slug: "urea",
      image: "https://images.unsplash.com/photo-1725802867239-ab1379895088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmVhJTIwZmVydGlsaXplciUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzcwNzQxNjEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Maritime Transport",
      slug: "maritime-transport",
      image: "https://images.unsplash.com/photo-1764041323714-de1d64fb8073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpdGltZSUyMGNhcmdvJTIwc2hpcCUyMG9jZWFufGVufDF8fHx8MTc3MDc0MTYxMnww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section - 72px internal padding */}
      <section className="relative w-full h-[75vh] bg-[#2c2c2c] flex items-center justify-center overflow-hidden">
        {/* Background Video Placeholder (dark background) */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-8">
          <h1 
            className="text-7xl text-white mb-8" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, lineHeight: 1.2 }}
          >
            We are AFGT
          </h1>
          <Link 
            to="/who-we-are"
            className="inline-block px-8 py-3 bg-white text-[#2c2c2c] rounded-full border border-white hover:bg-transparent hover:text-white transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Who we are
          </Link>
        </div>
      </section>

      {/* Statement Section - 96px margin from hero, 64px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '64px', paddingBottom: '64px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8 text-center">
          <h2 
            className="text-5xl text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, lineHeight: 1.3 }}
          >
            Building global trade partnerships across diverse commodity sectors
          </h2>
        </div>
      </section>

      {/* Media + Text Section (A) - 96px margin, 72px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12 items-center">
            <div className="col-span-6">
              <div className="w-full aspect-[16/9] bg-gray-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1760246964044-1384f71665b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NzA3MTE3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Corporate" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="col-span-5">
              <h2 
                className="text-4xl mb-6 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Institutional excellence
              </h2>
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                AL Farhan General Trading (AFGT) operates with the highest standards of institutional integrity across global markets. Our commitment to transparency and reliability defines every partnership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Groups Section - 96px margin, 96px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '96px', paddingBottom: '96px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          {/* Section Headline - 40px margin bottom */}
          <h2 
            className="text-4xl text-center text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, marginBottom: '40px' }}
          >
            Product Groups
          </h2>

          {/* Product Grid - 32px gap between items */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {products.map((product) => (
              <Link 
                key={product.slug}
                to={`/products/${product.slug}`}
                className="group"
              >
                {/* Product Image - 16:9 aspect ratio, 12px margin to label */}
                <div className="w-full aspect-[16/9] bg-gray-200 overflow-hidden mb-3">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                {/* Product Label */}
                <p 
                  className="text-sm text-[#2c2c2c] group-hover:underline"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {product.name}
                </p>
              </Link>
            ))}
          </div>

          {/* CTA - 48px margin from images */}
          <div className="text-center" style={{ marginTop: '48px' }}>
            <Link 
              to="/products"
              className="inline-block px-8 py-3 bg-white text-[#2c2c2c] rounded-full border border-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Section - 96px margin, 72px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3 text-center">
              <div className="text-6xl mb-2 text-[#2c2c2c]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                150+
              </div>
              <div className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Global partners
              </div>
            </div>
            <div className="col-span-3 text-center">
              <div className="text-6xl mb-2 text-[#2c2c2c]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                25
              </div>
              <div className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Countries served
              </div>
            </div>
            <div className="col-span-3 text-center">
              <div className="text-6xl mb-2 text-[#2c2c2c]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                12
              </div>
              <div className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Commodity sectors
              </div>
            </div>
            <div className="col-span-3 text-center">
              <div className="text-6xl mb-2 text-[#2c2c2c]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                15+
              </div>
              <div className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Years of expertise
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media + Text Section (B) - Inverted, 96px margin, 72px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12 items-center">
            <div className="col-span-5">
              <h2 
                className="text-4xl mb-6 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Sustainable practices
              </h2>
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                AFGT is committed to responsible trading practices that support long-term sustainability across our supply chains and partner networks.
              </p>
            </div>
            <div className="col-span-6 col-start-7">
              <div className="w-full aspect-[16/9] bg-gray-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1654436192650-7f5aa98954a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBmaWVsZCUyMGhhcnZlc3R8ZW58MXx8fHwxNzcwNjk5Mjg2fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Agricultural field" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Statement - 96px margin, 64px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '64px', paddingBottom: '64px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8 text-center">
          <h2 
            className="text-5xl text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, lineHeight: 1.3 }}
          >
            Connecting markets. Building trust.
          </h2>
        </div>
      </section>
    </div>
  );
}