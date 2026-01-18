function DashboardFooter() {
  return (
    <footer className="mt-16 bg-[#2a384a] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left */}
        <div className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-semibold text-white">EduExam</span>.  
          <span className="ml-1">All rights reserved.</span>
        </div>

        {/* Center */}
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Support</a>
        </div>

        {/* Right */}
        <div className="text-sm text-center md:text-right">
          Designed & Developed by  
          <span className="ml-1 font-semibold text-white">Vishal Ghorpade</span>
        </div>
      </div>
    </footer>
  );
}

export default DashboardFooter;
