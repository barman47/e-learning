const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use('student', new LocalStrategy({
        usernameField: "studentEmail",
        passwordField: "studentPassword",
        passReqToCallback: true
      }, function verifyCallback(req, studentEmail, studentPassword, done) {
            Student.findOne({ email: studentEmail }, function(err, student) {
            if (err) return done(err);
            if (!student) {
                return done(null, false, {msg: 'No student found'});
            }
            bcrypt.compare(studentPassword, student.password, (err, isMatch) => {
                if (err) return done(err);
                if (!isMatch) {
                    return done(null, false, {msg: 'Incorrect Password'});
                } else {
                    return done(null, student);
                }
            });
        });
    }));

    passport.use('teacher', new LocalStrategy({
        usernameField: 'teacherEmail',
        passwordField: 'teacherPassword',
        passReqToCallback: true
    }, function verifyCallback (req, teacherEmail, teacherPassword, done) {
        Teacher.findOne({email: teacherEmail}, (err, teacher) => {
            if (err) {
                return done (err);
            }

            if (!Teacher) {
                return done(null, false, {msg: 'No Teacher found'});
            }
            bcrypt.compare(teacherPassword, teacher.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done (null, false, {msg: 'Incorrect Password'});
                } else {
                    return done(null, teacher);
                }
            });
        });
    }));

    let sessionConstructor = function (userId, userGroup, details) {
        this.userId = userId;
        this.userGroup = userGroup;
        this.details = details;
    }

    passport.serializeUser((userObject, done) => {
        let userGroup = Student;
        let userPrototype = Object.getPrototypeOf(userObject);

        if (userPrototype === Student.prototype) {
            userGroup = Student;
        } else if (userPrototype === Teacher.prototype) {
            userGroup = Teacher;
        }

        sessionConstructor = new SessionConstructor(userObject.id, userGroup);
        done (null, sessionConstructor);
    });

    passport.deserializeUser((sessionConstructor, done) => {
        if (sessionConstructor.userGroup === Student) {
            Student.findOne({
                _id: sessionConstructor.userId,
            }, '-localStrategy.password', (err, student) => {
                done (err, student)
            });
        } else if (sessionConstructor.userGroup === Teacher) {
            Teacher.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', (err, Teacher) => {
                done (err, teacher);
            });
        }
    });
};

// const LocalStrategy = require('passport-local').Strategy;
// const Student = require('../models/student');
// const Teacher = require('../models/teacher');
// const bcrypt = require('bcryptjs');

// module.exports = (passport) => {
//     passport.use('student', new LocalStrategy({
//         usernameField: "studentEmail",
//         passwordField: "password",
//         passReqToCallback: true
//       }, function verifyCallback(req, studentEmail, password, done) {
//             Student.findOne({email: studentEmail}, function(err, student) {
//             if (err) return done(err);
//             if (!student) {
//                 console.log('No student found, incorrect email');
//                 return done(null, false, {msg: 'No student found'});
//             }
//             bcrypt.compare(password, student.password, (err, isMatch) => {
//                 console.log('stored password')
//                 console.log(student.password);
//                 if (err) return done(err);
//                 if (!isMatch) {
//                     console.log('No password match');
//                     return done(null, false, {msg: 'Incorrect Password'});
//                 } else {
//                     console.log('Password match');
//                     return done(null, student);
//                 }
//             });
//         });
//     }));

//     passport.use('teacher', new LocalStrategy({
//         usernameField: 'teacherEmail',
//         passwordField: 'password',
//         passReqToCallback: true
//     }, function verifyCallback (req, teacherEmail, password, done) {
//         Teacher.findOne({email: teacherEmail}, (err, teacher) => {
//             if (err) {
//                 return done (err);
//             }

//             if (!teacher) {
//                 return done(null, false, {msg: 'No Teacher found'});
//             }
//             bcrypt.compare(password, teacher.password, (err, isMatch) => {
//                 if (err) {
//                     return done(err);
//                 }
//                 if (!isMatch) {
//                     return done (null, false, {msg: 'Incorrect Password'});
//                 } else {
//                     return done(null, teacher);
//                 }
//             });
//         });
//     }));

//     let SessionConstructor = function (userId, userGroup, details) {
//         this.userId = userId;
//         this.userGroup = userGroup;
//         this.details = details;
//     }

//     passport.serializeUser((userObject, done) => {
//         let userGroup = Student;
//         let userPrototype = Object.getPrototypeOf(userObject);

//         if (userPrototype === Student.prototype) {
//             userGroup = Student;
//         } else if (userPrototype === Teacher.prototype) {
//             userGroup = Teacher;
//         }

//         let sessionConstructor = new SessionConstructor(userObject.id, userGroup);
//         done (null, sessionConstructor);
//     });

//     passport.deserializeUser((sessionConstructor, done) => {
//         if (sessionConstructor.userGroup === Student) {
//             Student.findOne({
//                 _id: sessionConstructor.userId
//             }, '-localStrategy.password', (err, student) => {
//                 done (err, student)
//             });
//         } else if (sessionConstructor.userGroup === Teacher) {
//             Teacher.findOne({
//                 _id: sessionConstructor.userId
//             }, '-localStrategy.password', (err, teacher) => {
//                 done (err, teacher);
//             });
//         }
//     });
// };