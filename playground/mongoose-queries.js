const {ObjectID}    = require('mongodb');

const {mongoose}    = require('./../server/db/mongoose');
const {Todo}        = require('./../server/models/todo');
const {User}        = require('./../server/models/user');

var id = '5a79ab9d8d141b24f079f2c6';
var userId = '5a74db7a68e5e23308484083';

if (!ObjectID.isValid(id)) {
    return console.log('ID is not valid!');
}

Todo.find({
    _id: id
}).then((todos) => {
   console.log('Todos',todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('Todo', todo)
});

Todo.findById(id).then((todo) => {
    // Not found
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('Todo by id', todo);
})
// Invalid ID
 .catch((e) => {
    console.log(e);
});


User.findById(userId).then((todo) => {
    // Not found
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('user by id', todo);
})
// Invalid ID
 .catch((e) => {
    console.log(e);
});

