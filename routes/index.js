const e = require('connect-flash');
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const User = require('../models/User');

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    User.find({}, function(err, users) {
       res.render('dash', {
           name: req.user.name,
           users:users,
           wavedList: req.user.wavedList
       })
    });
});

router.post('/wave/:email', ensureAuthenticated, async (req, res) =>  {
    let localList = req.user.wavedList

    if(req.user.email == req.params.email){
        console.log('you cannot add yourself');
    }else{
        if(req.params.email != null){
            if(localList.find(user => user.email == req.params.email)){
                console.log('there is a person with same email address');
            }else{
                const selectedUser = await User.find({email: req.params.email});
                console.log(selectedUser[0]);
                localList.push(selectedUser[0]);
            }
        }
    }

    req.user.wavedList = localList;
    req.user.save()
    res.redirect('/dashboard');
});

router.get('/wave/:email', (req, res) => {
    console.log(req.params.email);
    let localList = req.user.wavedList

    localList = localList.filter(user => user.email !== req.params.email);
    req.user.wavedList = localList;
    req.user.save();
    res.redirect('/dashboard');
});

module.exports = router;