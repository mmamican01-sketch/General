import { useParams, Link } from "react-router";

export function ProductDetail() {
  const { slug } = useParams();

  const productsData: Record<string, {
    name: string;
    image: string;
    overview: string;
    specifications: { label: string; value: string }[];
    origins: string[];
    certifications: string[];
  }> = {
    "sugar": {
      name: "Sugar",
      image: "https://images.unsplash.com/photo-1607980276836-232ac6344978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWdhciUyMHByb2R1Y3Rpb24lMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MDc0MTYxMXww&ixlib=rb-4.1.0&q=80&w=1080",
      overview: "AFGT sources raw and refined sugar from certified mills across multiple producing regions. All sugar products meet international quality standards and are supplied with full traceability documentation.",
      specifications: [
        { label: "Product Types", value: "ICUMSA 45, Raw Cane Sugar, Refined Beet Sugar" },
        { label: "Packaging", value: "Bulk vessels, 50kg bags, 1MT big bags" },
        { label: "Contract Terms", value: "FOB, CFR, CIF" },
        { label: "Minimum Order", value: "Vessel-sized shipments (12,500 MT+)" }
      ],
      origins: ["Brazil", "Thailand", "India", "European Union", "Australia"],
      certifications: ["Bonsucro", "ISO 9001", "FSSC 22000", "Kosher", "Halal"]
    },
    "wheat": {
      name: "Wheat",
      image: "https://images.unsplash.com/photo-1657626625832-2c0851cdaa9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdyYWluJTIwZmFybWluZ3xlbnwxfHx8fDE3NzA3NDE2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      overview: "AFGT trades food-grade milling wheat and animal feed wheat from major producing regions. All wheat shipments are accompanied by phytosanitary certificates and quality analysis reports.",
      specifications: [
        { label: "Product Types", value: "Hard Red Winter, Soft White, Spring Wheat, Feed Wheat" },
        { label: "Protein Content", value: "10.5% - 14.5% depending on grade" },
        { label: "Contract Terms", value: "FOB, CFR, CIF" },
        { label: "Shipment Size", value: "25,000 MT - 60,000 MT per vessel" }
      ],
      origins: ["USA", "Canada", "European Union", "Russia", "Australia", "Argentina"],
      certifications: ["ISO 9001", "HACCP", "Non-GMO verification where applicable"]
    },
    "oils": {
      name: "Oils",
      image: "https://images.unsplash.com/photo-1759332637000-50311b115c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBvaWwlMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc3MDc0MTYxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      overview: "AFGT supplies vegetable oils for industrial processing and consumer markets. All oil products are sourced from certified refineries with documented supply chain traceability.",
      specifications: [
        { label: "Product Types", value: "Sunflower, Soybean, Palm, Canola, Corn Oil" },
        { label: "Packaging", value: "Flexitanks, ISO tanks, bulk vessels, bottled" },
        { label: "Contract Terms", value: "FOB, CFR, CIF" },
        { label: "Quality Standards", value: "Codex Alimentarius compliant" }
      ],
      origins: ["Ukraine", "Russia", "Argentina", "Malaysia", "Indonesia", "Brazil"],
      certifications: ["RSPO (Palm Oil)", "ISO 9001", "HACCP", "Kosher", "Halal"]
    },
    "urea": {
      name: "Urea",
      image: "https://images.unsplash.com/photo-1725802867239-ab1379895088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmVhJTIwZmVydGlsaXplciUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzcwNzQxNjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      overview: "AFGT sources agricultural-grade urea from established producers with consistent quality and reliable delivery schedules. All urea products meet international fertilizer standards.",
      specifications: [
        { label: "Product Type", value: "Prilled Urea, Granular Urea (46% N)" },
        { label: "Packaging", value: "50kg bags, 1MT big bags, bulk vessels" },
        { label: "Contract Terms", value: "FOB, CFR, CIF" },
        { label: "Shipment Size", value: "5,000 MT - 50,000 MT" }
      ],
      origins: ["Middle East", "Russia", "China", "India", "North Africa"],
      certifications: ["ISO 9001", "REACH (European Union)", "Industry standard compliance"]
    },
    "maritime-transport": {
      name: "Maritime Transport",
      image: "https://images.unsplash.com/photo-1764041323714-de1d64fb8073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpdGltZSUyMGNhcmdvJTIwc2hpcCUyMG9jZWFufGVufDF8fHx8MTc3MDc0MTYxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      overview: "AFGT coordinates bulk cargo shipping for agricultural and industrial commodities. The company works with established vessel operators and maintains relationships across major shipping routes.",
      specifications: [
        { label: "Vessel Types", value: "Panamax, Supramax, Handysize bulk carriers" },
        { label: "Cargo Types", value: "Grains, sugar, fertilizers, minerals" },
        { label: "Services", value: "Voyage charter, time charter, freight management" },
        { label: "Routes", value: "Global coverage including Americas, Europe, Asia, Africa" }
      ],
      origins: ["Global shipping network"],
      certifications: ["ISO 9001", "Vessel vetting and compliance", "Insurance coverage"]
    }
  };

  const product = slug ? productsData[slug] : null;

  if (!product) {
    return (
      <div className="w-full">
        <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
          <div className="max-w-[1140px] mx-auto px-8">
            <h1 
              className="text-6xl mb-6 text-[#2c2c2c]" 
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
            >
              Product not found
            </h1>
            <Link 
              to="/products"
              className="text-sm text-[#2c2c2c] underline hover:text-[#000] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View all products
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Intro - 72px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <Link 
            to="/products"
            className="text-sm text-[#5c5c5c] hover:text-[#2c2c2c] transition-colors mb-6 inline-block"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ← Back to Products
          </Link>
          <h1 
            className="text-6xl mb-6 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            {product.name}
          </h1>
        </div>
      </section>

      {/* Product Overview - 96px margin, 72px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12 items-center">
            <div className="col-span-6">
              <div className="w-full aspect-[16/9] bg-gray-300 overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="col-span-5">
              <h2 
                className="text-3xl mb-6 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Overview
              </h2>
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                {product.overview}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications - 96px margin, 72px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-8 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Specifications
          </h2>

          <div className="space-y-6">
            {product.specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-12 gap-8 py-4 border-b border-gray-200">
                <div className="col-span-4">
                  <h3 
                    className="text-base text-[#2c2c2c]" 
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                  >
                    {spec.label}
                  </h3>
                </div>
                <div className="col-span-8">
                  <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {spec.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origins & Certifications - 96px margin, 72px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-6">
              <h2 
                className="text-3xl mb-6 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Origins
              </h2>
              <ul className="space-y-2">
                {product.origins.map((origin, index) => (
                  <li key={index} className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {origin}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-6">
              <h2 
                className="text-3xl mb-6 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Certifications
              </h2>
              <ul className="space-y-2">
                {product.certifications.map((cert, index) => (
                  <li key={index} className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry CTA - 96px margin, 64px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '64px', paddingBottom: '64px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8 text-center">
          <h2 
            className="text-4xl mb-6 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Inquiries
          </h2>
          <p className="text-base text-[#5c5c5c] mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            For product inquiries, pricing, and contract terms, contact the trading desk.
          </p>
          <Link 
            to="/contact"
            className="inline-block px-8 py-3 bg-white text-[#2c2c2c] rounded-full border border-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
