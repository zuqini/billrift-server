var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var app = require('../config/express');
chai.use(chaiHttp);

describe('GroupsRoute', function() {
	it('should list ALL blobs on /blobs GET', function(done) {
		chai.request(app)
			.get('/user')
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
	});
});