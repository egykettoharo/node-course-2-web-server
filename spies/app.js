var db = require('./db.js');

var handleSignup = (email, password) => {
    // Check if email already exists
    // Save the user to the db
    db.saveUser({
        email,   //email: email,
        password //password: password
    });
    // Send welcome email
};

module.exports = {
    handleSignup
};