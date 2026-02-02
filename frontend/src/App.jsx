import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import TeacherSignIn from "./components/TeacherSignIn.jsx";
import TeacherSignUp from "./components/TeacherSignUp.jsx";
import DashbaordExams from "./components/teacher/DashboardExams.jsx"
import NewExam from "./components/new-exam/NewExam.jsx";
import Results from "./components/monitoring-results/Results.jsx";
import EditQuestionsOnly from "./components/editExam/editExam.jsx";
import Profile from "./components/teacher/Profile.jsx";
import HelpTraining from "./components/teacher/HelpTraining.jsx";
import School from "./components/teacher/School.jsx";
import StudentDetails from "./components/AppearExam/StudentDetails.jsx";
import ExamInstructions from "./components/AppearExam/ExamInstructions.jsx";
import ExamPage from "./components/AppearExam/ExamPage.jsx";
import ExamSubmitted from "./components/AppearExam/ExamSubmitted.jsx";
import TeacherExamView from "./components/teacher/TeacherExamView.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/teacher-login" element={<TeacherSignIn />} />
         <Route path="/teacher-registration" element={<TeacherSignUp />} />
         <Route path="/teacher/exams" element={<DashbaordExams />} />
         <Route path="/teacher/new-exam" element={<NewExam />} />
        <Route path="/teacher/results" element={<Results />} />
         <Route
          path="/teacher/exam/:examId/edit"
          element={<EditQuestionsOnly />}
        />
        <Route
          path="/teacher/exam/:examId/view"
          element={<TeacherExamView />}
        />
        <Route path="/teacher/profile" element={<Profile />} />
        <Route path="/dashboard/help" element={<HelpTraining />} />
        <Route path="/dashboard/school" element={<School />} />
        <Route
  path="/student/details/:examKey"
  element={<StudentDetails />}
   />
   <Route  path="/student/examInstruction/:examKey"  element={<ExamInstructions />}   />

   <Route  path="/student/exam/:examKey"  element={<ExamPage/>}   />
    <Route path="/student/exam-submitted" element={<ExamSubmitted />} />

      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
