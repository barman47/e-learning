const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
// const crypto = require('crypto');

const config = require('../config/database');
let Teacher = require('../models/teacher');
let Student = require('../models/student');
let Question = require('../models/question');
let AnsweredQuestion = require('../models/answered-questions');
let Book = require('../models/book');
let Course = require('../models/course');

// const mongoURI = config.database;

mongoose.connect(config.database, {
    useNewUrlParser: true
});

let conn = mongoose.connection;

let gfs;

conn.once('open', () => {
    console.log('Teacher Database Connection Established Successfully.');
    //Initialize Stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('books');

});

// Create Storage engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

router.get('/register', (req, res) => {
    res.render('teacherSignup', {
        title: 'Teacher Sign Up',
        style: '/css/signup.css',
        script: '/js/teacherSignup.js'
    });
});

router.post('/register', (req, res) => {
    const body = req.body;
    const newTeacher = {};
    newTeacher.firstName = body.firstName;
    newTeacher.lastName = body.lastName;
    newTeacher.teacherID = body.teacherID;
    newTeacher.email = body.email;
    newTeacher.password = body.password;
    newTeacher.confirmPassword = body.confirmPassword;
    newTeacher.gender = body.gender;

    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('teacherID', 'Teacher ID Number is required').notEmpty();
    req.checkBody('email', 'Invalid Email Address').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match!').equals(newTeacher.password);
    req.checkBody('gender', 'Please Select your Gender').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('teacherSignup', {
            title: 'Teacher Sign up',
            style: '/css/signup.css',
            script: '/js/teacherSignup.js',
            errors: errors,
            firstName: newTeacher.firstName,
            lastName: newTeacher.lastName,
            teacherID: newTeacher.teacherID,
            email: newTeacher.email,
            password: newTeacher.password,
            confirmPassword: newTeacher.confirmPassword
        });
    } else {
        let teacher = new Teacher({
            name: `${newTeacher.firstName} ${newTeacher.lastName}`,
            teacherID: newTeacher.teacherID,
            email: newTeacher.email,
            password: newTeacher.password,
            gender: newTeacher.gender
        });
        
        Teacher.findOne({teacherID: teacher.teacherID}, (err, returnedTeacher) => {
            if (err) {
                return console.log(err);
            } else if (returnedTeacher) {
                res.render('teacherSignup', {
                    title: 'Teacher Sign up',
                    style: '/css/signup.css',
                    script: '/js/teacherSignup.js',
                    error: 'Teacher already exists!',
                    firstName: newTeacher.firstName,
                    lastName: newTeacher.lastName,
                    teacherID: newTeacher.teacherID,
                    email: newTeacher.email,
                    password: newTeacher.password,
                    confirmPassword: newTeacher.confirmPassword
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        return console.log(err);
                    }
                    bcrypt.hash(teacher.password, salt, (err, hash) => {
                        if (err) {
                            return console.log(err);
                        }
                        teacher.password = hash;
                        teacher.save((err) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                req.flash('success', 'Registration Successful. You can now Log in.');
                                res.redirect('/');
                            }
                        });
                    });
                });
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('teacher', (err, teacher, info) => {
        if (err) {
            console.log('=========ERROR=================');
            return next(err);
        }
        if (!teacher) {
            req.flash('failure', 'Incorrect ID Number or Password.');
            return res.redirect('/');
        }

        req.logIn(teacher, (err) => {
            let id = teacher._id;
            id = mongoose.Types.ObjectId(id);
            res.redirect(`/teachers/dashboard/${id}`);
        });
    })(req, res, next);
});

// router.get('/dashboard/:id', (req, res) => {
//     Question.find({}, (err, question) => {
//         if (err) return console.log(err);
//         Teacher.findOne({_id: req.params.id}, (err, teacher) => {
//             if (err) return console.log(err);
//             Student.find({}, (err, student) => {
//                 if (err) return console.log(err);
//                 let id = teacher._id.toString();
//                 Course.findOne({name: 'course'}, (err, course) => {
//                     if (err) return console.log(err);
//                     Book.find({}, (err, books) => {
//                         if (err) return console.log(books);
//                         // course.courses.forEach((course) => {
//                         //     console.log(course);
//                         // });
//                         let courses = course.courses;
//                         res.render('teacherDashboard', {
//                             title: 'Teacher Dashboard',
//                             style: '/css/teacherDashboard.css',
//                             script: '/js/teacherDashboard.js',
//                             question,
//                             teacher,
//                             id: teacher._id,
//                             teacherName: teacher.name,
//                             student,
//                             books,
//                             course,
//                             courses  
//                         });
//                     });
//                 });
//             });
//         });
//     });
// });

router.get('/dashboard/:id', (req, res) => {
    Question.find({}, (err, question) => {
        if (err) {
            return console.log(err);
        }
        Teacher.findOne({_id: req.params.id}, (err, teacher) => {
            if (err) {
                return console.log(err);
            } else {
                Student.find({}, (err, student) => {
                    if (err) {
                        return console.log(err);
                    }
                    let id = teacher._id.toString();
                    Book.find({category: 'Computer Science', uploadedBy: teacher.name}, (err, computerBooks) => {
                        if (err) return console.log(err);
                        Book.find({category: 'Commerce', uploadedBy: teacher.name}, (err, commerceBooks) => {
                            if (err) return console.log(err);
                            Book.find({category: 'Biology', uploadedBy: teacher.name}, (err, biologyBooks) => {
                                if (err) return console.log(err);
                                Book.find({category: 'Chemistry', uploadedBy: teacher.name}, (err, chemistryBooks) => {
                                    if (err) return console.log(err);
                                    Book.find({category: 'Physics', uploadedBy: teacher.name}, (err, physicsBooks) => {
                                        if (err) return console.log(err);
                                        Book.find({category: 'Christian Religious Studies', uploadedBy: teacher.name}, (err, crsBooks) => {
                                            if (err) return console.log(err);
                                            Course.find({name: 'course'}, (err, course) => {
                                                if (err) return console.log(err);
                                                res.render('teacherDashboard', {
                                                    title: 'Teacher Dashboard',
                                                    style: '/css/teacherDashboard.css',
                                                    script: '/js/teacherDashboard.js',
                                                    question,
                                                    teacher,
                                                    teacherName: teacher.name,
                                                    student,
                                                    course,
                                                    computerBooks,
                                                    commerceBooks,
                                                    biologyBooks,
                                                    chemistryBooks,
                                                    physicsBooks,
                                                    crsBooks                  
                                                }); 
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    });
});

// router.get('/courses/:category', (req, res) => {
//     console.log(req.params.category);
//     Book.find({category: req.params.category}, (err, books) => {
//         if (err) {
//             return console.log(err);
//         }
//         if (!book) {
//             return console.log('No books exist');
//         } else {
//             console.log(file._id);
//             gfs.collection('books');
//             gfs.files.find({_id: file._id}).toArray((err, books) => {
//                 if (!books || books.length === 0) {
//                     return res.status(404).json({
//                         err: 'No files exist'
//                     });
//                 }
//                 return res.json(books);
//             });
//         }
//     });

// });

// @route POST /upload
// @desc Uploads file to DB
router.post('/upload/:id', upload.single('file'), (req, res) => {
    // return console.log(req.file);
    const teacherId = req.params.id;
    let path = req.file.path;
    let bookName = req.file.originalname;
    let bookPath = {
        path,
        originalName: bookName
    };
    let bookId = req.file.id;
    bookId = mongoose.Types.ObjectId(bookId);
    const category = req.body.subjectCategory;
    const bookTitle = req.body.bookTitle;
    Teacher.findById(teacherId, (err, teacher) => {
        if (err) return console.log(err);
        let book = new Book({
            bookName,
            path: bookPath.path,
            originalName: bookPath.originalName,
            category,
            bookTitle,
            uploadedBy: teacher.name
        });
    
        book.save((err) => {
            if (err) {
                return console.log(err);
            } else {
                console.log('File uploaded');
                req.flash('success', 'File uploaded Sucessfully');
                res.redirect(`/teachers/dashboard/${teacherId}`);
            }
        });
    });
});

router.get('/books', (req, res) => {
    Book.find({category: 'computer'}, (err, computerBooks) => {
        if (err) return console.log(err);
        Book.find({category: 'commerce'}, (err, commerceBooks) => {
            if (err) return console.log(err);
            Book.find({category: 'biology'}, (err, biologyBooks) => {
                if (err) return console.log(err);
                Book.find({category: 'chemistry'}, (err, chemistryBooks) => {
                    if (err) return console.log(err);
                    Book.find({category: 'physics'}, (err, physicsBooks) => {
                        if (err) return console.log(err);
                        Book.find({category: 'crs'}, (err, crsBooks) => {
                            if (err) return console.log(err);
                            res.render('books', {
                                computerBooks,
                                commerceBooks,
                                biologyBooks,
                                chemistryBooks,
                                physicsBooks,
                                crsBooks
                            });
                        });
                    });
                });
            });
        });
    });
});
router.post('/answeredQuestions', (req, res) => {
    let answeredQuestion = new AnsweredQuestion({
        _id: req.body.id,
        question: req.body.question,
        answer: req.body.answer,
        askedBy: req.body.askedBy,
        answeredBy: req.body.answeredBy
    });
    answeredQuestion.save((err) => {
        if (err) {
            return console.log(err);
        }
        Question.findByIdAndRemove(answeredQuestion._id, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('Question Answered Successfully.');
            res.end();
        });
    });
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Your are logged out');
    res.redirect('/');
});

module.exports = router;