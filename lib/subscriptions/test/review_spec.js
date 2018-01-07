var assert = require("assert");
var ReviewProcess = require("../processes/review");
var MembershipApplication = require("../models/membership_application");
var sinon = require("sinon");

describe('The Review Process', function () {
	describe('Receiving a valid application', function () {
		var decision;
		var validApp = new MembershipApplication({
			first: "Test",
			last: "User",
			email: "testuser@test.com",
			age: 21,
			height: 62,
			weight: 165
		})


		var review = new ReviewProcess();

		var validationSpy = sinon.spy();
		var missionSpy = sinon.spy();
		var roleAvailableSpy = sinon.spy();
		var roleCompatibleSpy = sinon.spy();

		before(function (done) {
			review.on("validated", validationSpy);
			review.on("mission-selected", missionSpy);
			review.on("role-available", roleAvailableSpy);
			review.on("role-compatible", roleCompatibleSpy);
			review.processApplication(validApp, function (err, result) {
				decision = result;
				done();
			})

		})

		it('returns success', function () {
			assert(decision.success, decision.message);
		})

		it('ensures the application is valid', function () {
			assert(validationSpy.called);
		})

		it('selects a misison', function () {
			assert(missionSpy.called);
		})

		it('ensures a role exists', function () {
			assert(roleAvailableSpy.called);
		})

		it('ensures rola compatibility', function () {
			assert(roleCompatibleSpy.called);
		})
	})
});
