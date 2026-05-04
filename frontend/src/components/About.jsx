const About = () => {
  return (
    <div className="font-sans text-gray-800">

      {/* --- HERO SECTION --- */}
      <section className="relative bg-green-600 text-white py-24 px-6 text-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-green-300">ResQPlate</span>
          </h1>
          <p className="text-xl md:text-2xl font-light">
            Bridging the gap between surplus food and those who need it most.
          </p>
        </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              ResQPlate is a technology-driven platform designed to reduce food
              waste and combat hunger. We connect restaurants, event organizers,
              and households with verified NGOs and volunteers in real time.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By leveraging geolocation, smart matching, and secure
              authentication, we ensure that surplus food reaches the right
              people before it goes to waste.
            </p>
          </div>

          <div className="bg-green-50 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-green-700">
              Why ResQPlate?
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Reduces food wastage efficiently</li>
              <li>✔ Supports NGOs & volunteers</li>
              <li>✔ Ensures safe & timely food pickup</li>
              <li>✔ Promotes sustainable communities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- HOW IT HELPS --- */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            How We Make an Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold mb-2">Food Rescue</h3>
              <p className="text-gray-600">
                Prevents edible food from being discarded by redirecting it to
                NGOs in need.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Uses location-based algorithms to notify nearby verified
                receivers instantly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Encourages collaboration between donors, NGOs, and volunteers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUES & SAFETY COMMITMENT --- */}
<section className="py-20 px-6 bg-white">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">
      Our Values & Safety Commitment
    </h2>

    <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
      At ResQPlate, trust and responsibility are at the core of everything we do.
      Our platform is built to ensure food safety, transparency, and dignity for
      every individual involved in the donation process.
    </p>

    <div className="grid md:grid-cols-4 gap-8 text-sm">
      <div className="bg-green-50 p-6 rounded-2xl shadow-sm">
        <div className="text-3xl mb-3">🛡️</div>
        <h4 className="font-bold mb-2 text-green-700">Food Safety</h4>
        <p className="text-gray-600">
          Expiry-based listings ensure only safe and consumable food is shared.
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-2xl shadow-sm">
        <div className="text-3xl mb-3">🔐</div>
        <h4 className="font-bold mb-2 text-green-700">Secure Access</h4>
        <p className="text-gray-600">
          Role-based authentication protects donors and verified NGOs.
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-2xl shadow-sm">
        <div className="text-3xl mb-3">⚖️</div>
        <h4 className="font-bold mb-2 text-green-700">Transparency</h4>
        <p className="text-gray-600">
          Every donation follows a clear claim and pickup workflow.
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-2xl shadow-sm">
        <div className="text-3xl mb-3">🌍</div>
        <h4 className="font-bold mb-2 text-green-700">Social Impact</h4>
        <p className="text-gray-600">
          Building sustainable communities through collaboration.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* --- FOOTER CTA --- */}
      <section className="bg-gray-900 text-white py-14 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Together, We Can End Food Waste
        </h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Join ResQPlate today and be a part of the solution.
        </p>
        <p className="text-gray-600 text-sm">
          © 2025 ResQPlate — Built for Social Impact
        </p>
      </section>
    </div>
  );
};

export default About;
