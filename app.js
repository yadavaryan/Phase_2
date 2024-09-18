const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userroutes = require('./routes/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userroutes);

mongoose.connect('mongodb://localhost:27017/manageuser', {
    
})
.then(() => {
    console.log('Connected to MongoDB');
    
    app.listen(8000, () => {
        console.log('Server running on port 8000');
    });
})
.catch(error => console.error('Error connecting to MongoDB:', error));


