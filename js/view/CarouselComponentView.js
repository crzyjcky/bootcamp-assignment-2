var app = app || {};

app.CarouselComponentView = Backbone.View.extend({
	
	tagName: "div",
	template: _.template($("#carousel-template").html()),
	
	render: function() {
		this.$el
			.html(this.template(this.model.toJSON()));
		return this;
	}
});

//template = _.template($(@template).html(), @model.toJSON())