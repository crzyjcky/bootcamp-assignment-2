var app = app || {};

app.ProductCollection = Backbone.Collection.extend({
	url : "data/televisions.json",
	model : app.ProductModel,

	parse : function(response, options) {
		var products = [];

		_.each(response, function(data, i) {
			var product = {};

			var urlTokens = data.url.split("/");
			product.id = urlTokens[urlTokens.length - 1];
			product.name = data.name;
			product.listPrice = data.listPrice;
			product.price = data.price;
			product.image = data.image;
			product.description = data.description;
			product.type = data.type;
			product.brand = data.brand;
			product.rating = data.rating;
			product.size = data.size;

			products.push(product);
		});

		return products;
	},

	filterAndSort : function(range, type, brand, sort) {

		var filteredModels = this.models;
		var low = range[0];
		var high = range[1];

		filteredModels = _.filter(filteredModels, function(model) {
			return ((model.get("size") >= low) && (model.get("size") <= high))
					&& ((type === "All") || model.get("type") === type)
					&& ((brand === "All") || model.get("brand") === brand);
		});

		// key in javascript object is in lower case
		var fieldName = sort.toLowerCase();
		filteredModels = _.sortBy(filteredModels, function(model) {
			return model.get(fieldName);
		});

		return filteredModels;
	}
});