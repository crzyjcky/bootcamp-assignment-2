var app = app || {};

app.ProductComponentView = Backbone.View.extend({
	
	tagName: "div",
	className: "product",
	template: _.template($("#product-template").html()),
	render: function() {
		this.$el
			.attr("id", "product-" + this.model.id)
			//.css("display", "none")
			.html(this.template(this.model.toJSON()));
		return this;
	}
});