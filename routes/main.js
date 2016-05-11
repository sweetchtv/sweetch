var express = require('express');
var router = express.Router();
var credentials = require('../credentials')

var Account = require('../models/account')
var Film = require('../models/film')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.renderWithAsset('index')
})

router.get('/login', function(req, res, next){
  if(req.isSigned()){
    req.session.flash.message = 'Already logged on'
    res.redirect('back')
  }else{
    res.renderWithAsset('login')
  }
})

router.post('/login', function(req, res, next){
  Account.findOne({email: req.body.email}).exec(function(err, account){
    if(err){
      console.error(err.stack)
      return next(err)
    }else if(!account){
      req.session.flash.message = 'There is no such account'
      res.status(401).redirect('back')
    }else if(account.password !==
      credentials.encryptPassword(req.body.password)){
        req.session.flash.message = 'Invalid password'
        res.status(401).redirect('back')
    }else{
      req.session.signedAccountId = account._id
      res.redirect('/')
    }
  })
})

router.get('/logout', function(req, res, next){
  req.logout()
  res.redirect('back')
})

router.get('/join', function(req, res, next){
  res.renderWithAsset('join')
})


module.exports = router;
