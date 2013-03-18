var app = app || {};

app.AppPageView = Backbone.View.extend({
	el : "#app",
	// template: _.template($("#app-template").html()),

	initialize : function(options) {

		// bind jQuery Events
		_.bindAll(this, "onBrandDropdownClicked");
		_.bindAll(this, "onTypeDropdownClicked");
		_.bindAll(this, "onSortDropdownClicked");
		_.bindAll(this, "onSizeSliderChanged")

		$brandDropdown = $("#brand-dropdown");
		$(document).on("click", "#brand-dropdown .dropdown-menu a", this.onBrandDropdownClicked);
		
		$typeDropdown = $("#type-dropdown");
		$(document).on("click", "#type-dropdown .dropdown-menu a", this.onTypeDropdownClicked);
		
		$sortDropdown = $("#sort-dropdown");
		$(document).on("click", "#sort-dropdown .dropdown-menu a", this.onSortDropdownClicked);
		
		$sizeSlider = $("#size-slider");
		$sizeSlider.slider({
			range : true,
			values : [ 0, 0 ],
			change : this.onSizeSliderChanged
		});

		$shelf = $("#shelf");

		this.$el.on("click", ".product-image", function() {
			$('#myModal').modal({
				"remote" : "data/product-detail/15105450.json"
			});
		});

		this.listenTo(this.options.productCollection, "reset",
				this.onProductCollectionReset);
		// this.listenTo(this.productDetailCollection, "reset",
		// this.onCollectionReset);
		// this.listenTo(this.reviewRatinglCollection, "reset",
		// this.onCollectionReset);

		this.options.productCollection.fetch({
			"success" : this.onProductFetchSuccess,
			"error" : this.onProductFetchError
		});
	},

	// collection events
	onProductCollectionReset : function(collection, options) {

		var productCollection = this.options.productCollection;
		
		// control panel
		// brand
		var brands = _.uniq(productCollection.pluck("brand"));
		var brandHTMLs = [];
		$.each(brands, function(i, brand) {
			brandHTMLs.push("<li><a href=\"#\">" + brand + "</a></li>");
		});
		$brandDropdownMenu = $brandDropdown.find(".dropdown-menu");
		$brandDropdownMenu.append(brandHTMLs.join(""));
		
		// type
		var types = _.uniq(productCollection.pluck("type")); 
		var typeHTMLs = [];
		$.each(types, function(i, type) {
			typeHTMLs.push("<li><a href=\"#\">" + type + "</a></li>");
		});
		$typeDropdownMenu = $typeDropdown.find(".dropdown-menu");
		$typeDropdownMenu.append(typeHTMLs.join(""));
		
		// slider
		var minSize = _.min(productCollection.pluck("size"));
		var maxSize = _.max(productCollection.pluck("size"));
		$sizeSlider = $("#size-slider");
		$sizeSlider.slider("option", "range", true);
		$sizeSlider.slider("option", "min", minSize);
		$sizeSlider.slider("option", "max", maxSize);
		$sizeSlider.slider("option", "values", [minSize, maxSize]);

		// clean up shelf display area
		$shelf.empty();

		collection.each(function(model, i) {

			var productComponentView = new app.ProductComponentView({
				model : model
			});

			$shelf.append(productComponentView.render().el);
			$shelf.find("#" + model.id + " .rating").raty({
				score : model.get("rating"),
				readOnly : true,
				width : app.Config.ratyWidth,
				path : app.Config.ratyPath
			});
		});

	},

	onProductFetchSuccess : function(response, xhr) {
		console.log("onProductFetchSuccess");
	},

	onProductFetchError : function(errorResponse, xhr) {
		console.log("onProductFetchError");
	},

	// slider events
	onSizeSliderChanged : function(e) {
		console.log("onSizeSliderChanged");
	},

	// brand dropdown events
	onBrandDropdownClicked : function(e) {
		e.preventDefault();
		
		var $brandDropdownButton = $brandDropdown.find(".btn");

		var oldValue = $brandDropdownButton.val();
		var newValue = $(e.target).text();

		if (newValue === oldValue) {

			return;
		}

		$brandDropdownButton.val(newValue);
		$brandDropdownButton.html(newValue + " <span class=\"caret\"></span>");

		this.onBrandDropdownChanged(newValue, oldValue);
	},

	onBrandDropdownChanged : function(newValue, oldValue) {
		console.log("onBrandDropdownChanged, newValue:" + newValue
				+ ", oldValue:" + oldValue);

		this.onFilterChanged();
	},

	// type dropdown events
	onTypeDropdownClicked : function(e) {
		e.preventDefault();

		
		var $typeDropdownButton = $typeDropdown.find(".btn");

		var oldValue = $typeDropdownButton.val();
		var newValue = $(e.target).text();

		if (newValue === oldValue) {
			return;
		}

		$typeDropdownButton.val(newValue);
		$typeDropdownButton.html(newValue + " <span class=\"caret\"></span>");

		this.onTypeDropdownChanged(newValue, oldValue);
	},

	onTypeDropdownChanged : function(newValue, oldValue) {
		console.log("onTypeDropdownChanged, newValue:" + newValue
				+ ", oldValue:" + oldValue);

		this.onFilterChanged();
	},

	// sort dropdown events
	onSortDropdownClicked : function(e) {
		e.preventDefault();
		
		var $sortDropdownButton = $sortDropdown.find(".btn");

		var oldValue = $sortDropdownButton.val();
		var newValue = $(e.target).text();

		if (newValue === oldValue) {
			return;
		}

		$sortDropdownButton.val(newValue);
		$sortDropdownButton.html(newValue + " <span class=\"caret\"></span>");

		this.onSortDropdownChanged(newValue, oldValue);
	},

	onSortDropdownChanged : function(newValue, oldValue) {
		console.log("onTypeDropdownChanged, newValue:" + newValue
				+ ", oldValue:" + oldValue);

		this.onFilterChanged();
	},

	// change filter
	onFilterChanged : function() {
		console.log("onFilterChanged");
	}

});