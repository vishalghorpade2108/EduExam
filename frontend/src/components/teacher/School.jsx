import DashboardNavbar from "./Navbar.jsx";
import { School as SchoolIcon, Wrench } from "lucide-react";

const THEME = "#2a384a";

export default function School() {
  return (
    <>
      <DashboardNavbar active="school" />

      <div className="max-w-6xl mx-auto mt-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-semibold flex items-center gap-2"
            style={{ color: THEME }}
          >
            <SchoolIcon size={32} />
            School Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your school, classes, and students
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div
            className="mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4"
            style={{ backgroundColor: THEME }}
          >
            <Wrench size={30} className="text-white" />
          </div>

          <h2 className="text-xl font-semibold mb-2">
            School module is under development
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            This section will allow you to manage your institution profile,
            classes, students, and permissions.  
            We are actively working on this feature 🚀
          </p>
        </div>

        {/* Planned Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Feature title="School Profile" desc="Update school details and branding" />
          <Feature title="Classes & Sections" desc="Create and manage classes" />
          <Feature title="Students" desc="Add students and assign to classes" />
          <Feature title="Teachers" desc="Manage staff and roles" />
          <Feature title="Permissions" desc="Control access and actions" />
          <Feature title="Reports" desc="School-level performance reports" />
        </div>
      </div>
    </>
  );
}

/* Feature Card */
function Feature({ title, desc }) {
  return (
    <div className="bg-gray-50 border rounded-lg p-5">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
