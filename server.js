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

//This is our new route
app.get('/new', (req, res) => {
    res.render('new.ejs');
})


//This is our edit route
app.get('/:id/edit', (req, res) => {
    List.findById(req.params.id, (err, foundTask) => {
        res.render('edit.ejs', {
            task: foundTask
        })
    })
})

//This is our delete route
app.delete('/:id', (req, res) => {
    List.findByIdAndRemove(req.params.id, (err, data) => {
        res.redirect('/');
    })
})

//This is our SHOW route, a READ route
app.get('/:id', (req, res) => {
    List.findById(req.params.id, (error, foundTask) => {
        res.render(
            'show.ejs',
            {
                task : foundTask,
            }
        );
    });
});


//This is our CREATE route
app.post('/', (req, res) => {
    // find out why this isn't working if snippet below is commented out
    if(req.body.completed === 'on'){
        req.body.completed = true;
    } else {
        req.body.completed = false;
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

//this is our PUT route
app.put('/:id', (req, res) => {
    if(req.body.completed === 'on'){
        req.body.completed = true;
    } else {
        req.body.completed = false;
    }
    List.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updateTask)=>{
        res.redirect('/'+req.params.id)
    })
})

//this is our PATCH route
app.patch('/:id', (req, res) => {
    List.findByIdAndUpdate(req.params.id, req.body, {new:true},
    (err, task) => {
        task.completed = true;
        task.save();
        res.redirect('/'+req.params.id)
    })
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



// =======================
// Code Graveyard
// =======================
//
// This was used in index.ejs to update text when task was marked as completed or not completed
// <%# <%if(tasks[i].completed == false){%>Not Completed <%} else {%>
//     Task Completed
// <%}%> %>
