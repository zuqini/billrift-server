var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var app = require('../config/express');
chai.use(chaiHttp);

describe('AllGroupsRoute', function() {
	it('should return all groups', function(done) {
		chai.request(app)
			.get('/groups/')
			.end(function(err, res){
				// console.log(res.body);
				res.body.should.be.a('array');
				if (res.body.length > 0) {
					res.body[0].should.have.property('_id');
			    	res.body[0].should.have.property('name');
			    	res.body[0].should.have.property('balance');
					res.body[0].should.have.property('userIds');
			    	res.body[0].userIds.should.be.a('array');
				}
				res.should.have.status(200);
				done();
			});
	});
});
