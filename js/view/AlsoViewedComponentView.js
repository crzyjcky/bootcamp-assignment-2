var app = app || {};

app.AlsoViewedComponentView = Backbone.View.extend({
	
	tagName: "div",
	template: _.template($("#also-viewed-template").html()),
	
	render: function() {
		
		//console.log(JSON.stringify(this.collection));
		this.$el
			.html(this.template({products : this.collection.toJSON()}));
		return this;
	}
});

//template = _.template($(@template).html(), @model.toJSON())