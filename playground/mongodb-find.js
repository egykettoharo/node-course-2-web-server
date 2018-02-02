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

    db.collection('Todos').find({
        _id: new ObjectID('5a748e6fd4d0bb1e6c3fdfa6')
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    db.collection('Todos').find().count().then((count) => {
        console.log('Todos count');
        console.log(count);
    }, (err) => {
        console.log('Unable to count todos', err);
    });

    db.collection('Todos').find({
        name: 'Kocsis Martin'
    }).toArray().then((docs) => {
        console.log('Todos name');
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });




    // database.close();
});