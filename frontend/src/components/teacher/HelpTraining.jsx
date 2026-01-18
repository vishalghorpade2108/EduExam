import DashboardNavbar from "./Navbar.jsx";
import {
  BookOpen,
  Video,
  HelpCircle,
  Mail,
} from "lucide-react";

const THEME = "#2a384a";

export default function HelpTraining() {
  return (
    <>
      <DashboardNavbar active="help" />

      <div className="max-w-6xl mx-auto mt-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-semibold"
            style={{ color: THEME }}
          >
            Help & Training
          </h1>
          <p className="text-gray-600 mt-1">
            Learn how to use EduExam effectively
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Getting Started */}
          <Card
            icon={<BookOpen size={28} />}
            title="Getting Started"
            items={[
              "Create your first exam",
              "Invite students using Exam Key",
              "Publish & monitor exams",
            ]}
          />

          {/* Video Training */}
          <Card
            icon={<Video size={28} />}
            title="Video Tutorials"
            items={[
              "How to create exams",
              "AI question generation",
              "Result analysis",
            ]}
          />

          {/* FAQs */}
          <Card
            icon={<HelpCircle size={28} />}
            title="FAQs"
            items={[
              "How students join exams?",
              "Can I edit published exams?",
              "How is cheating prevented?",
            ]}
          />

          {/* Support */}
          <Card
            icon={<Mail size={28} />}
            title="Support"
            items={[
              "Email: support@eduexam.com",
              "Response time: 24 hours",
              "Priority support coming soon",
            ]}
          />
        </div>

        {/* Footer Note */}
        <div className="mt-10 bg-gray-50 border rounded-lg p-6 text-center">
          <p className="font-semibold text-gray-700">
            Need more help?
          </p>
          <p className="text-gray-600 text-sm mt-1">
            We’re constantly improving EduExam. More tutorials coming soon 🚀
          </p>
        </div>
      </div>
    </>
  );
}

/* Reusable Card */
function Card({ icon, title, items }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="p-2 rounded-lg text-white"
          style={{ backgroundColor: THEME }}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
