const express = require('express');
const router = express.Router();

const Course = require('../models/course');

router.post('/login', (req, res) => {
    let body = req.body;
    const login = {
        username: body.adminUsername,
        password: body.adminPassword
    };
    const adminUsername = 'admin';
    const password1 = 'younow';
    const password2 = 'askme';

    req.checkBody('adminUsername', 'username is required').notEmpty();
    req.checkBody('adminPassword', 'Password is required').notEmpty();

    let adminErrors = req.validationErrors();

    if (adminErrors) {
        req.flash('failure', 'Please provide a username and password');
        res.redirect('/')
    } else if ((login.username === adminUsername) && (login.password === password1 || login.password === password2)) {
        res.redirect('/admins/dashboard');
    } else {
        req.flash('failure', 'Incorrect Username or password');
        res.redirect('/');
    }
});

router.get('/dashboard', (req, res) => {
    res.render('adminDashboard', {
        title: 'Admin Dashboard',
        style: '/css/adminDashboard.css',
        script: '/js/adminDashboard.js',
        admin: true,
    });
});


router.post('/addCourse', (req, res) => {
    const course = req.body.course;    
    Course.findOneAndUpdate({name: 'course'}, {
        $push: {courses: course}
    }, {new: true}, (err, updatedCourse) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(`Course: ${course} added successfully`);
            res.end();
        }
    });
});

module.exports = router;