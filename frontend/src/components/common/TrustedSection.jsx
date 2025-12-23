export default function TrustedSection() {
  return (
    <section className="py-28 bg-white text-center">
      
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-semibold text-[#2a384a] mb-20">
        Trusted by over <span className="text-blue-600">270,000 teachers</span> across the world
      </h2>

      {/* Stats Row */}
      <div className="flex flex-col md:flex-row justify-center items-center mt-10">

        <div className="px-12 mb-8 md:mb-0">
          <h3 className="text-4xl font-bold text-[#2a384a]">20,000+</h3>
          <p className="text-[#2a384a] mt-3">Schools</p>
        </div>

        {/* Vertical Line */}
        <div className="hidden md:block h-24 w-0.5 bg-yellow-400 mx-4"></div>

        <div className="px-12 mb-8 md:mb-0">
          <h3 className="text-4xl font-bold text-[#2a384a]">1,000+</h3>
          <p className="text-gray-600 mt-3">Universities</p>
        </div>

        {/* Vertical Line */}
        <div className="hidden md:block h-24 w-0.5 bg-yellow-400 mx-4"></div>

        <div className="px-12">
          <h3 className="text-4xl font-bold text-[#2a384a]">70 Million</h3>
          <p className="text-gray-600 mt-3">Exams Started</p>
        </div>

      </div>
    </section>
  );
}
