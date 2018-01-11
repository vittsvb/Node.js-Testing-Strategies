var async = require('async');
var assert = require('assert');
var MissionControl = require('../models/mission_control')
var DB = require("../db");
var Assignment = require("../models/assignment")

var ReviewProcess = function (args) {
	assert(args.application, "Need an application to review")
	assert(args.db, "Need a database instance")
	assert(args.billing, "Need a subscription processor")
	var app = args.application;
	var mission;
	var assignment;
	var db = args.db;
	var billing = args.billing;
	var missionControl = new MissionControl({
		db: args.db
	});
	var callback;

	//make sure the app is valid
	this.ensureAppValid = function (next) {
		if (app.isValid()) {
			next(null, true)
		} else {
			next(app.validationMessage(), null);
		}
	}

	//find the next mission
	this.findNextMission = function (next) {
		missionControl.currentMission(function (err, res) {
			if (err) {
				next(err, null)
			} else {
				mission = res;
				next(null, res)
			}
		})
	}

	//make sure role selected is available
	this.roleIsAvailable = function (next) {
		missionControl.hasSpaceForRole(app.role, next)
	}

	//make sure height/weight/ age is right for role
	this.ensureRoleCompatible = function (next) {
		assignment = new Assignment({
			passenger: app,
			role: app.role,
			mission: mission
		});
		next(null, assignment.passengerIsCompatible)
	}

	this.approveApplication = function (next) {
		db.saveAssignment({
			assignment: assignment
		}, next);
	}

	this.startSubscription = function (next) {
		//return a subscription
		billing.createSubscription({
			name: app.first + " " + app.last,
			email: app.email,
			plan: app.role,
			source: app.source
		}, next);
	}

	this.processApplication = function (next) {
		async.series({
			validated: this.ensureAppValid,
			mission: this.findNextMission,
			roleAvailable: this.roleIsAvailable,
			roleCompatible: this.ensureRoleCompatible,
			subscription: this.startSubscription,
			assignment: this.approveApplication
		}, function (err, result) {
			if (err) {
				next(null, {
					success: false,
					message: err
				})
			} else {
				//console.log(result);
				result.success = true;
				result.message = "Welcome to Mars!"
				next(null, result)
			}
		})
	}
}

module.exports = ReviewProcess;
