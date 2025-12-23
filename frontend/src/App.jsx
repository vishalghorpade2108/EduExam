import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import TeacherSignIn from "./components/TeacherSignIn.jsx";
import TeacherSignUp from "./components/TeacherSignUp.jsx";
import DashbaordExams from "./components/teacher/DashboardExams.jsx"
import NewExam from "./components/new-exam/NewExam.jsx";
import Results from "./components/monitoring-results/Results.jsx";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
