var app = app || {};

app.ProductCollection = Backbone.Collection.extend({
	url: "data/televisions.json",
	model: app.ProductModel,
	
	parse: function(response, options) {
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
			
			products.push(product);
		});
		
		return products;
	}
});