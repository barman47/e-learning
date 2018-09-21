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

let Student = require('../models/student');
let Question = require('../models/question');

const mongoURI = config.database;

mongoose.connect(config.database, {
    useNewUrlParser: true
});

let conn = mongoose.connection;

let gfs;

conn.once('open', () => {
    console.log('Student Database Conection Established Successfully');
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
    res.render('studentSignup', {
        title: 'Student Signup',
        style: '/css/signup.css',
        script: '/js/signup.js'
    });
});

router.post('/register', (req, res) => {
    const body = req.body;
    const newStudent = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        gender: body.gender
    };
    
    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Invalid Email Address').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match!').equals(newStudent.password);
    req.checkBody('gender', 'Please Select your Gender').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('studentSignup', {
            title: 'Student Signup',
            style: '/css/signup.css',
            script: '/js/signup.js',
            errors: errors,
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            email: newStudent.email,
            password: newStudent.password,
            confirmPassword: newStudent.confirmPassword
        });
    } else {
        let student = new Student({
            name: `${newStudent.firstName} ${newStudent.lastName}`,
            email: newStudent.email,
            password: newStudent.password,
            gender: newStudent.gender
        });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return console.log(err);
            }
            bcrypt.hash(student.password, salt, (err, hash) => {
                if (err) {
                    return console.log(err);
                }
                student.password = hash;
                student.save((err) => {
                    if (err) {
                        return console.log(err);
                    } else {
                        req.flash('success', 'Registration Successful. You now have Unlimited Access to all our Study Materials.');
                        res.redirect('/');
                    }   
                });
            });
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('student', (err, student, info) => {
        if (err) {
            return next(err);
        }
        if (!student) {
            req.flash('failure', 'Incorrect Email or Password.');
            return res.redirect('/');
        }

        req.logIn(student, (err) => {
            let id = student._id;
            id = mongoose.Types.ObjectId(id); 
            res.redirect(`/students/dashboard/${id}`);
        });
    })(req, res, next);
});

router.get('/dashboard/:id', (req, res) => {
    let query = {_id: req.params.id};
    Student.findOne(query, (err, student) => {
        if (err) {
            return console.log(err);
        } else {
            let studentData = student;
            gfs.collection('books');
            gfs.files.find().toArray((err, books) => {
                if (!books || books.length === 0) {
                    return res.status(404).json({
                        err: 'No files exist'
                    });
                }
                console.log(books);
                res.render('studentDashboard', {
                    title: 'Student Dashboard',
                    style: '/css/studentDashboard.css',
                    script: '/js/studentDashboard.js',
                    student: studentData,
                    name: studentData.name,
                    books
                });
            });
            
        }
    });
});

router.post('/askQuestion', (req, res) => {
    const body = req.body;
    let data =  {
        question: body.question,
        name: body.name
    };

    let question = new Question({
        questionAsked: data.question,
        askedBy: data.name
    });

    question.save((err) => {
        if (err) {
            return console.log(err);
        } else {
            console.log('Question asked successfully');
            res.end();
        }
    });
    res.end();
});

module.exports = router;