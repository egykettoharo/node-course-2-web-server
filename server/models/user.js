var mongoose = require('mongoose');

const userSchema = {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
};
var User = mongoose.model('Users', userSchema);

module.exports = {
    User
};