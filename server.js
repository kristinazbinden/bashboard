//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()

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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//use method override
app.use(methodOverride('_method')); //allow POST, PUT and DELETE from a form

// Middleware four our CSS
app.use('/public', express.static('public'));

//set the home page
app.get('/', (req, res) => {
    res.render('welcome.ejs');
})

// use controller files
const tasksController = require('./controllers/tasks.js');
app.use('/tasks', tasksController);

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



// =======================
// Code Graveyard
// =======================
//
// This was used in index.ejs to update text when task was marked as completed or not completed
// <%# <%if(tasks[i].completed == false){%>Not Completed <%} else {%>
//     Task Completed
// <%}%> %>


// This is the code to include in html to make confetti falling effect
// Taken from https://github.com/mathusummut/confetti.js
// <script>confetti.start(2000)</script>
