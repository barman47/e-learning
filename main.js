const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
const path =  require('path');

const config = require('./config/database');
const students = require('./routes/students');
const teachers = require('./routes/teachers');

const PORT = process.env.PORT || 3200;
const publicPath = path.join(__dirname, 'public');

// const mongoURI = config.database;

// mongoose.connect(config.database, {
//     useNewUrlParser: true
// });

// let conn = mongoose.connection;

// // let gfs;

// conn.once('open', () => {
//     console.log('Database Connection Established Successfully.');
//     //Initialize Stream
//     // gfs = Grid(conn.db, mongoose.mongo);
//     // gfs.collection('books');
// });

// conn.on('error', (err) => {
//     console.log(err);
// });

// // Create Storage engine
// const storage = new GridFsStorage({
//     url: mongoURI,
//      file: (req, file) => {
//          return new Promise((resolve, reject) => {
//              crypto.randomBytes(16, (err, buf) => {
//                  if (err) {
//                      return reject(err);
//                  }
//                  const filename = buf.toString('hex') + path.extname(file.originalname);
//                  const fileInfo = {
//                      filename: filename,
//                      bucketName: 'books'
//                  };
//                  resolve(fileInfo);
//             });
//         });
//     }
// });
// const upload = multer({ storage });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(favicon(publicPath + '/img/favicon.png'));
app.use(express.static(publicPath));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
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

require('./config/passport')(passport);

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

// @route POST /upload
// @desc Uploads file to DB
// app.post('/upload/:id', upload.single('file'), (req, res) => {
//     const teacherId = req.params.id;
//     console.log('File uploaded');
//     // res.json({file: req.file
//     req.flash('success', 'File uploaded Sucessfully');
//     res.redirect(`/teachers/dashboard/${teacherId}`);
// });

// // @route GET /books
// // @desc Display all books in JSON
// app.get('/books', (req, res) => {
//     gfs.collection('books');
//     gfs.files.find().toArray((err, books) => {
//         if (!books || books.length === 0) {
//             return res.status(404).json({
//                 err: 'No files exist'
//             });
//         }
//         return res.json(books);
//     });
// });

app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}...`);
});
