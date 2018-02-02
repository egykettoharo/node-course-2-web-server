const request = require('supertest');
const expect  = require('expect');

var app =  require('./server.js').app;

describe('Server', () => {

    describe('GET /hello_world', () => {
        it('should return hello world response', (done) => {
            request(app)
                .get('/hello_world')
                .expect(200)
                .expect('Hello world!')
                .end(done);
        });

        it('should return hello world response 404', (done) => {
            request(app)
                .get('/hello_world_404')
                .expect(404)
                .expect({
                    error: 'Page not found',
                    name: 'Todo App v1.0'
                })
                .expect((res) => {
                    expect(res.body).toInclude({
                        error: 'Page not found'
                    });
                })
                .end(done);
        });
    });

    describe('GET /users', () => {
        it('/users test', (done) => {
            request(app)
                .get('/users')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toInclude({
                        name: 'Jani',
                        age: 13
                    });
                })
                .end(done);
        });
    });

});