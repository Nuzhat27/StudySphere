const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');

// @route POST /api/quizzes  (educator/admin)
const createQuiz = async (req, res) => {
  try {
    const { course, lessonId, title, questions, passingScore } = req.body;
    const quiz = await Quiz.create({ course, lessonId, title, questions, passingScore });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/quizzes/:id  (strips correct answers before sending to students)
const getQuizForStudent = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      passingScore: quiz.passingScore,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks,
      })),
    };
    res.json(safeQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/quizzes/:id/submit  (student) — auto-grading
const submitQuiz = async (req, res) => {
  try {
    const { answers, courseId } = req.body; // answers: [{ questionId, selectedIndex }]
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    let totalMarks = 0;
    quiz.questions.forEach((q) => {
      totalMarks += q.marks;
      const submitted = answers.find((a) => a.questionId === String(q._id));
      if (submitted && submitted.selectedIndex === q.correctOptionIndex) {
        score += q.marks;
      }
    });

    const percent = Math.round((score / totalMarks) * 100);
    const passed = percent >= quiz.passingScore;

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (enrollment) {
      enrollment.quizScores.push({ quiz: quiz._id, score, totalMarks });
      await enrollment.save();
    }

    res.json({ score, totalMarks, percent, passed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createQuiz, getQuizForStudent, submitQuiz };
