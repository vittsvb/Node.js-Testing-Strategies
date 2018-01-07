var assert = require("assert");
var ReviewProcess = require("../processes/review");
var MembershipApplication = require("../models/membership_application");

describe('The Review Process', function () {
	describe('Receiving a valid application', function () {
		var decision;
		before(function (done) {
			validApp = new MembershipApplication({
				first: "Test",
				last: "User",
				email: "testuser@test.com",
				age: 21,
				height: 62,
				weight: 165
			})


			var review = new ReviewProcess();
			review.processApplication(validApp, function (err, result) {
				decision = result;
				done();
			})

		})

		it('returns success', function () {
			assert(decision.success, decision.message);
		})
	})
});
