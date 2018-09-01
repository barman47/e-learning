const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('teacherSignup', {
        title: 'Teacher Sign Up',
        style: '/css/signup.css',
        script: '/js/signup.js'
    });
});

module.exports = router;