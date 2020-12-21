const express = require('express');
const { mongo } = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const User = require('../models/User');
const Message = require('../models/Message');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user,
    details: null
  })
);


router.get("/get-data", function (req, res) {
  User.find({}, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("dashboard", { user: req.user, details: allDetails })
    }
  })
});

router.get('/chat/:id', function (req, res) {
  var profile = " ";
  var chatter = req.params.id;
  User.find({ email: chatter }, function (err, data) {
    console.log("data: ", data[0].name)
    profile = data[0].name;
  });
  console.log("profile0", profile);
  Message.find({ $or: [{ $and: [{ from: req.user.email }, { to: chatter }] }, { $and: [{ from: chatter }, { to: req.user.email }] }] }, function (err, message) {
    console.log("profile0", profile);
    res.render('chat', { result: profile, message: message, to: chatter });
  })
});

router.get('/refresh/:id', function (req, res) {
  var profile = " ";
  var chatter = req.params.id;
  User.find({ email: chatter }, function (err, data) {
    console.log("data: ", data[0].name)
    profile = data[0].name;
  });
  console.log("profile0", profile);
  Message.find({ $or: [{ $and: [{ from: req.user.email }, { to: chatter }] }, { $and: [{ from: chatter }, { to: req.user.email }] }] }, function (err, message) {
    var data = { profile, message, chatter };
      console.log("profile3: ", profile);
      res.send(data);
  })
});



router.post('/send/:id', async (req, res) => {
  var chatter = req.params.id;
  try {
    var profile = " ";
    User.find({ email: chatter }, function (err, data) {
      console.log("data ", data[0].name);
      profile = data[0].name;
      console.log("profile1: ", profile);
    });
    console.log("profile2: ", profile);
    var message = new Message({ from: req.user.email, to: chatter, message: req.body.message });
    var savedMessage = await message.save();
    console.log('saved to:' + chatter);
    Message.find({ $or: [{ $and: [{ from: req.user.email }, { to: chatter }] }, { $and: [{ from: chatter }, { to: req.user.email }] }] }, function (err, message) {
      var data = { profile, message, chatter };
      console.log("profile3: ", profile);
      res.send(data);
      res.render('chat', { result: profile, message: message, to: chatter });
    });
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  };
});



module.exports = router;
