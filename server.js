//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
const List = require('./models/tasks.js')

//___________________
//Port
//___________________
const PORT = process.env.PORT;

//___________________
//Database
//___________________
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________
//use public folder for static assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//use method override
app.use(methodOverride('_method')); //allow POST, PUT and DELETE from a form

//___________________
// Routes
//___________________

//This is our CREATE route
app.post('/', (req, res) => {
    // find out why this isn't working if snippet below is commented out
    if(req.body.shipIsBroken === 'on'){
        req.body.shipIsBroken = true;
    } else {
        req.body.shipIsBroken = false;
    }
    List.create(req.body, (err, createdList) => {
        res.redirect('/');
    });
})


//This is our index route, a READ route
app.get('/', (req, res) => {
    List.find({}, (err, allTasks) => {
        res.render('index.ejs', {
            tasks: allTasks
        })
    })
});


//This is our new route
app.get('/new', (req, res) => {
    res.render('logs/new.ejs');
})


//create path to mongodb

mongoose.connect('mongodb://localhost:27017/bashboard', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
  console.log('The connection with mongod is established')
})

//___________________
//Listener
//___________________
app.listen(PORT, () => {
    console.log('Listening on port:', PORT);
})
