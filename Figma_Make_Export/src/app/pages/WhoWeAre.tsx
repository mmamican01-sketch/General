export function WhoWeAre() {
  return (
    <div className="w-full">
      {/* Page Intro - 72px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h1 
            className="text-6xl mb-6 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Who We Are
          </h1>
          <p className="text-lg text-[#5c5c5c] max-w-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
            A diversified general trading company operating across multiple commodity sectors.
          </p>
        </div>
      </section>

      {/* Company Overview - 96px margin, 72px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-6">
              <h2 
                className="text-3xl mb-6 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Company overview
              </h2>
              <p className="text-base text-[#5c5c5c] leading-relaxed mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                AL Farhan General Trading (AFGT) is a diversified trading company headquartered in Dubai, United Arab Emirates. AFGT operates across multiple commodity sectors with a focus on institutional partnerships.
              </p>
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                The company serves markets across the Middle East, Africa, Asia Pacific, and Europe through a network of strategic partnerships and operational facilities.
              </p>
            </div>
            <div className="col-span-6">
              <h2 
                className="text-3xl mb-6 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Market presence
              </h2>
              <p className="text-base text-[#5c5c5c] leading-relaxed mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                AFGT operates in 25 countries with a presence spanning four continents. The company manages commodity flows across sugar, wheat, oils, urea, and maritime transport sectors.
              </p>
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Through direct trading relationships and long-term supply agreements, AFGT connects producers and consumers across global markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Operate - 96px margin, 72px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-10 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            How we operate
          </h2>
          
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-4">
              <h3 
                className="text-xl mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Trading operations
              </h3>
              <p className="text-sm text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                AFGT conducts direct commodity trading across physical and contract-based markets. Operations are managed through regional offices with local market expertise.
              </p>
            </div>

            <div className="col-span-4">
              <h3 
                className="text-xl mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Risk management
              </h3>
              <p className="text-sm text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                The company maintains structured risk management protocols across all trading activities, including counterparty assessment, position monitoring, and hedging strategies.
              </p>
            </div>

            <div className="col-span-4">
              <h3 
                className="text-xl mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Logistics coordination
              </h3>
              <p className="text-sm text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                AFGT coordinates end-to-end logistics across maritime, rail, and road transport networks, ensuring reliable delivery timelines and supply chain transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence - 96px margin, 72px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-10 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Global presence
          </h2>

          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-3">
              <h3 
                className="text-lg mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Middle East & Africa
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Dubai, UAE</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Riyadh, Saudi Arabia</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Cairo, Egypt</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Lagos, Nigeria</li>
              </ul>
            </div>

            <div className="col-span-3">
              <h3 
                className="text-lg mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Asia Pacific
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Singapore</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Mumbai, India</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Shanghai, China</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Jakarta, Indonesia</li>
              </ul>
            </div>

            <div className="col-span-3">
              <h3 
                className="text-lg mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Europe
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>London, UK</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Geneva, Switzerland</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Rotterdam, Netherlands</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Hamburg, Germany</li>
              </ul>
            </div>

            <div className="col-span-3">
              <h3 
                className="text-lg mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Americas
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>New York, USA</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>São Paulo, Brazil</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Buenos Aires, Argentina</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values - 96px margin, 72px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-10 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Principles
          </h2>

          <div className="space-y-8">
            <div>
              <h3 
                className="text-xl mb-2 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Transparency
              </h3>
              <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Clear communication and accurate reporting across all trading operations and partnerships.
              </p>
            </div>

            <div>
              <h3 
                className="text-xl mb-2 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Reliability
              </h3>
              <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Consistent delivery performance and contract fulfillment across all market conditions.
              </p>
            </div>

            <div>
              <h3 
                className="text-xl mb-2 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Long-term partnerships
              </h3>
              <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Building enduring relationships with producers, consumers, and logistics partners across global markets.
              </p>
            </div>

            <div>
              <h3 
                className="text-xl mb-2 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Market expertise
              </h3>
              <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Deep understanding of commodity markets, supply chain dynamics, and regional trade flows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governance - 96px margin, 64px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '64px', paddingBottom: '64px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-8 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Standards & compliance
          </h2>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6">
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                AFGT operates in accordance with international trading standards and regional regulatory frameworks. The company maintains compliance with customs, import-export regulations, and quality certification requirements across all operating jurisdictions.
              </p>
            </div>
            <div className="col-span-6">
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                All trading activities are subject to internal audit procedures, financial controls, and third-party verification processes where applicable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
