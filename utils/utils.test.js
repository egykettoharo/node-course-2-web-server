const expect = require('expect');

const utils = require('./utils');

describe('Utils', () => {
    it('utils.add function test. (add two numbers)', () => {
        var res = utils.add(33, 11);

        expect(res)
            .toBe(44, 'Expected 44, but got ' + res)
            .toBeA('number', 'Result is not a number');
    });

    it ('utils.asnycAdd function test. (add two numbers)', (done) => {
        utils.asyncAdd(4, 3, (sum) => {
            expect(sum).toBe(7).toBeA('number');
            done();
        });
    });

    it ('utils.asyncSquare function test. (square a number)', (done) => {
        utils.asyncSquare(4, (sum) => {
            expect(sum).toBe(16).toBeA('number');
            done();
        });
    });

    it('utils.square function test. (square a number)', () => {
        var res = utils.square(5);

        expect(res)
            .toBe(25, 'Expected 25, but got ' + res)
            .toBeA('number', 'Result is not a number');
    });

    it('should expect some values', () => {
        expect(12).toNotBe(11);
        expect({name: 'Andrew'}).toNotEqual({name: 'andrew'});
        expect({name: 'Andrew'}).toEqual({name: 'Andrew'});
        expect([2,3,4]).toInclude(2);
        expect([2,3,4]).toExclude(1);
        expect({
            name: 'Martin',
            age: 25,
            location: 'Budapest'
        }).toInclude({
            age: 25
        });
        expect({
            name: 'Martin',
            age: 25,
            location: 'Budapest'
        }).toExclude({
            age: 23
        })
    });

    it('Should split names to first and last name', () => {
        var user = {
            age: 25,
            location: 'Budapest'
        };

        var fullName = 'Kocsis Martin';
        user = utils.setName(user, fullName);

        expect(user).toInclude({
            first_name: 'Kocsis',
            last_name:  'Martin',
            age: 25,
            location: 'Budapest'
        });

        expect(user).toBeA('object');
    });
});