const expect    = require('expect');
const request   = require('supertest');
const {ObjectID}= require('mongodb');

const {app}     = require('./../server.js');
const {Todo}    = require('./../models/todo');
const {User}    = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos', () => {
   it('should create a new todo', (done) => {
       var text = 'Test string';

       request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
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

            Todo.find({text}).then((todos) => {
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
        .set('x-auth', users[0].tokens[0].token)
        .send({
            text
        })
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(3);
                done();
            }).catch((e) => {
                done(e);
            });
        });
   });
});

describe('GET /todos', () => {
   it('should get all todos', (done) => {
       request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
   });
});

describe('GET /todos/:id', () => {
   it('should get an todo', (done) => {
       request(app)
        .get('/todos/' + todos[0]._id.toHexString())
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
   });

   it('should not get an todo', (done) => {
       request(app)
        .get('/todos/' + todos[1]._id.toHexString())
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
   });

   it('should get an 404 error code', (done) => {
       var id = new ObjectID().toHexString();
       request(app)
        .get('/todos/' + id)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
   });

    it('should get an 404 error code', (done) => {
        request(app)
            .get('/todos/asdsadsa')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
   it('should remove an todo', (done) => {
       request(app)
            .delete('/todos/' + todos[1]._id.toHexString())
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err, res) => {
                if (err) {
                    return done();
                }
                Todo.findById(todos[1]._id.toHexString()).then((res) => {
                    expect(res).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
   });
   it('should not remove an todo', (done) => {
       request(app)
            .delete('/todos/' + todos[0]._id.toHexString())
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
   });

   it('should get an 404 error code', (done) => {
       var id = new ObjectID().toHexString();
       request(app)
            .delete('/todos/' + id)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
   });

    it('should get an 404 error code', (done) => {
        request(app)
            .delete('/todos/asdsadsa')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
   it('should update an todo', (done) => {
       request(app)
        .patch('/todos/' + todos[0]._id.toHexString())
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completed).toBe(true);
        })
        .end(done);
   });
   it('should not update an todo', (done) => {
       request(app)
        .patch('/todos/' + todos[1]._id.toHexString())
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: true
        })
        .expect(404)
        .end(done);
   });

   it('should update an todo remove completed flag', (done) => {
       request(app)
        .patch('/todos/' + todos[1]._id.toHexString())
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: false
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completed).toBe(false);
        })
        .end((err, res) => {
            if (err) {
                return done();
            }

            Todo.findById(todos[1]._id.toHexString()).then((res) => {
                expect(res.completedAt).toNotExist();
                done();
            }).catch((e) => {
                done(e);
            });


        });
   });

   it('should get an 404 error code', (done) => {
       var id = new ObjectID().toHexString();
       request(app)
        .patch('/todos/' + id)
           .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
   });

    it('should get an 404 error code', (done) => {
        request(app)
            .patch('/todos/asdsadsa')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'new@email.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request is invalid', (done) => {
        var email = 'newasdemail.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        var email = 'new@email.com';
        var password = '123mnb!';

        var user = new User({email, password}).save(() => {
            request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .end(done);
        });
    });
});

describe('POST /users/login', () => {
    it('should login a user', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token:  res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'asdsadsa'
            })
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err) {
                    done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));

            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove logged in token', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens[0]).toNotExist();
                    done();
                }).catch((e) => done(e));
            })
    });
});