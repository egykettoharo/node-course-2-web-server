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

    // https://docs.mongodb.com/manual/reference/operator/update/
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5a74c226432fc58a6fa73221')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a749205f2fa9c0ef47ca03a')
    }, {
        $set: {
            name: 'Béla'
        },
        $inc: {
            age: 3
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    //db.close()
});