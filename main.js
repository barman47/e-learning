const express = require('express');
const exphbs = require('express-handlebars');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const path =  require('path');

const config = require('./config/database');
const students = require('./routes/students');
const teachers = require('./routes/teachers');

const PORT = process.env.PORT || 3200;
const publicPath = path.join(__dirname, 'public');

mongoose.connect(config.database, {
    useNewUrlParser: true
});

let db = mongoose.connection;

db.once('open', () => {
    console.log('Database Connection Established Successfully.');
});

db.on('error', (err) => {
    console.log(err);
});

const app = express();

app.use(favicon(publicPath + '/img/favicon.png'));
app.use(express.static(publicPath));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('keybaord cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success');
    res.locals.failure_message = req.flash('failure');
    next();
});
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