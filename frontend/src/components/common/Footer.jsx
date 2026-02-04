import logo from "../../assets/logo3.png"; // adjust path if needed

export default function Footer() {
  return (
    <footer className="bg-[#2a384a] text-gray-300 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

        {/* Column 1 */}
        <div className="space-y-4">
          <img src={logo} alt="EduExam Logo" className="h-30 w-auto " />

          <ul className="space-y-2 text-1xl ml-4">
            <li className="hover:text-white cursor-pointer">Teacher Sign In</li>
            <li className="hover:text-white cursor-pointer">Student Exam Key</li>
            <li className="hover:text-white cursor-pointer">
              Want to get in touch?
            </li>
          </ul>

          <div className="pt-4 text-1xl ml-4">
            <p className="font-semibold text-white">Support Site</p>
            <p className="hover:text-white cursor-pointer">
              eduexam2108@gmail.com
            </p>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white font-semibold mb-2">How it works</h3>
          <div className="w-20 h-0.5 bg-yellow-400 mb-4"></div>

          <ul className="space-y-2 text-1xl">
            <li className="hover:text-white cursor-pointer">Product overview</li>
            <li className="hover:text-white cursor-pointer">Tools</li>
            <li className="hover:text-white cursor-pointer">Technology</li>
            <li className="hover:text-white cursor-pointer">LMS Integrations</li>
            <li className="hover:text-white cursor-pointer">Cheating</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white font-semibold mb-2">Customers</h3>
          <div className="w-20 h-0.5 bg-yellow-400 mb-4"></div>

          <ul className="space-y-2 text-1xl">
            <li className="hover:text-white cursor-pointer">Case Studies</li>
            <li className="hover:text-white cursor-pointer">Testimonials</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white font-semibold mb-2">Who we serve</h3>
          <div className="w-20 h-0.5 bg-yellow-400 mb-4"></div>

          <ul className="space-y-2 text-1xl">
            <li className="hover:text-white cursor-pointer">Schools</li>
            <li className="hover:text-white cursor-pointer">Higher education</li>
            <li className="hover:text-white cursor-pointer">
              Companies & Organizations
            </li>
            <li className="hover:text-white cursor-pointer">Regions</li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="text-white font-semibold mb-2">Resources</h3>
          <div className="w-20 h-0.5 bg-yellow-400 mb-4"></div>

          <ul className="space-y-2 text-1xl">
            <li className="hover:text-white cursor-pointer">Support</li>
            <li className="hover:text-white cursor-pointer">Privacy Center</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Training Videos</li>
            <li className="hover:text-white cursor-pointer">Service Status</li>
            <li className="hover:text-white cursor-pointer">
              Install high security mode
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} EduExam. All rights reserved.
      </div>
    </footer>
  );
}
