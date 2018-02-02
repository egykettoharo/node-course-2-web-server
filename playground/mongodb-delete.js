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

    // deleteMany
    db.collection('Todos').deleteMany({
        text: 'Something to do'
    }).then((result) => {
       console.log(result);
    });

    // deleteOne
    db.collection('Todos').deleteOne({
        text: 'Walk the dog'
    }).then((result) => {
        console.log(result);
    });

    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({
        text: 'Walk the dog 2'
    }).then((result) => {
        console.log(result);
    });

    db.collection('Users').deleteMany({name: 'Béla'});

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5a7495dfc92c853714dd60f6')}).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });


    //db.close()
});