export function Careers() {
  const openRoles = [
    { title: "Commodities Trader", location: "Dubai, UAE", department: "Trading" },
    { title: "Supply Chain Manager", location: "Singapore", department: "Operations" },
    { title: "Risk Analyst", location: "Geneva, Switzerland", department: "Risk Management" },
    { title: "Logistics Coordinator", location: "Rotterdam, Netherlands", department: "Logistics" },
    { title: "Financial Controller", location: "Dubai, UAE", department: "Finance" },
    { title: "Compliance Officer", location: "London, UK", department: "Legal & Compliance" },
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
            Careers
          </h1>
          <p className="text-lg text-[#5c5c5c] max-w-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
            Professional opportunities in global commodity trading and operations.
          </p>
        </div>
      </section>

      {/* Working at the Company - 96px margin, 72px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-8 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Working at AFGT
          </h2>

          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-6">
              <p className="text-base text-[#5c5c5c] leading-relaxed mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                AFGT employs professionals across trading, operations, logistics, risk management, and support functions. The company operates in 25 countries with offices in major trading hubs.
              </p>
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Employees work in collaborative teams focused on commodity markets, supply chain management, and institutional partnerships.
              </p>
            </div>
            <div className="col-span-6">
              <p className="text-base text-[#5c5c5c] leading-relaxed mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                The company provides professional development programs, market training, and international exposure across different commodity sectors and geographic markets.
              </p>
              <p className="text-base text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                AFGT maintains workplace standards aligned with international labor practices and regional employment regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles - 96px margin, 72px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-8 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Open positions
          </h2>

          <div className="space-y-0">
            {openRoles.map((role, index) => (
              <div 
                key={index}
                className="py-5 border-b border-gray-200 grid grid-cols-12 gap-8 items-center hover:bg-[#f9f9f9] transition-colors"
              >
                <div className="col-span-5">
                  <h3 
                    className="text-lg text-[#2c2c2c]" 
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                  >
                    {role.title}
                  </h3>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {role.location}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {role.department}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <a 
                    href="#"
                    className="text-sm text-[#2c2c2c] underline hover:text-[#000] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    View details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process - 96px margin, 72px internal padding */}
      <section className="w-full bg-[#f9f9f9]" style={{ paddingTop: '72px', paddingBottom: '72px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-8 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Application process
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-1">
                <span className="text-2xl text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  1
                </span>
              </div>
              <div className="col-span-11">
                <h3 
                  className="text-xl mb-2 text-[#2c2c2c]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  Submit application
                </h3>
                <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Review open positions and submit your application through the online portal. Include CV and relevant professional documentation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-1">
                <span className="text-2xl text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  2
                </span>
              </div>
              <div className="col-span-11">
                <h3 
                  className="text-xl mb-2 text-[#2c2c2c]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  Initial review
                </h3>
                <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Applications are reviewed by the relevant department. Qualified candidates are contacted within two weeks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-1">
                <span className="text-2xl text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  3
                </span>
              </div>
              <div className="col-span-11">
                <h3 
                  className="text-xl mb-2 text-[#2c2c2c]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  Interview process
                </h3>
                <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Selected candidates proceed to interviews with department managers and HR. Process may include technical assessments where relevant.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-1">
                <span className="text-2xl text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  4
                </span>
              </div>
              <div className="col-span-11">
                <h3 
                  className="text-xl mb-2 text-[#2c2c2c]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  Offer & onboarding
                </h3>
                <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Successful candidates receive formal offer letters. Onboarding includes orientation, compliance training, and department-specific programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact - 96px margin, 64px internal padding */}
      <section className="w-full bg-white" style={{ paddingTop: '64px', paddingBottom: '64px', marginTop: '96px' }}>
        <div className="max-w-[1140px] mx-auto px-8">
          <h2 
            className="text-4xl mb-6 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Questions
          </h2>
          <p className="text-base text-[#5c5c5c] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            For inquiries about career opportunities, contact the Human Resources department.
          </p>
          <p className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Email: <a href="mailto:careers@afgt.ae" className="underline hover:text-[#2c2c2c] transition-colors">careers@afgt.ae</a>
          </p>
        </div>
      </section>
    </div>
  );
}
