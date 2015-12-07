var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var jsonwebtoken = require('jsonwebtoken');
var secretKey = require('../../config').secretKey;


// user schema
var UserSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false},
    active: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

// aplicar uniqueValidator plugin a UserSchema.
UserSchema.plugin(uniqueValidator);

// cifrar user password.
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

// metodos
UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};
UserSchema.methods.createToken = function () {
    var user = this;
    var token = jsonwebtoken.sign({
        _id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expirtsInMinute: 1440 // 1440 == 1 dia
    });
    return token;
};

// exortar modelo User
module.exports = mongoose.model('User', UserSchema);