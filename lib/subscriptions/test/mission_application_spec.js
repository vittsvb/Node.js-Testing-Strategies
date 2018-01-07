var assert = require("assert");
var MembershipApplication = require('../models/membership_application');

describe("New user singup", function () {
	var validApp;

	before(function () {
		validApp = new MembershipApplication({
			first: "Test",
			last: "User",
			email: "testuser@test.com",
			age: 21,
			height: 62,
			weight: 165
		})
	})

	describe("Application valid if...", function () {
		it("all validators successful", function () {
			assert(validApp.isValid(), "Not Valid!");
		});
		it("email is 4 or more chars and contains @", function () {
			assert(validApp.emailIsValid(), "Not Valid!")
		});
		it("height is between 60 and 75", function () {
			assert(validApp.heightIsValid(), "Not Valid!")
		});
		it("age is between 15 and 100", function () {
			assert(validApp.ageIsValid(), "Not Valid!")
		});
		it("weight is between 100 and 300", function () {
			assert(validApp.weightIsValid(), "Not Valid!")
		});
		it("first and last name are provided", function () {
			assert(validApp.emailIsValid(), "Not Valid!")
		});
	})

	describe("Application invalid if...", function () {

		it("is expired", function () {
			var app = new MembershipApplication({
				validUntil: Date.parse('01/01/2018')
			});
			assert(app.expired());
		})

		it('email is 4 chars or less', function () {
			var app = new MembershipApplication({
				email: 'a@a'
			});
			assert(!app.emailIsValid());
		})

		it('email does not contain an @', function () {
			var app = new MembershipApplication({
				email: 'test.test.com'
			});
			assert(!app.emailIsValid());
		})

		it('email is omitted', function () {
			var app = new MembershipApplication();
			assert(!app.emailIsValid());
		})

		it('height is less than 60', function () {
			var app = new MembershipApplication({
				height: 55
			});
			assert(!app.heightIsValid());
		})

		it('height is more than 75', function () {
			var app = new MembershipApplication({
				height: 80
			});
			assert(!app.heightIsValid());
		})

		it('height is omitted', function () {
			var app = new MembershipApplication();
			assert(!app.heightIsValid());
		})

		it('age is more than 100', function () {
			var app = new MembershipApplication({
				age: 101
			});
			assert(!app.ageIsValid());
		})

		it('age is less than 15', function () {
			var app = new MembershipApplication({
				age: 10
			});
			assert(!app.ageIsValid());
		})

		it('age is omitted', function () {
			var app = new MembershipApplication();
			assert(!app.ageIsValid());
		})

		it('weight less than 100', function () {
			var app = new MembershipApplication({
				weight: 90
			});
			assert(!app.weightIsValid());
		})

		it('weight more than 300', function () {
			var app = new MembershipApplication({
				weight: 301
			});
			assert(!app.weightIsValid());
		})

		it('weight is omitted', function () {
			var app = new MembershipApplication();
			assert(!app.weightIsValid());
		})

		it('first name is omitted', function () {
			var app = new MembershipApplication();
			assert(!app.nameIsValid());
		})

		it('last name is omitted', function () {
			var app = new MembershipApplication();
			assert(!app.nameIsValid());
		})


	})
})
