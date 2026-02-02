export default function ExamInfo() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">

      {/* Heading */}
      <h2 className="text-5xl  text-[#2a384a] text-center">
        A complete solution for creating and managing secure exams.
      </h2>

      {/* Subtext */}
      <p className="mt-6 text-center text-gray-500 max-w-3xl mx-auto text-2xl">
        We simplify the process so you can focus on assessment, not technology.
      </p>

      {/* Features */}
      <div className="mt-16">

        {/* Row 1 - 3 items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <Feature
            icon="📄"
            text="Create an exam in minutes by uploading an existing exam as PDF"
          />

          <Feature
            icon="🎯"
            text="Empower every student by customizing exams to each student's individual needs"
          />

          <Feature
            icon="🔒"
            text="Prevent cheating with our secure browser lockdown mode"
          />
        </div>

        {/* Row 2 - 2 centered */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-10">

          <Feature
            icon="📊"
            text="Collect the exams your way. Stand alone or through an LMS. Online or offline. With or without handwritten attachments."
          />

          <Feature
            icon="⚡"
            text="Auto-mark your exams based on the rules you’ve set up or choose to mark manually"
          />
        </div>

      </div>
    </section>
  );
}

/* Feature Card */
function Feature({ icon, text }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center
      hover:shadow-lg transition   w-full max-w-sm mx-auto">
      
      <div className="text-4xl mb-4">{icon}</div>

      <p className="text-[#2a384a] font-semibold">
        {text}
      </p>
    </div>
  );
}
