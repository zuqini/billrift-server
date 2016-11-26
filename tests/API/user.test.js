var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var assert = chai.assert;
var app = require('../config/express');
chai.use(chaiHttp);

describe('UserRoute', function() {
	it('should list ALL users on /user GET', function(done) {
		chai.request(app)
			.get('/user')
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

	it('should login test user', function(done) {
		chai.request(app)
			.post('/user/login')
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
	});
});