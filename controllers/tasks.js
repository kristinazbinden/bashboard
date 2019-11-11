const express = require('express');
const router = express.Router();
const List = require('../models/tasks.js');
const User = require('../models/users.js')

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
    List.findByIdAndRemove(req.params.id, (err, foundTask)=>{
        console.log(foundTask);
        User.findOne({ 'tasks._id' : req.params.id }, (err, foundUser) => {
            foundUser.tasks.id(req.params.id).remove();
            foundUser.save((err, data) => {
                res.redirect('/tasks')
            })
        })
    })
})
//
//     List.findByIdAndRemove(req.params.id, (err, data) => {
//         res.redirect('/tasks');
//     })
// })

//This is our SHOW route, a READ route
router.get('/:id', (req, res) => {
    // User.findById(req.params.id, (err, foundUser) => {
    //     console.log(foundUser);
    // })
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
        User.findById(req.session.userId, (err, foundUser) => {
            if(req.body.completed === 'on'){
                req.body.completed = true;
            } else {
                req.body.completed = false;
            }
            List.create(req.body, (err, createdTask) => {
                foundUser.tasks.push(createdTask);
                foundUser.save((err, data) => {
                    res.redirect('/tasks');
            })
        })
    })
})


//this is our PATCH route
router.patch('/:id', (req, res) => {
            if(req.body.completed === 'on'){
                req.body.completed = true;
            } else {
                req.body.completed = false;
            }
        List.findByIdAndUpdate(req.params.id, req.body, {new:true},
        (err, task) => {
            User.findOne({ 'tasks._id' : req.params.id }, (err, foundUser) => {
                thisItem = foundUser.tasks.id(req.params.id);
                thisItem.completed = true;
                foundUser.save((err, data) => {
                    res.redirect('/tasks')
                })
            })
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
        User.findOne({ 'tasks._id' : req.params.id }, (err, foundUser) => {
            foundUser.tasks.id(req.params.id).remove();
            foundUser.tasks.push(updateTask);
            foundUser.save((err, data) => {
                res.redirect('/tasks/'+req.params.id)
            })
        })
    })
})


//This is our index route, a READ route
//It is configured to show only the tasks of this particular user
router.get('/', (req, res) => {
    if(req.session.username){
        User.findById(req.session.userId, (err, foundUser) => {
            res.render('tasks/index.ejs', {
                tasks: foundUser.tasks,
                user: foundUser.username,
                userId: foundUser.id
            })
        })
    } else {
        res.redirect('/');
    }
});


module.exports = router;
