var express         = require('express');
var bodyParser      = require('body-parser');
var {ObjectID}    = require('mongodb');

var {mongoose}  = require('./db/mongoose.js');
var {Todo}      = require('./models/todo.js');
var {User}      = require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
     Todo.find().then((todos) => {
        res.send({
            todos
        });
     }, (e) => {
         res.status(400).send(e);
     });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send('Given id is not valid');
    }

    Todo.findById(id).then((todo) => {
            // Not found
            if (!todo) {
                res.status(404).send('Given id is not found!');
            }

            res.send({
                todo
            });
        })
        // Invalid ID
        .catch((e) => {
            res.status(400).send();
        });
});

app.listen(port, () => {
    console.log('Started on port ' + port);
});

//var newTodo = new Todo({
//    text: 'Cook dinner'
//});

//newTodo.save().then((doc) => {
//    console.log('Saved todo', doc);
//}, (e) => {
//    console.log('Unable save todo', e);
//});
//
//var otherTodo = new Todo({
//    text: 'Cook lunch',
//    completed: true,
//    completedAt: 123
//});
//
//otherTodo.save().then((doc) => {
//    console.log('Saved todo', doc);
//}, (e) => {
//    console.log('Unable save todo', e);
//});

//var newUser = new User({
//    email: 'egykettoharo@gmail.com'
//});
//
//newUser.save().then((doc) => {
//    console.log('Saved user', doc);
//}, (e) => {
//    console.log('Unable save user', e);
//});

module.exports = {app};