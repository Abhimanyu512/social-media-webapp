var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    dp: String,
    bio: String,
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);