var Billing = require("./processes/billing");
var billing = new Billing({
	stripeKey: "sk_test_Gg3YQ67nr6Yxms9OEiXtm4Lp"
});

billing.createSubscription({
	email: "test3@test.com",
	name: 'Test User',
	source: "tok_chargeDeclined",
	plan: "commander"
}, function (err, res) {
	console.log(err);
	console.log(res);
});
