var add = (a, b) => {
    return a + b;
};

var asyncAdd = (a, b, callback) => {
    setTimeout(() => {
        callback(a + b);
    }, 1500);
};

var square = (x) => {
    return x * x;
};

var asyncSquare = (x, callback) => {
    setTimeout(() => {
        callback(x * x);
    }, 1500);
};

var setName = (user, fullName) => {
    var names = fullName.split(' ');

    user.first_name = names[0];
    user.last_name  = names[1];

    return user;
};

module.exports = {
    setName,
    add,
    asyncAdd,
    square,
    asyncSquare
};