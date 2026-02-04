import Exam from "../models/Exam.model.js";
import Question from "../models/Question.model.js"
import Teacher from "../models/Teacher.model.js";
import Student from "../models/Student.model.js";
const generateExamKey = (className) => {
  const cleanClass = className.replace(/\s+/g, "").toUpperCase();
  const random5Digit = Math.floor(10000 + Math.random() * 90000);
  return `${cleanClass}-${random5Digit}`;
};

export const saveExam = async (req, res) => {
  try {
    const examKey = generateExamKey(req.body.class);
    const exam = await Exam.create({
      teacherId: req.user.id,
      examKey,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Exam saved successfully",
      exam,
      examId:exam._id
    });
  } catch (error) {
    console.error(error);
    console.log("an error occured")
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const  getTeacherExam =async(req,res)=>{
try { const exams = await Exam.find({
      teacherId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      exams,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE EXAM ================= */
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.id,
    });

    if (!exam)
      return res.status(404).json({ message: "Exam not found" });

    res.json({ success: true, message: "Exam deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getExamForEdit = async (req, res) => {
 try{

  const exam = await Exam.findById(req.params.id);
 
  if (!exam){ 
    return res.status(404).json({ message: "Exam not found" })
 };

  if (exam.status !== "DRAFT") {
   
     return res.status(403).json({ message: "Exam is not editable" });
   
  }

  const questions = await Question.find({ exam: exam._id });

 
  res.json({
    exam,
    questions,
    step: exam.lastCompletedStep,
  });
}catch(error){
  console.error(error);
  res.status(500).json({ message: error.message });
  console.log(error);
}
};



  // publish drafted exam 
  export const publishExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam)
      return res.status(404).json({ message: "Exam not found" });

    if (exam.status === "PUBLISHED") {
      return res.status(400).json({ message: "Exam already published" });
    }


    // ✅ PUBLISH EXAM
    exam.status = "PUBLISHED";
    exam.publishedAt = new Date();
    await exam.save();

    res.json({
      message: "Exam published successfully",
      exam,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const verifyExamKey = async (req, res) => {
  try {
    const { examKey } = req.params;

    const exam = await Exam.findOne({ examKey });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Check exam status
    if (exam.status === "DRAFT") {
      return res.status(403).json({
        success: false,
        message: "Exam is not published yet",
      });
    }

    if (exam.status === "ENDED") {
      return res.status(405).json({
        success: false,
        message: "Exam has ended",
      });
    }

    const now = new Date();

    // Exam not started yet
    if (now < exam.startTime) {
      return res.status(403).json({
        success: false,
        message: "Exam has not started yet",
        startTime: exam.startTime,
      });
    }

    // Exam time over
    if (now > exam.endTime) {
      return res.status(405).json({
        success: false,
        message: "Exam time is over",
      });
    }

    // Exam is valid & active
    return res.status(200).json({
      success: true,
      message: "Exam key verified",
      exam,
    });

  } catch (error) {
    console.error("Verify Exam Key Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




export const getExamByKey = async (req, res) => {
  try {
    const { examKey } = req.params;

    // 1️⃣ Fetch exam
    const exam = await Exam.findOne({ examKey });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // 2️⃣ Fetch teacher using teacherId from exam
    const teacher = await Teacher.findById(exam.teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 3️⃣ Send combined response
    res.json({
      examName: exam.examName,
      subject: exam.subject,
      className: exam.class,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      examKey: exam.examKey,
      teacherName: teacher.name,
    });
  } catch (error) {
    console.error("Get exam error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const startExam = async (req, res) => {
  const { studentId } = req.body;

  const student = await Student.findById({_id:studentId});

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  if (student.status === "SUBMITTED") {
    return res.status(403).json({ message: "Exam already submitted" });
  }

  student.status = "STARTED";
  student.startedAt = new Date();
  await student.save();

  res.json({ message: "Exam started" });
};

export const getQuestionsByExamKey = async (req, res) => {
  try {
    const  examKey1  = req.params;
    
       const examKey = examKey1['examkey']
    // 1️⃣ Find exam using examKey
    const exam = await Exam.findOne({ examKey });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // 2️⃣ Find questions using exam._id
    const questions = await Question.find({
      exam: exam._id,
    }).select("-correctAnswer"); // 🔐 hide answer

    res.status(200).json({
      success: true,
      examId: exam._id,
      totalQuestions: questions.length,
      questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
 export const getExamDetailForTEacher=async(req,res)=>{
   try{
    const examId=req.params.id;
    const exam=await Exam.findById({_id: examId});
    if(!exam){
      return res.status(404).json({message:"Exam not found"});
    }
    res.json({exam});
   }catch(error){
    console.error(error);
    res.status(500).json({message:"Server error"});
   }  
  }
  export const getQuestionsByExamId=async(req,res)=>{
    try{
      const question=await Question.find({exam:req.params.id});
      res.json({question});
    }
     catch(error){
      console.error(error);
      res.status(500).json({message:"Server error"});
     }
  }

  export const endExam=async(req,res)=>{
    try {
       const examKey=req.body.examKey;
      const exam=await Exam.findOne({examKey:examKey});
      if(!exam){
        return res.status(404).json({message:"Exam not found"});
      }
      if(exam.status==="ENDED"){
        return res.status(400).json({message:"Exam already ended"});
      }
      exam.status="ENDED";
      await exam.save();
      res.json({message:"Exam ended successfully"});
   
    } catch (error) {
      console.error(error);
      res.status(500).json({message:"Server error"});
    }
  }