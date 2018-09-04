const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

let Teacher = require('../models/teacher');

router.get('/register', (req, res) => {
    res.render('teacherSignup', {
        title: 'Teacher Sign Up',
        style: '/css/signup.css',
        script: '/js/signup.js'
    });
});

router.post('/register', (req, res) => {
    const body = req.body;
    const newTeacher = {};
    newTeacher.firstName = body.firstName;
    newTeacher.lastName = body.lastName;
    newTeacher.email = body.email;
    newTeacher.password = body.password;
    newTeacher.confirmPassword = body.confirmPassword;
    newTeacher.gender = body.gender;

    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Invalid Email Address').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match!').equals(newTeacher.password);
    req.checkBody('gender', 'Please Select your Gender').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('teacherSignup', {
            title: 'Teacher Sign up',
            style: '/css/signup.css',
            script: '/js/signup.js',
            errors: errors,
            firstName: newTeacher.firstName,
            lastName: newTeacher.lastName,
            email: newTeacher.email,
            password: newTeacher.password,
            confirmPassword: newTeacher.confirmPassword
        });
    } else {
        let teacher = new Teacher({
            name: `${newTeacher.firstName} ${newTeacher.lastName}`,
            email: newTeacher.email,
            password: newTeacher.password,
            gender: newTeacher.gender
        });

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
                        req.flash('success', 'Registration Successful. You now Log in.');
                        res.redirect('/');
                    }
                });
            });
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('teacher', (err, teacher, info) => {
        if (err) {
            return next(err);
        }

        if (!teacher) {
            //req.flash('failure', 'Incorrect email or password!');
            res.send('Incorrect Email or Password');
            next();
        }
        req.logIn(teacher, (err) => {
            let id = teacher._id;
            id = mongoose.Types.ObjectId(id);
            res.send('Teacher Logged In');
            //return res.redirect()
            next();
        });
    })(req, res, next);
});


module.exports = router;