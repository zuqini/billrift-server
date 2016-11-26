var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var app = require('../config/express');
chai.use(chaiHttp);

describe('GroupsRoute', function() {
	it('should return all groups on /groups GET', function(done) {
		chai.request(app)
			.get('/groups/')
			.end(function(err, res){
				// console.log(res.body);
				res.body.should.be.a('array');
				res.body.forEach(function(group) {
					group.should.have.property('_id');
			    	group.should.have.property('name');
			    	group.should.have.property('balance');
					group.should.have.property('userIds');
			    	group.userIds.should.be.a('array');
				});
				res.should.have.status(200);
				done();
			});
	});
});
