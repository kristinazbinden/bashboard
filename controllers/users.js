const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

router.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password,
    bcrypt.genSaltSync(9));
    User.create(req.body, (err, createdUser) => {
        req.session.username = createdUser.username,
        currentUser = createdUser
        res.redirect('/');
    })
})

module.exports = router;
