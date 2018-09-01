const express = require('express');
const router = express.Router();
const path = require('path')
// const publicPath

router.get('/register', (req, res) => {
    res.render('studentSignup', {
        title: 'Student Signup',
        style: '/css/signup.css',
        script: '/js/signup.js'
    });
});

module.exports = router;