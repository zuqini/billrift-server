var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var assert = chai.assert;
var app = require('../config/express');
chai.use(chaiHttp);

describe('GroupsRoute', function() {
	it('should list ALL users identified by group id', function(done) {
		chai.request(app)
			.get('/group/1/users')
			.end(function(err, res){
				res.should.have.status(200);
				assert(res.body.length > 0);
				res.body.forEach(function(user) {
					user.should.have.property('_id');
					user.should.have.property('name');
					user.should.have.property('email');
					user.should.have.property('googleId');
					user.should.have.property('groupIds');
					user.groupIds.should.be.a('array');
				});
				done();
			});
	});

	it('should not add fake user to group', function(done) {
		chai.request(app)
			.post('/group/1/user')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({email: 'bogus@phony.fake'})
			.end(function(err, res){
				res.should.have.status(404);
				done();
			});
	});

	it('should not add existing to group', function(done) {
		chai.request(app)
			.post('/group/1/user')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({email: 'test@test.test'})
			.end(function(err, res){
				res.should.have.status(500);
				done();
			});
	});

	it('should not add invalid group', function(done) {
		chai.request(app)
			.post('/group/999/user')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({email: 'test@test.test'})
			.end(function(err, res){
				res.should.have.status(404);
				done();
			});
	});

	it('should not add transaction with invalid userToId', function(done) {
		chai.request(app)
			.post('/group/1/transaction')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				userFromId: 'test@test.test',
				userToId: 'bogus@phony.fake',
				amount: 9000,
				title: 'test'
			}).end(function(err, res){
				res.should.have.status(404);
				done();
			});
	});

	it('should not add transaction with invalid userFromId', function(done) {
		chai.request(app)
			.post('/group/1/transaction')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				userFromId: 'bogus@phony.fake',
				userToId: 'test@test.test',
				amount: 9000,
				title: 'test'
			}).end(function(err, res){
				res.should.have.status(404);
				done();
			});
	});

	it('should not add transaction with same userFromId and userToId', function(done) {
		chai.request(app)
			.post('/group/1/transaction')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				userFromId: 'test@test.test',
				userToId: 'test@test.test',
				amount: 9000,
				title: 'test'
			}).end(function(err, res){
				res.should.have.status(400);
				done();
			});
	});
});
