var crypto = require('crypto')

module.exports.secret = 'sweetch2016';
module.exports.encryptPassword = function(password){
  return crypto.createHash('sha256')
  .update(password+module.export.secret).digest('hex')
}
