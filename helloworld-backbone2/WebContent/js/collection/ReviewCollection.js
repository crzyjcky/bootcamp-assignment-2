var app = app || {};

app.ReviewCollection = Backbone.Collection.extend({
	url: "data/ratings-reviews.json",
	model: app.ReviewModel
});