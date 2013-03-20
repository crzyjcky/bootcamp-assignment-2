var app = app || {};

app.AppPageView = Backbone.View
		.extend({
			el : "#app",
			// template: _.template($("#app-template").html()),

			initialize : function(options) {

				// bind jQuery Events
				_.bindAll(this, "onBrandDropdownClicked");
				_.bindAll(this, "onTypeDropdownClicked");
				_.bindAll(this, "onSortDropdownClicked");
				_.bindAll(this, "onSizeSliderChanged");
				_.bindAll(this, "onClearFiltersButtonClicked");
				_.bindAll(this, "onWindowResized");
				_.bindAll(this, "onProductImageClicked");
				_.bindAll(this, "onPanelCloseButtonClicked");
				_.bindAll(this, "onProductDetailFetchSuccess");
				//_.bindAll(this, "updatePanel");

				$brandDropdown = $("#brand-dropdown");
				$(document).on("click", "#brand-dropdown .dropdown-menu a",
						this.onBrandDropdownClicked);

				$typeDropdown = $("#type-dropdown");
				$(document).on("click", "#type-dropdown .dropdown-menu a",
						this.onTypeDropdownClicked);

				$sortDropdown = $("#sort-dropdown");
				$(document).on("click", "#sort-dropdown .dropdown-menu a",
						this.onSortDropdownClicked);

				// should assign slider callback after productcollection fetch
				// complete,
				// otherwise generates unwanted events
				$sizeSlider = $("#size-slider");
				$sizeSlider.slider({
					range : true,
					values : [ 0, 0 ],
					change : this.onSizeSliderChanged
				});

				$clearFiltersButton = $("#clear-filters-button");
				$clearFiltersButton.on("click",
						this.onClearFiltersButtonClicked);

				$(window).on("resize", this.onWindowResized);

				$shelf = $("#shelf");

				this.listenTo(this.options.productCollection, "reset",
						this.onProductCollectionReset);
				this.listenTo(this.options.productDetailCollection, "reset", this.onProductDetailCollectionReset);
				this.listenTo(this.options.productDetailCollection, "add", this.onProductDetailCollectionAdded);
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
				_.each(brands,
						function(brand, i) {
							brandHTMLs.push("<li><a href=\"#\">" + brand
									+ "</a></li>");
						});
				$brandDropdownMenu = $brandDropdown.find(".dropdown-menu");
				$brandDropdownMenu.append(brandHTMLs.join(""));

				// type
				var types = _.uniq(productCollection.pluck("type"));
				var typeHTMLs = [];
				_.each(types, function(type, i) {
					typeHTMLs.push("<li><a href=\"#\">" + type + "</a></li>");
				});
				$typeDropdownMenu = $typeDropdown.find(".dropdown-menu");
				$typeDropdownMenu.append(typeHTMLs.join(""));

				// slider
				var minSize = _.min(productCollection.pluck("size"));
				var maxSize = _.max(productCollection.pluck("size"));
				$sizeSlider.slider("option", "range", true);
				$sizeSlider.slider("option", "min", minSize);
				$sizeSlider.slider("option", "max", maxSize);

				$sizeSlider.slider("option", "values", [ minSize, maxSize ]);

				// control panel
				$("#control-panel").fadeTo(0, 1.0);

				// clean up shelf display area
				$shelf.empty();

				// render individual product view
				collection.each(function(model, i) {

					var productComponentView = new app.ProductComponentView({
						model : model
					});

					$shelf.append(productComponentView.render().el);
					

					/*
					$shelf.find("#" + model.id + " .rating").raty({
						score : model.get("rating"),
						readOnly : true,
						width : app.Config.ratyWidth,
						path : app.Config.ratyPath
					});
					*/
					
					var panelComponentView = new app.PanelComponentView({"id" : "panel-" + model.id});
					
					$("#product-" + model.id + " .product-image").popover({
						html : true,
						//trigger : "manual",
						content : panelComponentView.render().el, 
						container: "body",
						trigger: "manual",
						template: '<div class="popover"><div class="arrow"></div><div class="popover-inner myclass"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
						//template: '<div class="popover"><div class="arrow"></div><div class="popover-inner my-popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
					});
				});
				
				$shelf.find(".rating").raty({
					score: function() {
						return $(this).data("score");
					},
					
					readOnly : true,
					width : app.Config.ratyWidth,
					path : app.Config.ratyPath
				});

				$(document).on("click", ".product-image",
						this.onProductImageClicked);
				$(document).on("click", ".panel .close", this.onPanelCloseButtonClicked);
				
				this.onFilterChanged();
			},

			onProductFetchSuccess : function(response, xhr) {
				console.log("onProductFetchSuccess");
			},

			onProductFetchError : function(errorResponse, xhr) {
				console.log("onProductFetchError");
			},
			
			// product detail collection events
			onProductDetailCollectionAdded : function(collection) {
				
				console.log("onProductDetailCollectionAdded");
			},
			
			onProductDetailCollectionReset : function(collection) {
				
				console.log("onProductDetailCollectionReset");
			},
			
			onProductDetailFetchSuccess : function(model, response, options) {
				console.log("onProductDetailFetchSuccess");
				this.options.productDetailCollection.add(model);
				
				this.updatePanel(model);
			},
			
			onProductDetailFetchError : function(model, xhr, options) {
				console.log("onProductDetailFetchError");
			},

			// clear filters button
			onClearFiltersButtonClicked : function(e) {
				$brandDropdown.find(".dropdown-menu a:first").trigger("click");
				$typeDropdown.find(".dropdown-menu a:first").trigger("click");
				$sortDropdown.find(".dropdown-menu a:first").trigger("click");

				var sizeLow = $sizeSlider.slider("option", "min");
				var sizeHigh = $sizeSlider.slider("option", "max");

				$sizeSlider.slider("option", "values", [ sizeLow, sizeHigh ]);

				this.onFilterChanged();
			},

			// slider events
			onSizeSliderChanged : function(e) {
				this.onFilterChanged();
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
				$brandDropdownButton.html(newValue
						+ " <span class=\"caret\"></span>");

				this.onBrandDropdownChanged(newValue, oldValue);
			},

			onBrandDropdownChanged : function(newValue, oldValue) {

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
				$typeDropdownButton.html(newValue
						+ " <span class=\"caret\"></span>");

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
				$sortDropdownButton.html(newValue
						+ " <span class=\"caret\"></span>");

				this.onSortDropdownChanged(newValue, oldValue);
			},

			onSortDropdownChanged : function(newValue, oldValue) {
				console.log("onTypeDropdownChanged, newValue:" + newValue
						+ ", oldValue:" + oldValue);

				this.onFilterChanged();
			},

			// change filter
			onFilterChanged : function() {

				var sizeLow = $sizeSlider.slider("values", 0)
				var sizeHigh = $sizeSlider.slider("values", 1);
				var brand = $brandDropdown.find("button").val();
				var type = $typeDropdown.find("button").val();
				var sort = $sortDropdown.find("button").val();

				console.log("sizeLow:" + sizeLow + ", sizeHigh:" + sizeHigh
						+ ",brand:" + brand + ", type:" + type + ", sort:"
						+ sort);

				var filteredModels = this.options.productCollection
						.filterAndSort([ sizeLow, sizeHigh ], type, brand, sort);
				var rejectedModels = _.difference(
						this.options.productCollection.models, filteredModels);

				this.filteredModels = filteredModels;
				this.rejectedModels = rejectedModels;

				var $matchCount = $("#match-count");
				var matchCount = filteredModels.length;
				$matchCount.text(matchCount + " "
						+ (matchCount === 0 ? "MATCH" : "MATCHES"));

				this.doLayout();
			},

			onWindowResized : function(e) {

				this.doLayout();
			},

			onProductImageClicked : function(e) {

				e.preventDefault();
				e.stopPropagation();

				var productId = $(e.target).closest(".product").attr("id");
				
				$productImage = $(".product-image");
				
				// close other and allow only one popover
				// it's hacky.
				_.each($productImage, function(item, i) {
					if (item !== e.target) {
						$(item).popover("hide"); 
					}
				});
				
				$(e.target).popover("show");
				
				var productDetailModel = this.options.productDetailCollection.get(this.toId(productId));
				if (productDetailModel !== undefined) {
					
					console.log("productDetailModel exists");
					
					this.updatePanel(productDetailModel);
				} else {
					
					productDetailModel = new app.ProductDetailModel({"id" : this.toId(productId)});
					productDetailModel.fetch({
						"success" : this.onProductDetailFetchSuccess,
						"error" : this.onProductDetailFetchError
					});
				}
				
				/*
				var productDetailModel = new app.ProductDetailModel({"id" : this.toId(productId)});
				productDetailModel.fetch({
					"success" : function() {console.log("model fetch success"); console.log(productDetailModel);},
					"error" : function() {console.log("model fetch error")}
				});
				 */
								
			},

			onPanelCloseButtonClicked : function(e) {
				e.preventDefault();
				e.stopPropagation();

				$(".product-image").popover("hide");
			},
			
			// helper function
			updatePanel : function(model) {
				
				var $panel = $("#panel-" + model.id);
				var $generalInfo = $panel.find(".general-info");
				var $productDetails = $panel.find(".product-details");
				var $recommendation = $panel.find(".recommendation");
				
				$generalInfo.find(".name").html(model.get("name"));
				$generalInfo.find(".customer-rating").attr("src", model.get("customerRatingURL"));
				
				var carouselComponentView = new app.CarouselComponentView({model : model});
				$generalInfo.find(".product-carousel").html(carouselComponentView.render().el);
				$generalInfo.find(".about").html(model.get("shortDescription").substring(0, app.Config.aboutMaxLength) + "<a class=\"btn btn-link\">...Continue Reading</a>");
				
				var alsoViewedComponentView = new app.AlsoViewedComponentView({collection : this.options.productCollection});
				$recommendation.find(".also-viewed").html(alsoViewedComponentView.render().el);
				
				var navComponentView = new app.NavComponentView({model : model});
				$productDetails.find(".nav").html(navComponentView.render().el);
				
				$panel.find(".rating").raty({
					score: function() {
						return $(this).data("score");
					},
					
					readOnly : true,
					width : app.Config.ratyWidth,
					path : app.Config.ratyPath
				});
			},
			
			toId : function(productId) {
				
				return productId.split("-")[1];
			},
			
			doLayout : function() {

				_.each(this.rejectedModels, function(model, i) {

					$("#product-" + model.id).hide();
				});

				var shelfWidth = $shelf.width();
				var numProductPerRow = Math.floor(shelfWidth
						/ app.Config.productWidth);

				var row = 0, col = 0;

				_.each(this.filteredModels, function(model, i) {
					col = i % numProductPerRow;
					row = Math.floor(i / numProductPerRow);

					var id = model.id;
					var $product = $("#product-" + id);

					$product.css({
						"width" : app.Config.productWidth,
						"height" : app.Config.productHeight
					});
					$product.show();

					var left = shelfWidth / numProductPerRow;
					$product.animate({
						"left" : col * left + "px",
						"top" : row * app.Config.productHeight + "px"
					}, app.Config.animationDuration);

				});

				$shelf.animate({
					height : (row + 1) * app.Config.productHeight
				}, app.Config.animationDuration);
			}

		});