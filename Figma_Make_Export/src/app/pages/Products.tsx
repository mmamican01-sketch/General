import { Link } from "react-router";

export function Products() {
  const products = [
    {
      name: "Sugar",
      slug: "sugar",
      image: "https://images.unsplash.com/photo-1607980276836-232ac6344978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWdhciUyMHByb2R1Y3Rpb24lMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MDc0MTYxMXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Raw and refined sugar products sourced from certified mills across multiple origins."
    },
    {
      name: "Wheat",
      slug: "wheat",
      image: "https://images.unsplash.com/photo-1657626625832-2c0851cdaa9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdyYWluJTIwZmFybWluZ3xlbnwxfHx8fDE3NzA3NDE2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Food-grade wheat and feed wheat from major producing regions with full traceability."
    },
    {
      name: "Oils",
      slug: "oils",
      image: "https://images.unsplash.com/photo-1759332637000-50311b115c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBvaWwlMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc3MDc0MTYxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Vegetable oils including sunflower, soybean, palm, and canola oil for industrial and consumer markets."
    },
    {
      name: "Urea",
      slug: "urea",
      image: "https://images.unsplash.com/photo-1725802867239-ab1379895088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmVhJTIwZmVydGlsaXplciUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzcwNzQxNjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Agricultural-grade urea fertilizer from established producers with quality certification."
    },
    {
      name: "Maritime Transport",
      slug: "maritime-transport",
      image: "https://images.unsplash.com/photo-1764041323714-de1d64fb8073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpdGltZSUyMGNhcmdvJTIwc2hpcCUyMG9jZWFufGVufDF8fHx8MTc3MDc0MTYxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Bulk cargo shipping services and vessel chartering for agricultural and industrial commodities."
    }
  ];

  return (
    <div className="w-full">
      {/* Page Intro - 72px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h1 
            className="text-6xl mb-6 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Products & Services
          </h1>
          <p className="text-lg text-[#5c5c5c] max-w-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
            AFGT trades across five primary commodity groups with operations spanning global markets.
          </p>
        </div>
      </section>

      {/* Products Grid - 96px margin, 96px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '96px', paddingBottom: '96px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <div className="space-y-24">
            {products.map((product, index) => (
              <div key={product.slug} className="grid grid-cols-12 gap-12 items-center">
                {index % 2 === 0 ? (
                  <>
                    {/* Image Left */}
                    <div className="col-span-6">
                      <Link to={`/products/${product.slug}`} className="block group">
                        <div className="w-full aspect-[16/9] bg-gray-300 overflow-hidden mb-4">
                          <img 
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      </Link>
                    </div>
                    {/* Text Right */}
                    <div className="col-span-5">
                      <h2 
                        className="text-4xl mb-4 text-[#2c2c2c]" 
                        style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                      >
                        {product.name}
                      </h2>
                      <p className="text-base text-[#5c5c5c] leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {product.description}
                      </p>
                      <Link 
                        to={`/products/${product.slug}`}
                        className="text-sm text-[#2c2c2c] underline hover:text-[#000] transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        View details
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Text Left */}
                    <div className="col-span-5">
                      <h2 
                        className="text-4xl mb-4 text-[#2c2c2c]" 
                        style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                      >
                        {product.name}
                      </h2>
                      <p className="text-base text-[#5c5c5c] leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {product.description}
                      </p>
                      <Link 
                        to={`/products/${product.slug}`}
                        className="text-sm text-[#2c2c2c] underline hover:text-[#000] transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        View details
                      </Link>
                    </div>
                    {/* Image Right */}
                    <div className="col-span-6 col-start-7">
                      <Link to={`/products/${product.slug}`} className="block group">
                        <div className="w-full aspect-[16/9] bg-gray-300 overflow-hidden mb-4">
                          <img 
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
