var express = require('express');
var router = express.Router();
var path = require('path');

var Account = require('../models/account');

router.get('/', function(req, res, next) {
  Account.find({}).exec(function(err, accounts){
    if(err){
      console.error(err.stack)
      return next(err)
    }
    res.renderWithAsset('accounts/index', {accounts: accounts});
  });
});

router.post('/', function(req, res, next){
  var account = req.body;
  Account.create(account, function(err, account){
    if(err){
      console.error(err.stack);
      console.dir(err)
      return next(err)
    }
    res.redirect(account.url());
  });
});

router.get('/new', function(req, res, next){
  res.renderWithAsset('accounts/new');
});

router.get('/:id', function(req, res, next) {
  Account.findOne({_id: req.params.id}).exec(function(err, account){
    if(err){
      if(err.message === `Cast to ObjectId failed for value "${err.value}" at path "_id"`){
        return next()
      }else{
        console.error(err.stack)
        return next(err)
      }
    }
    if(account){
      res.renderWithAsset('accounts/show', {account: account});
    }else{
      next()
    }
  });
});



module.exports = router;
