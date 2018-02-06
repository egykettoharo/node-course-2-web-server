const expect    = require('expect');
const request   = require('supertest');

const {app}     = require('./../server.js');
const {Todo}    = require('./../models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => {
        done();
    });
});

describe('Post /todos', () => {
   it('should create a new todo', (done) => {
       var text = 'Test string';

       request(app)
        .post('/todos')
        .send({
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            });
        });
   });

   it('should not create a todo and return an error', (done) => {
       var text = '';

       request(app)
        .post('/todos')
        .send({
            text
        })
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(0);
                done();
            }).catch((e) => {
                done(e);
            });
        });
   });
});