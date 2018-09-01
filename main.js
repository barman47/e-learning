const express = require('express');
const exphbs = require('express-handlebars');
const favicon = require('express-favicon');
const path =  require('path');

const students = require('./routes/students');
const teachers = require('./routes/teachers');

const app = express();
const PORT = process.env.PORT || 3200;
const publicPath = path.join(__dirname, 'public');

app.use(favicon(publicPath + '/img/favicon.png'));
app.use(express.static(publicPath));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');
app.use('/students', students);
app.use('/teachers', teachers);

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Edufy - Home',
        style: 'css/index.css',
        script: 'js/home.js'
    });
});

app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}...`);
});