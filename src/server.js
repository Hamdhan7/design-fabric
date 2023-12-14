// src/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');

const db = require('../src/config/database'); // Import the database connection module

const port = 3000;

app.use(cors());
app.use(passport.initialize());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, '../../public/images')));

// Passport middleware
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth2.0 strategy
passport.use(new GoogleStrategy({
  clientID: '1089276245997-e49tiqts7v9qeeruno6rkce0gu5n4231.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  // Check if the user exists in your database
  const query = 'SELECT * FROM User WHERE GoogleID = ?';
  db.query(query, [profile.id], (err, results) => {
    if (err) {
      return done(err);
    }

    if (results.length > 0) {
      // User already exists, return the user
      return done(null, results[0]);
    } else {
      // User doesn't exist, insert into the User table
      const insertQuery = 'INSERT INTO User (GoogleID, Name) VALUES (?, ?)';
      db.query(insertQuery, [profile.id, profile.displayName], (err) => {
        if (err) {
          return done(err);
        }

        // Fetch the newly inserted user
        db.query(query, [profile.id], (err, newUserResults) => {
          if (err) {
            return done(err);
          }

          // Return the newly inserted user
          return done(null, newUserResults[0]);
        });
      });
    }
  });
}));

// Serialize and deserialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.UserID);
});

passport.deserializeUser((id, done) => {
  const query = 'SELECT * FROM User WHERE UserID = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return done(err);
    }
    const user = results[0];
    done(null, user);
  });
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to the dashboard or another page
    res.redirect('http://localhost:3001/admin');
  }
);

// Your other routes will go here
const userRoutes = require('./routes/userRoots');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/auth');


app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes); // Assuming you want admin routes under /api/admin
app.use('/auth', authRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

