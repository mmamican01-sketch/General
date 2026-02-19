import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full">
      {/* Page Intro */}
      <section className="w-full bg-white py-24">
        <div className="max-w-[900px] mx-auto px-8">
          <h1 
            className="text-6xl mb-6 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Contact
          </h1>
          <p className="text-lg text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Get in touch with AL Farhan General Trading (AFGT) for inquiries and information.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="w-full bg-[#f9f9f9] py-20">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-4">
              <h3 
                className="text-xl mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Head Office
              </h3>
              <p className="text-sm text-[#5c5c5c] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Business Bay<br />
                Dubai, United Arab Emirates<br />
                P.O. Box 123456
              </p>
            </div>

            <div className="col-span-4">
              <h3 
                className="text-xl mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Email
              </h3>
              <a 
                href="mailto:info@afgt.ae" 
                className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors block"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                info@afgt.ae
              </a>
              <a 
                href="mailto:inquiries@afgt.ae" 
                className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors block mt-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                inquiries@afgt.ae
              </a>
            </div>

            <div className="col-span-4">
              <h3 
                className="text-xl mb-4 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Phone
              </h3>
              <a 
                href="tel:+97144567890" 
                className="text-sm text-[#5c5c5c] hover:text-[#000] transition-colors block"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                +971 4 456 7890
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full bg-white py-20">
        <div className="max-w-[900px] mx-auto px-8">
          <h2 
            className="text-4xl mb-8 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Send us a message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm mb-2 text-[#2c2c2c]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-[#2c2c2c] focus:outline-none focus:border-gray-500 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm mb-2 text-[#2c2c2c]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-[#2c2c2c] focus:outline-none focus:border-gray-500 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label 
                htmlFor="message" 
                className="block text-sm mb-2 text-[#2c2c2c]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 bg-white text-[#2c2c2c] resize-none focus:outline-none focus:border-gray-500 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-white border border-[#2c2c2c] text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white transition-colors rounded-full"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Global Presence */}
      <section className="w-full bg-[#f9f9f9] py-20">
        <div className="max-w-[900px] mx-auto px-8">
          <h2 
            className="text-4xl mb-8 text-[#2c2c2c]" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
          >
            Global presence
          </h2>
          
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <h3 
                className="text-lg mb-3 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Middle East & Africa
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Dubai, UAE</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Riyadh, Saudi Arabia</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Cairo, Egypt</li>
              </ul>
            </div>

            <div className="col-span-4">
              <h3 
                className="text-lg mb-3 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Asia Pacific
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Singapore</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Mumbai, India</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Shanghai, China</li>
              </ul>
            </div>

            <div className="col-span-4">
              <h3 
                className="text-lg mb-3 text-[#2c2c2c]" 
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Europe
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>London, UK</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Geneva, Switzerland</li>
                <li className="text-sm text-[#5c5c5c]" style={{ fontFamily: 'Inter, sans-serif' }}>Rotterdam, Netherlands</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
