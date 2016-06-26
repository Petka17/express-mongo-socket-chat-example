var crypto   = require('crypto');
var mongoose = require('lib/mongoose');
var Schema   = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema
    .virtual('password')
    .set(function(value) {
        this._plainPassword = value;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(value);
    })
    .get(function() {
        return this._plainPassword;
    });

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', schema);
