const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

let Student = require('../models/student');

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
    res.render('studentDashboard', {
        title: 'Student Dashboard',
        style: '/css/studentDashboard.css',
        script: '/js/studentDashboard.js'
    });
});

module.exports = router;