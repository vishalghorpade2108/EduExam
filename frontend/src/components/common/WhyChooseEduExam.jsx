import { Check, CheckCircle } from "lucide-react";
import whyImg from "../../assets/whychooseEduexam.png";
import monitorImg from "../../assets/whychooseEduexam2.png"; //
                                     

export default function WhyChooseEduExam() {
  return (
    <section className="py-28 bg-white">

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-semibold text-[#2a384a] text-center mb-20">
        Why choose EduExam?
      </h2>

      <div className="max-w-7xl mx-auto px-6 space-y-24">

        {/* 🔹 NEW TOP SECTION */}
     

        {/* 🔹 EXISTING SECTION (UNCHANGED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div className="flex justify-center">
            <img
              src={whyImg}
              alt="Why choose EduExam"
              className="max-w-full h-auto rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="space-y-6 text-[#2a384a]">

            <div className="flex gap-4">
              <CheckCircle className="text-green-500 mt-1" size={49} />
              <p className="text-3xl font-semibold">
                86% of teachers report that EduExam saves them valuable time.
              </p>
            </div>

            <div className="flex gap-4">
              <Check className="text-yellow-500 mt-1" size={74} />
              <p className="text-2xl">
                <span className="text-blue-600 underline font-semibold">
                   Automated exam marking
                </span>{" "}
                streamlines assessment, enabling educators to allocate more time to instruction and timely student feedback.
              </p>
            </div>

            <div className="flex gap-4 pl-1">
              <Check className="text-yellow-500 mt-1" size={44} />
              <p className="text-2xl">
                Digital responses remove the challenge of interpreting handwritten long-form answers and essays.
              </p>
            </div>

            <div className="flex gap-4">
              <Check className="text-yellow-500 mt-1" size={44} />
              <p className="text-2xl">
                <span className="text-blue-600 underline font-semibold">
                  Individual question library
                </span>{" "}
               Reuse questions from past exams to build new assessments faster with your personal question library.
              </p>
            </div>

          </div>
        </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div className="space-y-6 text-[#2a384a]">

            <div className="flex gap-4">
              <CheckCircle className="text-green-500 mt-1" size={48} />
              <p className="text-3xl font-semibold">
                98% of teachers report more efficient real-time student monitoring with EduExam.
              </p>
            </div>

            <div className="flex gap-4 pl-1 ">
              <Check className="text-yellow-500 mt-1" size={44} />
              <p className="text-2xl leading-relaxed">
                Gain control with our intuitive{" "}
<span className="text-blue-600 underline font-semibold">monitoring view</span>,
which lets you track each student’s progress in real time during an exam.
Quickly identify students who need assistance or haven’t started yet.
Our built-in chat allows you to communicate with individual students
without disrupting the rest of the class.

              </p>
            </div>

          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              src={monitorImg}
              alt="Real-time exam monitoring"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
