const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

const config = require('../config/database');
let Teacher = require('../models/teacher');
let Student = require('../models/student');
let Question = require('../models/question');
let File = require('../models/file');

const mongoURI = config.database;

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
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'books'
                };
                resolve(fileInfo);
            });
        });
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
                    let teacherName = teacher.name;
                    res.render('teacherDashboard', {
                        title: 'Teacher Dashboard',
                        style: '/css/teacherDashboard.css',
                        script: '/js/teacherDashboard.js',
                        question,
                        name: teacherName,
                        id: teacher._id,
                        student
                    });
                });
            }
        });
    });
});

router.get('/courses/:category', (req, res) => {
    console.log(req.params.category);
    File.find({category: req.params.category}, (err, file) => {
        if (err) {
            return console.log(err);
        }
        if (!file) {
            return console.log('No file exists');
        } else {
            console.log(file._id);
            gfs.collection('books');
            gfs.files.find({_id: file._id}).toArray((err, books) => {
                if (!books || books.length === 0) {
                    return res.status(404).json({
                        err: 'No files exist'
                    });
                }
                return res.json(books);
            });
        }
    });

});

// @route POST /upload
// @desc Uploads file to DB
router.post('/upload/:id', upload.single('file'), (req, res) => {
    const teacherId = req.params.id;
    let fileId = req.file.id;
    fileId = mongoose.Types.ObjectId(fileId);
    const category = req.body.subjectCategory;

    let file = new File({
        _id: fileId,
        category
    });

    file.save((err) => {
        if (err) {
            return console.log(err);
        } else {
            console.log('File uploaded');
            req.flash('success', 'File uploaded Sucessfully');
            res.redirect(`/teachers/dashboard/${teacherId}`);
        }
    });

});

// @route GET /books
// @desc Display all books in JSON
router.get('/books', (req, res) => {
    gfs.collection('books');
    gfs.files.find().toArray((err, books) => {
        if (!books || books.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        // return res.json(books);
        res.render('books', {
            books
        });
    });
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Your are logged out');
    res.redirect('/');
});

module.exports = router;
