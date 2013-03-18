var app = app || {};

app.ProductDetailCollection = Backbone.Collection.extend({
	model: app.ProductDetailModel,
	url: "data/product-detail",
	
	parse: function(response, options) {
		
		return response;
	}
});