require('./config/config.js');
const _             = require('lodash');

const express         = require('express');
const bodyParser      = require('body-parser');
const {ObjectID}    = require('mongodb');
const bcrypt    = require('bcryptjs');

var {mongoose}      = require('./db/mongoose.js');
var {Todo}          = require('./models/todo.js');
var {User}          = require('./models/user.js');
var {authenticate}  = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send('Given id is not valid');
    }

    Todo.findByIdAndRemove(id).then((todo) => {
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

app.patch('/todos/:id', (req, res) => {
    var id      = req.params.id;
    var body    = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        res.status(404).send('Given id is not valid');
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed   = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {new: true}).then((todo) => {
        // Not found
        if (!todo) {
            res.status(404).send('Given id is not found!');
        }

        res.send({todo});

    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    var body    = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body    = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send();
    }, () => {
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