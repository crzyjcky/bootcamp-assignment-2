var app = app || {};

app.PanelComponentView = Backbone.View.extend({
	
	tagName: "div",
	className: "panel",
	template: _.template($("#panel-template").html()),
	
	render: function() {
		
		console.log();
		
		this.$el
			.attr("id", this.id)
			.html(this.template());
		
		//console.log("this." + $(this).html());
		return this;
	}
});