//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//
//var user = {name: 'Andrew', age: 25};
// Deconstruct object
//var {name} = user; // var name = user.name;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, database) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    var db = database.db('TodoApp');

    console.log('Connected to MongoDB server');

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: 'Kocsis Martin',
        age: 25,
        location: 'Budapest'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }

        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    });

    database.close();
});