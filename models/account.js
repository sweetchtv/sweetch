var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var db = require('../db');
var path = require('path');
var credentials = require('../credentials')
var uniqueValidator = require('mongoose-unique-validator')

var schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email field must be filled'],
    set: function(email){
      return email.toLowerCase()
    },
    validate: {
      validator: function(email){
        return /^.+@.+$/.test(email)
      },
      message: 'invalid email address'
    },
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password must be exist'],
    validate: {
      validator: function(password){
        if(password.length >= 8){
          this.password =
            credentials.encryptPassword(password)
          return true
        }else{
          return false
        }
      },
      message: 'invalid password'
    }
  },
  name: {type: String, required: [true, 'name must be filled'], unique: true},
},
{
  toObject: {virtuals: true},
  toJSON: {virtuals: true},
  timestamps: true
});
schema.plugin(uniqueValidator)

schema.methods.url = function(){
  return path.join('/accounts', this._id.toString());
};

var Account = db.model('Account', schema);

module.exports = Account;
