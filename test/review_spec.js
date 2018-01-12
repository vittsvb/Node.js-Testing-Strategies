var assert = require("assert");
var ReviewProcess = require("../processes/review");
var Helpers = require("./helpers");
var sinon = require("sinon");
var DB = require("../db");
var Mission = require("../models/mission");
var Billing = require("../processes/billing");
var _ = require("underscore")._;

describe('The Review Process', function () {
	var db = Helpers.stubDb();

	var billing = new Billing({
		stripeKey: "xxx"
	});
	before(function () {
		sinon.stub(db, "saveAssignment").yields(null, {
			saved: true
		});

		var billingStub = sinon.stub(billing, "createSubscription");

		billingStub.withArgs(Helpers.goodStripeArgs).yields(null, Helpers.goodStripeResponse);

		billingStub.withArgs(Helpers.badStripeArgs).yields("Card was declined", null);

	})

	describe('Receiving a valid application', function () {
		var decision;
		var validApp = new Helpers.validApplication();
		var review;

		before(function (done) {

			review = new ReviewProcess({
				application: validApp,
				db: db,
				billing: billing
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

		it('returns a subscription', function () {
			assert(decision.subscription);
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

	describe('Valid application, failed billing', function () {
		var decision;
		var badBillingApp = _.clone(Helpers.validApplication());
		var review;

		badBillingApp.source = "tok_chargeDeclined"

		before(function (done) {
			review = new ReviewProcess({
				application: badBillingApp,
				db: db,
				billing: billing
			});

			review.processApplication(function (err, result) {
				decision = result;
				done();
			});
		})

		it('return a false to success', function () {
			assert(!decision.success);
		})
	})

});