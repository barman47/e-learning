const express = require('express');
const router = express.Router();

const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Course = require('../models/course');
const Book = require('../models/book');

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
    Teacher.find({}, (err, teachers) => {
        if (err) return console.log(err);
        Student.find({}, (err, students) => {
            if (err) return console.log(err)
            Course.find({name: 'course'}, (err, course) => {
                if (err) return console.log(err);
                res.render('adminDashboard', {
                    title: 'Admin Dashboard',
                    style: '/css/adminDashboard.css',
                    script: '/js/adminDashboard.js',
                    admin: true,
                    teachers,
                    students,
                    course
                });
            });
        });
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

router.post('/removeCourse', (req, res) => {
    const course = req.body.courseToRemove;  
    console.log('course', course);  
    Course.findOneAndUpdate({name: "course"}, {
        $pull: {courses: course}
    }, {safe: true, upsert: true}, (err, updatedCourses) => {
        if (err) {
            return console.log();
        } else {
            Book.deleteMany({category: course}, (err) => {
                if (err) {
                    return console.log(err);
                } else {
                    console.log(`Course: ${course} removed successfully`);
                    res.end();
                }
            });
        }
    })
});

module.exports = router;