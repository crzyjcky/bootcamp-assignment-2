var app = app || {};

app.NavComponentView = Backbone.View.extend({
	
	tagName: "div",
	template: _.template($("#nav-template").html()),
	
	render: function() {
		this.$el
			.html(this.template(this.model.toJSON()));
		return this;
	}
});

//template = _.template($(@template).html(), @model.toJSON())