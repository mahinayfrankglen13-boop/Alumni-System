if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

// Security & Middleware Imports
const helmetConfig = require('./config/security');
const { globalLimiter } = require('./middleware/rateLimiter');
const sanitizeMongo = require('./middleware/mongoSanitize');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

// Routes
const userRoutes = require('./routes/users');
const alumniRoutes = require('./routes/alumni');
const jobRoutes = require('./routes/jobs');
const directoryRoutes = require('./routes/directory');
const announcementRoutes = require('./routes/announcements');
const courseRoutes = require('./routes/courses');

// Models
const User = require('./models/user');
const Job = require('./models/job');
const Announcement = require('./models/announcement');
const Course = require('./models/course');

const app = express();

// Security Headers (Helmet) & HTTP Overrides
app.use(helmetConfig);
app.use(methodOverride('_method'));

// Database Connection
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/alumniSystem';

mongoose.connect(dbUrl)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// View Engine Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parsers & Static Assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// NoSQL Injection Defense & Rate Limiting
app.use(sanitizeMongo);
app.use(globalLimiter);

// Persistent MongoDB Session Store for Production
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.SESSION_SECRET || 'thisshouldbeabettersecret!'
  }
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR:', e);
});

// Session & Authentication
const sessionMiddleware = session({
  store,
  name: 'session',
  secret: process.env.SESSION_SECRET || 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Global View Locals Middleware
app.use(catchAsync(async (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.page = '';
  res.locals.alumniCount = 0;
  res.locals.jobsCount = 0;
  res.locals.announcementsCount = 0;
  res.locals.coursesCount = 0;

  if (req.user) {
    const jobQuery = req.user.role === 'admin' ? {} : { status: 'approved' };
    const alumniQuery = req.user.role === 'admin' ? { role: 'alumni' } : { role: 'alumni', status: 'approved', profileVisibility: 'public' };

    const [alumniCount, jobsCount, announcementsCount, coursesCount] = await Promise.all([
      User.countDocuments(alumniQuery),
      Job.countDocuments(jobQuery),
      Announcement.countDocuments({}),
      Course.countDocuments({})
    ]);

    res.locals.alumniCount = alumniCount;
    res.locals.jobsCount = jobsCount;
    res.locals.announcementsCount = announcementsCount;
    res.locals.coursesCount = coursesCount;
  }

  next();
}));

// Application Routes
app.use('/', userRoutes);
app.use('/alumni', alumniRoutes);
app.use('/alumni', jobRoutes);
app.use('/alumni', directoryRoutes);
app.use('/alumni', announcementRoutes);
app.use('/alumni', courseRoutes);

// 404 Handler
app.use((req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  let message = err.message;

  if (statusCode === 500) {
    console.error('Internal Server Error:', err);
    message = 'An unexpected server error occurred. Please try again later or contact support.';
  }

  res.status(statusCode).render('error', {
    err: { statusCode, message }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
