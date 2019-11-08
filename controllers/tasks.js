const express = require('express');
const router = express.Router();
const List = require('../models/tasks.js')

//___________________
// Routes
//___________________

//This is our new route
router.get('/new', (req, res) => {
    res.render('tasks/new.ejs');
})


//This is our edit route
router.get('/:id/edit', (req, res) => {
    List.findById(req.params.id, (err, foundTask) => {
        res.render('tasks/edit.ejs', {
            task: foundTask
        })
    })
})

//This is our delete route
router.delete('/:id', (req, res) => {
    List.findByIdAndRemove(req.params.id, (err, data) => {
        res.redirect('/tasks');
    })
})

//This is our SHOW route, a READ route
router.get('/:id', (req, res) => {
    List.findById(req.params.id, (error, foundTask) => {
        res.render(
            'tasks/show.ejs',
            {
                task : foundTask,
            }
        );
    });
});


//This is our CREATE route
router.post('/', (req, res) => {
    // find out why this isn't working if snippet below is commented out
    if(req.body.completed === 'on'){
        req.body.completed = true;
    } else {
        req.body.completed = false;
    }
    List.create(req.body, (err, createdList) => {
        res.redirect('/tasks');
    });
})



//This is our index route, a READ route
router.get('/', (req, res) => {
    if(req.session.username){
        List.find({}, (err, allTasks) => {
            res.render('tasks/index.ejs', {
                tasks: allTasks
            })
        })
    } else {
        res.redirect('/');
    }
});

//this is our PATCH route
router.patch('/:id', (req, res) => {
    List.findByIdAndUpdate(req.params.id, req.body, {new:true},
    (err, task) => {
        task.completed = true;
        task.save();
        res.redirect('/tasks')
    })
})

//this is our PUT route
router.put('/:id', (req, res) => {
    if(req.body.completed === 'on'){
        req.body.completed = true;
    } else {
        req.body.completed = false;
    }
    List.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updateTask)=>{
        res.redirect('/tasks/'+req.params.id)
    })
})


module.exports = router;
