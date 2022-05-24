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

router.post('/wave/:id', async (req, res) =>  {

    const selectedUser = await User.find({"_id": req.params.id}, (user) => user);
    let localWavedList = [];
    localWavedList = req.user.wavedList

    if(selectedUser[0]._id != req.user.id){
        if(localWavedList.length !== 0){
            localWavedList.forEach(user => {
                if(user.email !== selectedUser[0].email){
                    localWavedList.push(selectedUser[0]);
                }else{
                    console.log('person already added');
                }
            });
        }else{
            localWavedList.push(selectedUser[0]);
        }
    }
    req.user.wavedList = localWavedList;

    // console.log(localWavedList);
    
    req.user.save();
    res.redirect('/dashboard');
});

router.get('/delete/:id', (req, res) => {
    console.log(req.params.id);

    let localWavedList = req.user.wavedList;
    
    let filteredWavedList = localWavedList.filter(function(value, index, arr) {
        return value._id === req.params.id
    })

    req.user.wavedList = filteredWavedList;
    req.user.save();
    res.redirect('/dashboard');

});

module.exports = router;