var app = app || {};

app.ProductDetailModel = Backbone.Model.extend({
	//"url" : "http://localhost/sdfadfasd",
	"urlRoot" : "data/product-detail",
	
	parse: function(response) {
		
		var productDetail = {};
		
		var genericContent = response[0].genericContent;
		
		productDetail.name = genericContent.itemName;
		productDetail.shortDescription = genericContent.shortDescription;
		productDetail.longDescription = genericContent.longDescription;
		productDetail.shelfDescription = genericContent.shelfDescription;
		productDetail.warranty = genericContent.supplierWarranty;
		
		var images = [];
		var largeImages = [];
		var alternateImageData = response[0].alternateImageData;
		var imageDataLen = alternateImageData.length;
		for (var i = 0; i < imageDataLen; i++) {
			
			images.push(alternateImageData[0].imageSrc);
			largeImages.push(alternateImageData[0].lgImageSrc);
		}
		
		productDetail.images = images;
		productDetail.largeImages = largeImages;
		
		productDetail.customerRatingURL = response[0].customerRatingUrl;
		
		
		
		return productDetail;
	}
});