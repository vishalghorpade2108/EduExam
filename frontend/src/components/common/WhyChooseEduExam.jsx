import { Check, CheckCircle } from "lucide-react";
import whyImg from "../../assets/WhyChooseEduExam.png";
import monitorImg from "../../assets/WhyChooseEduExam2.png"; // 

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
                86% of the teachers say EduExam is a time-saver
              </p>
            </div>

            <div className="flex gap-4">
              <Check className="text-yellow-500 mt-1" size={74} />
              <p className="text-2xl">
                <span className="text-blue-600 underline font-semibold">
                  Auto-marked exams
                </span>{" "}
                allow you to save time marking so that you can focus on more
                meaningful tasks and deliver feedback to your students promptly.
              </p>
            </div>

            <div className="flex gap-4 pl-1">
              <Check className="text-yellow-500 mt-1" size={44} />
              <p className="text-2xl">
                No more time wasted deciphering messy handwriting for long-form
                questions and essays.
              </p>
            </div>

            <div className="flex gap-4">
              <Check className="text-yellow-500 mt-1" size={44} />
              <p className="text-2xl">
                <span className="text-blue-600 underline font-semibold">
                  Individual question library
                </span>{" "}
                — by reusing questions from previous exams, you create new
                assessments quickly.
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
                98% of the teachers agree EduExam helps them efficiently monitor
                students in real-time
              </p>
            </div>

            <div className="flex gap-4 pl-1 ">
              <Check className="text-yellow-500 mt-1" size={44} />
              <p className="text-2xl leading-relaxed">
                Gain control with our intuitive <span className="text-blue-600 underline font-semibold">monitoring view </span>, allowing you to
                track the progress of each student during an exam. Identify
                students who may need assistance or are yet to begin writing.
                Our built-in chat enables communicating with each of the students
                without disrupting the entire class.
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
