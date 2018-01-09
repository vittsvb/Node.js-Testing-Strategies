var assert = require("assert");
var ReviewProcess = require("../processes/review");
var Helpers = require("./helpers");
var sinon = require("sinon");
var DB = require("../db");
var Mission = require("../models/mission")

describe('The Review Process', function () {
	describe('Receiving a valid application', function () {
		var decision;
		var validApp = Helpers.validApplication;
		var review;

		before(function (done) {
			var db = Helpers.stubDb();
			sinon.stub(db, "saveAssignment").yields(null, {
				saved: true
			});
			review = new ReviewProcess({
				application: validApp,
				db: db
			});
			sinon.spy(review, "ensureAppValid");
			sinon.spy(review, "findNextMission");
			sinon.spy(review, "roleIsAvailable");
			sinon.spy(review, "ensureRoleCompatible");
			review.processApplication(function (err, result) {
				decision = result;
				done();
			})

		})

		it('returns success', function () {
			assert(decision.success, decision.message);
		})

		it('returns an assignment', function () {
			assert(decision.assignment);
		})

		it('ensures the application is valid', function () {
			assert(review.ensureAppValid.called);
		})

		it('selects a mission', function () {
			assert(review.findNextMission.called);
		})

		it('ensures a role exists', function () {
			assert(review.roleIsAvailable.called);
		})

		it('ensures role compatibility', function () {
			assert(review.ensureRoleCompatible.called);
		})
	})
});