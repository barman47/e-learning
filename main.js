const express = require('express');
const exphbs = require('express-handlebars');
const path =  require('path');

const app = express();
const PORT = process.env.PORT || 3200;
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        style: 'css/index.css',
        script: 'js/home.js'
    });
});

app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}...`);
});