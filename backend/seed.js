// Seeds the database with sample/demo data so the app has something to
// show in the UI. Safe to re-run — it wipes only the collections it
// seeds, not your whole database. Run with: npm run seed
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

// Mongoose normally builds schema indexes in the background the instant a
// connection opens, racing with anything we do manually below. Turn that
// off for this script so index changes only ever happen when we say so,
// in a guaranteed order.
mongoose.set('autoIndex', false);

const connectDB = require('./config/db');

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Quiz = require('./models/Quiz');
const Comment = require('./models/Comment');
const Doubt = require('./models/Doubt');
const Assignment = require('./models/Assignment');
const Note = require('./models/Note');

const seed = async () => {
  await connectDB();
  console.log('Clearing existing demo data...');
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    Quiz.deleteMany({}),
    Comment.deleteMany({}),
    Doubt.deleteMany({}),
    Assignment.deleteMany({}),
    Note.deleteMany({}),
  ]);

  // If an older/stale index on registrationNumber exists (e.g. a plain
  // unique index from before it was made sparse), drop it so it doesn't
  // reject multiple users with no registration number. Safe to ignore if
  // it's already correct or doesn't exist yet.
  try {
    await User.collection.dropIndex('registrationNumber_1');
    console.log('Dropped stale registrationNumber index — will be recreated as sparse.');
  } catch (err) {
    if (err.codeName !== 'IndexNotFound') console.warn('Index cleanup skipped:', err.message);
  }
  await User.syncIndexes();
  const finalIndexes = await User.collection.indexes();
  console.log('users collection indexes now:', finalIndexes.map((i) => ({ name: i.name, unique: i.unique, sparse: i.sparse })));

  console.log('Creating sample users...');
  // Passwords are hashed automatically by the User model's pre-save hook.
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@studysphere.demo',
    password: 'Admin@123',
    role: 'admin',
  });

  const educator1 = await User.create({
    name: 'Priya Sharma',
    email: 'priya.educator@studysphere.demo',
    password: 'Educator@123',
    role: 'educator',
  });

  const educator2 = await User.create({
    name: 'Rahul Verma',
    email: 'rahul.educator@studysphere.demo',
    password: 'Educator@123',
    role: 'educator',
  });

  const student1 = await User.create({
    name: 'Ananya Roy',
    email: 'ananya.student@studysphere.demo',
    password: 'Student@123',
    role: 'student',
    registrationNumber: 'IGIT21CS045',
  });

  const student2 = await User.create({
    name: 'Karan Mehta',
    email: 'karan.student@studysphere.demo',
    password: 'Student@123',
    role: 'student',
    registrationNumber: 'IGIT21CS089',
  });

  console.log('Creating sample courses with lessons...');

  const dsaCourse = await Course.create({
    title: 'Data Structures & Algorithms Bootcamp (Sample)',
    description:
      'A demo course covering arrays, linked lists, trees, and graphs with hands-on problem walkthroughs. Sample content only.',
    category: 'Computer Science',
    educator: educator1._id,
    status: 'approved',
    semester: 3,
    lessons: [
      {
        title: 'Introduction to Arrays',
        description: 'Sample lesson placeholder — swap in your own video/notes.',
        contentType: 'text',
        order: 1,
      },
      {
        title: 'Linked Lists Deep Dive',
        description: 'Sample lesson placeholder — swap in your own video/notes.',
        contentType: 'text',
        order: 2,
      },
      {
        title: 'Binary Trees & Traversals',
        description: 'Sample lesson placeholder — swap in your own video/notes.',
        contentType: 'text',
        order: 3,
      },
    ],
  });

  const webDevCourse = await Course.create({
    title: 'Full-Stack Web Development with MERN (Sample)',
    description:
      'A demo course walking through building a MERN app from scratch — auth, REST APIs, and React fundamentals. Sample content only.',
    category: 'Web Development',
    educator: educator1._id,
    status: 'approved',
    semester: 5,
    lessons: [
      {
        title: 'Setting Up Express & MongoDB',
        description: 'Sample lesson placeholder.',
        contentType: 'text',
        order: 1,
      },
      {
        title: 'Building REST APIs',
        description: 'Sample lesson placeholder.',
        contentType: 'text',
        order: 2,
      },
    ],
  });

  const pythonCourse = await Course.create({
    title: 'Python for Beginners (Sample)',
    description:
      'A demo introductory course on Python syntax, data types, and simple scripts. Sample content only.',
    category: 'Programming',
    educator: educator2._id,
    status: 'approved',
    semester: 1,
    lessons: [
      {
        title: 'Variables & Data Types',
        description: 'Sample lesson placeholder.',
        contentType: 'text',
        order: 1,
      },
      {
        title: 'Loops & Conditionals',
        description: 'Sample lesson placeholder.',
        contentType: 'text',
        order: 2,
      },
    ],
  });

  // A pending course, so the Admin panel's approval queue isn't empty either
  await Course.create({
    title: 'Advanced System Design (Sample - Pending Review)',
    description: 'A demo course awaiting admin approval, to showcase the review workflow.',
    category: 'Computer Science',
    educator: educator2._id,
    status: 'pending',
    semester: 6,
    lessons: [
      { title: 'Scalability Basics', description: 'Sample placeholder.', contentType: 'text', order: 1 },
    ],
  });

  console.log('Adding a sample quiz...');
  const firstLesson = dsaCourse.lessons[0];
  const quiz = await Quiz.create({
    course: dsaCourse._id,
    lessonId: firstLesson._id,
    title: 'Arrays Quick Check (Sample Quiz)',
    passingScore: 50,
    questions: [
      {
        questionText: 'What is the time complexity of accessing an array element by index?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctOptionIndex: 0,
        marks: 1,
      },
      {
        questionText: 'Arrays store elements in...',
        options: ['Random memory locations', 'Contiguous memory locations', 'Linked nodes', 'Hash buckets'],
        correctOptionIndex: 1,
        marks: 1,
      },
    ],
  });
  dsaCourse.lessons[0].quiz = quiz._id;
  await dsaCourse.save();

  console.log('Creating sample enrollments with progress...');
  const enrollment1 = await Enrollment.create({
    student: student1._id,
    course: dsaCourse._id,
    completedLessons: [dsaCourse.lessons[0]._id],
    progressPercent: Math.round((1 / dsaCourse.lessons.length) * 100),
  });
  await User.findByIdAndUpdate(student1._id, { $addToSet: { enrolledCourses: dsaCourse._id } });

  await Enrollment.create({
    student: student2._id,
    course: pythonCourse._id,
    completedLessons: [pythonCourse.lessons[0]._id, pythonCourse.lessons[1]._id],
    progressPercent: 100,
    status: 'completed',
  });
  await User.findByIdAndUpdate(student2._id, { $addToSet: { enrolledCourses: pythonCourse._id } });

  console.log('Adding sample comments...');
  await Comment.create({
    course: dsaCourse._id,
    lessonId: firstLesson._id,
    author: student1._id,
    text: 'This is a sample comment — great explanation of array indexing!',
  });
  await Comment.create({
    course: dsaCourse._id,
    lessonId: firstLesson._id,
    author: educator1._id,
    text: 'Sample reply — glad it helped! Let me know if you have questions.',
  });

  console.log('Adding sample doubts, assignments, and notes...');
  const doubt = await Doubt.create({
    course: dsaCourse._id,
    student: student1._id,
    question: 'Sample doubt — why is array access O(1) but linked list access O(n)?',
    answers: [
      {
        author: educator1._id,
        text: 'Sample answer — arrays use contiguous memory so any index can be computed directly, while linked lists require traversal from the head.',
      },
    ],
    resolved: true,
  });
  await Doubt.create({
    course: dsaCourse._id,
    student: student2._id,
    question: 'Sample doubt — still open, awaiting a reply.',
    resolved: false,
  });

  const inOneWeek = new Date();
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  const inThreeDays = new Date();
  inThreeDays.setDate(inThreeDays.getDate() + 3);

  await Assignment.create({
    course: dsaCourse._id,
    title: 'Sample Assignment — Implement a Stack',
    description: 'Sample placeholder — implement push/pop/peek using an array.',
    dueDate: inOneWeek,
    createdBy: educator1._id,
  });
  await Assignment.create({
    course: dsaCourse._id,
    title: 'Sample Assignment — Reverse a Linked List',
    description: 'Sample placeholder — iterative and recursive versions.',
    dueDate: inThreeDays,
    createdBy: educator1._id,
  });

  await Note.create({
    course: dsaCourse._id,
    chapter: 'Chapter 1: Arrays',
    title: 'Sample notes — Array fundamentals',
    type: 'notes',
    content: 'Sample content placeholder — swap in your own chapter notes here.',
    uploadedBy: educator1._id,
  });
  await Note.create({
    course: dsaCourse._id,
    chapter: 'Chapter 1: Arrays',
    title: 'Sample PYQ — 2024 midterm, Q3',
    type: 'pyq',
    content: 'Sample placeholder — "Explain time complexity of array insertion at index 0."',
    uploadedBy: educator1._id,
  });

  console.log('\n✅ Seed complete. Demo login credentials:');
  console.log('  Admin:     admin@studysphere.demo / Admin@123');
  console.log('  Educator:  priya.educator@studysphere.demo / Educator@123');
  console.log('  Student:   ananya.student@studysphere.demo / Student@123');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
