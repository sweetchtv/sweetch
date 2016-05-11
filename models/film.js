var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var db = require('../db');
var path = require('path');
var Account = require('./account')

var schema = new mongoose.Schema({
  _team: {
    type: ObjectId,
    ref: 'Team',
    required: [true, 'no teamId']
  },
  file: {
    type: String,
    set: function(file){
      return path.join('/uploads', 'films', 'file', file.filename);
    },
    required: [true, 'no file']
  },
  tags: {
    type: [String],
    set: function(tags){
      if(!(tags instanceof Array) && (tags instanceof Object)){
        return Array.prototype.slice.call(tags)
      }else{
        return tags;
      }
    }
  }
},
{
  toObject: {virtuals: true},
  toJSON: {virtuals: true},
  timestamps: true
});

schema.methods.url = function(){
  return path.join('/films', this._id.toString());
};

var Film = db.model('Film', schema);

module.exports = Film;
