const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

router.get('/new', (req, res) => {
    res.render('sessions/new.ejs')
})

router.post('/', (req, res) => {
    User.findOne({username:req.body.username}, (err, foundUser) => {
        if(foundUser === null){
            res.redirect('/sessions/new');
        } else {
            const passwordMatch =
            bcrypt.compareSync(req.body.password, foundUser.password)
            if(passwordMatch) {
                req.session.username = foundUser.username;
                req.session.userId = foundUser._id;
                req.session.tasks = foundUser.tasks;
                res.redirect('/tasks');
            } else {
                res.send('Sorry, this password doesn\'t match our records');
            }
        }
    })
})

module.exports = router;


// Code Graveyard

// router.post('/', (req, res) => {
//     User.findOne({username:req.body.username}, (err, foundUser) => {
//         if(foundUser === null){
//             res.redirect('/sessions/new');
//         } else {
//             const passwordMatch =
//             bcrypt.compareSync(req.body.password, foundUser.password)
//             if(passwordMatch) {
//                 req.session.username = foundUser.username;
//                 req.session.userID = foundUser._id;
//                 req.session.userTasks = foundUser.tasks;
//                 console.log(req.session.usertasks);
//                 res.redirect('/tasks');
//             } else {
//                 res.send('Sorry, this password doesn\'t match our records');
//             }
//         }
//     })
// })
