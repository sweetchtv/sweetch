var express = require('express')
var router = express.Router()
var path = require('path')
var multer  = require('multer')
var fs = require('fs')
var mongoose = require('mongoose')

var imageStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    try{
      callback(null, path.join('public', 'uploads', 'films', 'file'))
    }catch(err){
      console.error(err.stack)
      callback(err)
    }
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
})
var imageUpload = multer({ storage: imageStorage })

var Account = require('../models/account');
var Film = require('../models/film');

router.get('/', function(req, res, next) {
  Film.find({}).exec(function(err, films){
    if(err){
      console.error(err.stack)
      return next(err)
    }
    res.renderWithAsset('films/index', {films: films})
  })
})

router.post('/', imageUpload.single('file'), function(req, res, next){
  var films = req.body
  films.file = req.file
  films._author = req.session.signedAccountId
  Film.create(films, function(err, film){
    if(err){
      console.dir(err)
      return next(err)
    }
    res.redirect(film.url())
  })
})

router.get('/new', function(req, res, next){
  if(!req.isSigned){
    res.redirect('/login')
  }
  res.renderWithAsset('films/new')
})

router.get('/:id', function(req, res, next) {
  Film.findOne({_id: req.params.id}).exec(function(err, film){
    if(err){
      if(err.message === `Cast to ObjectId failed for value "${err.value}" at path "_id"`){
        return next()
      }else{
        console.error(err.stack)
        return next(err)
      }
    }
    if(film){
      res.renderWithAsset('films/show', {film: film})
    }else{
      next()
    }
  })
})

router.get('/fetch', function(req, res, next){
  var query
  if(req.query.lastCreatedAt){
    query = {createdAt:{$lt: new Date(req.query.lastCreatedAt)}}
  }else{
    query = {}
  }
  Film.find(query)
  .populate('_author')
  .limit(parseInt(req.query.limit))
  .sort('-createdAt')
  .exec(function(err, films){
    if(err){
      console.error(err.stack)
      return next(err)
    }
    res.json(films)
  })
})




module.exports = router
