const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../config/database'); // Adjust the path based on your project structure

// Local Strategy (for username/password login)



// passport.use(new LocalStrategy({
//     usernameField: 'name',
//     passwordField: 'password',
// }, async (name, password, done) => {



//     try {
//         const result = db.query('SELECT * FROM User WHERE Name = "John Doe" LIMIT 1');
//         const rows = result._results;
//         console.log('result:', result);
//     } catch (error) {
//         console.error('Error executing the query:', error);
//     }
//     // try {
//     //     console.log('Attempting to query the database for user:', name);

//     //     const result = await db.query('SELECT * FROM User WHERE name = ? LIMIT 1', [name]);
//     //     console.log('result:', result);

//     //     // console.log('Result of the database query:', result);
//     //     // const rows = result.rows;


//     //     // Check if result is an array and not empty
//     //     if (!Array.isArray(result) || result.length === 0) {
//     //         console.log('Authentication failed: User not found');
//     //         return done(null, false, { message: 'User not found' });
//     //     }


//     //     // Check if rows is defined
//     //     if (!rows) {
//     //         console.log('Authentication failed: User not found');
//     //         return done(null, false, { message: 'User not found' });
//     //     }

//     //     if (rows.password !== password) {
//     //         console.log('Authentication failed: Invalid credentials');
//     //         return done(null, false, { message: 'Invalid credentials' });
//     //     }

//     //     console.log('Authentication successful. User:', rows);

//     //     return done(null, rows);
//     // } catch (error) {
//     //     console.error('Error during authentication:', error);
//     //     return done(error);
//     // }


// }));


// // JWT Strategy (for token-based authentication)
// const jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: 'your-secret-key',
// };

// passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
//     try {
//         const [rows, fields] = await db.query('SELECT * FROM User WHERE UserId = ?', [payload.sub]);

//         if (!rows || rows.length === 0) {
//             return done(null, false);
//         }

//         return done(null, rows[0]);
//     } catch (error) {
//         return done(error, false);
//     }
// }));

module.exports = passport;
