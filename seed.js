const mongoose = require('mongoose');
const User = require('./models/user');
const Course = require('./models/course');
const Job = require('./models/job');
const Announcement = require('./models/announcement');

mongoose.connect('mongodb://127.0.0.1:27017/alumniSystem')
  .then(() => {
    console.log('MongoDB connected for seeding...');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

const seedDB = async () => {
  console.log('Clearing existing database collections...');
  await User.deleteMany({});
  await Course.deleteMany({});
  await Job.deleteMany({});
  await Announcement.deleteMany({});
  console.log('Database cleared!');

  console.log('Creating courses...');
  const coursesData = [
    { courseCode: 'BSCS', courseName: 'Bachelor of Science in Computer Science' },
    { courseCode: 'BSIT', courseName: 'Bachelor of Science in Information Technology' },
    { courseCode: 'BSIS', courseName: 'Bachelor of Science in Information Systems' },
    { courseCode: 'BSCE', courseName: 'Bachelor of Science in Civil Engineering' },
    { courseCode: 'BSEE', courseName: 'Bachelor of Science in Electrical Engineering' }
  ];

  const createdCourses = await Course.insertMany(coursesData);
  console.log(`Created ${createdCourses.length} courses.`);

  const bscs = createdCourses.find(c => c.courseCode === 'BSCS');
  const bsit = createdCourses.find(c => c.courseCode === 'BSIT');
  const bsis = createdCourses.find(c => c.courseCode === 'BSIS');
  const bsce = createdCourses.find(c => c.courseCode === 'BSCE');
  const bsee = createdCourses.find(c => c.courseCode === 'BSEE');

  console.log('Creating admin user...');
  const admin = new User({
    email: 'admin@msumcest.edu.ph',
    fullName: 'Frank Admin',
    alumniId: 1000,
    course: bscs._id,
    graduationYear: 2018,
    role: 'admin',
    status: 'approved',
    bio: 'Official MSU-MCEST Alumni System Administrator.',
    profileVisibility: 'public'
  });

  const registeredAdmin = await User.register(admin, 'admin123');
  console.log('Admin created: admin@msumcest.edu.ph / admin123');

  console.log('Creating approved alumni users...');
  
  const alumni1 = new User({
    email: 'frank.gonzales@example.com',
    fullName: 'Frank Gonzales',
    alumniId: 2020001,
    course: bscs._id,
    graduationYear: 2022,
    role: 'alumni',
    status: 'approved',
    bio: 'Full Stack Web Developer specializing in Node.js, Express, and cloud infrastructure.',
    profileVisibility: 'public'
  });
  const registeredAlumni1 = await User.register(alumni1, 'password123');

  const alumni2 = new User({
    email: 'christian.cruz@example.com',
    fullName: 'Christian Cruz',
    alumniId: 2020002,
    course: bsit._id,
    graduationYear: 2021,
    role: 'alumni',
    status: 'approved',
    bio: 'UI/UX Designer and Frontend Specialist passionate about modern web interfaces.',
    profileVisibility: 'public'
  });
  const registeredAlumni2 = await User.register(alumni2, 'password123');

  const alumni3 = new User({
    email: 'alvin.santos@example.com',
    fullName: 'Alvin Santos',
    alumniId: 2020003,
    course: bsis._id,
    graduationYear: 2023,
    role: 'alumni',
    status: 'approved',
    bio: 'Data Analyst and BI Specialist exploring machine learning and data pipelines.',
    profileVisibility: 'public'
  });
  const registeredAlumni3 = await User.register(alumni3, 'password123');

  const alumni4 = new User({
    email: 'bea.reyes@example.com',
    fullName: 'Bea Reyes',
    alumniId: 2020004,
    course: bsce._id,
    graduationYear: 2020,
    role: 'alumni',
    status: 'approved',
    bio: 'Licensed Civil Engineer focused on structural design and project management.',
    profileVisibility: 'public'
  });
  const registeredAlumni4 = await User.register(alumni4, 'password123');

  const alumni5 = new User({
    email: 'daryl.fernandez@example.com',
    fullName: 'Daryl Fernandez',
    alumniId: 2020005,
    course: bsee._id,
    graduationYear: 2021,
    role: 'alumni',
    status: 'approved',
    bio: 'Electrical Engineer specializing in power distribution and renewable energy systems.',
    profileVisibility: 'private'
  });
  const registeredAlumni5 = await User.register(alumni5, 'password123');

  console.log('Creating pending alumni users (without bio / without posted data)...');

  const pendingAlumni1 = new User({
    email: 'evelyn.mercado@example.com',
    fullName: 'Evelyn Mercado',
    alumniId: 2020006,
    course: bscs._id,
    graduationYear: 2024,
    role: 'alumni',
    status: 'pending',
    profileVisibility: 'public'
  });
  await User.register(pendingAlumni1, 'password123');

  const pendingAlumni2 = new User({
    email: 'grace.torres@example.com',
    fullName: 'Grace Torres',
    alumniId: 2020007,
    course: bsit._id,
    graduationYear: 2024,
    role: 'alumni',
    status: 'pending',
    profileVisibility: 'public'
  });
  await User.register(pendingAlumni2, 'password123');

  const pendingAlumni3 = new User({
    email: 'hannah.ramos@example.com',
    fullName: 'Hannah Ramos',
    alumniId: 2020008,
    course: bsce._id,
    graduationYear: 2023,
    role: 'alumni',
    status: 'pending',
    profileVisibility: 'private'
  });
  await User.register(pendingAlumni3, 'password123');

  console.log('All alumni accounts created (password: password123).');

  console.log('Creating announcements...');
  const announcementsData = [
    {
      title: 'Grand Alumni Homecoming 2026 Registration Open',
      content: 'We invite all MSU-MCEST graduates to register for the upcoming Grand Alumni Homecoming event taking place this December at the main campus auditorium. Reconnect with batchmates and faculty!',
      createdBy: registeredAdmin._id,
      createdAt: new Date()
    },
    {
      title: 'Annual Career & Industry Networking Seminar',
      content: 'Join our annual virtual and on-campus career fair featuring top technology companies, engineering firms, and partner agencies.',
      createdBy: registeredAdmin._id,
      createdAt: new Date(Date.now() - 86400000 * 2)
    },
    {
      title: 'MSU-MCEST Innovation & Startup Grant Challenge',
      content: 'Applications are now open for alumni-led technology startups. Winners will receive up to ₱100,000 in seed funding and mentorship.',
      createdBy: registeredAdmin._id,
      createdAt: new Date(Date.now() - 86400000 * 5)
    }
  ];

  await Announcement.insertMany(announcementsData);
  console.log('Announcements created.');

  console.log('Creating job opportunities (only from approved alumni)...');
  const jobsData = [
    {
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Philippines',
      description: 'Looking for an experienced Full Stack Developer skilled in Node.js, Express, MongoDB, and React to lead web engineering projects.',
      location: 'Iligan City / Remote',
      applicationUrl: 'https://example.com/apply/fullstack',
      postedBy: registeredAlumni1._id,
      status: 'approved',
      createdAt: new Date()
    },
    {
      title: 'UI/UX Product Designer',
      company: 'Creative Studio CDO',
      description: 'Seeking a talented designer to create wireframes, interactive prototypes, and high-fidelity component libraries for web and mobile platforms.',
      location: 'Cagayan de Oro City',
      applicationUrl: 'https://example.com/apply/designer',
      postedBy: registeredAlumni2._id,
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 3)
    },
    {
      title: 'Junior Data Analyst',
      company: 'Mindanao Analytics Inc.',
      description: 'Entry-level position for data enthusiasts. Knowledge of SQL, Python, and Tableau/PowerBI is a plus.',
      location: 'Davao City / Remote',
      applicationUrl: 'https://example.com/apply/data-analyst',
      postedBy: registeredAlumni3._id,
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      title: 'Cloud Infrastructure Engineer',
      company: 'Apex Cloud Davao',
      description: 'Responsible for maintaining AWS cloud infrastructure, Docker containers, and CI/CD deployment pipelines.',
      location: 'Cebu City / Hybrid',
      applicationUrl: 'https://example.com/apply/cloud',
      postedBy: registeredAlumni1._id,
      status: 'pending',
      createdAt: new Date(Date.now() - 43200000)
    },
    {
      title: 'Structural Site Engineer',
      company: 'BuildRight Construction Corp',
      description: 'Overseeing daily construction site operations, structural inspections, and client compliance.',
      location: 'Metro Manila',
      applicationUrl: 'https://example.com/apply/civil',
      postedBy: registeredAlumni4._id,
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 5)
    },
    {
      title: 'Electrical Systems Engineer',
      company: 'PowerGrid Mindanao',
      description: 'Designing electrical schematics, power distribution plans, and substation maintenance schedules.',
      location: 'General Santos City',
      applicationUrl: 'https://example.com/apply/electrical',
      postedBy: registeredAlumni5._id,
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 4)
    }
  ];

  await Job.insertMany(jobsData);
  console.log('Job opportunities created.');

  console.log('Seeding completed successfully!');
};

seedDB().then(() => {
  mongoose.connection.close();
});
